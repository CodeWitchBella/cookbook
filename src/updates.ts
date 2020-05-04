import { MiniEventTarget } from 'mini-event-target'
import { Platform } from 'react-native'
import { useState, useEffect } from 'react'
import { onDeploymentChange } from 'api'
import * as Updates from 'expo-updates'

type UpdateStatus = 'loading' | 'downloading' | 'downloaded' | 'updated'

let swUpdateStatus: UpdateStatus = 'loading'
const swEventTarget = new MiniEventTarget<UpdateStatus>()

if (Platform.OS === 'web' && navigator.serviceWorker) {
  const swChangeStatus = (status: UpdateStatus) => {
    swUpdateStatus = status
    swEventTarget.emit(status)
  }

  navigator.serviceWorker.ready.then((reg) => {
    if (reg.installing) swChangeStatus('downloading')
    else if (reg.waiting) swChangeStatus('downloaded')
    else swChangeStatus('updated')

    // latest worker
    let newWorker: ServiceWorker | null = null

    const onChangeState = () => {
      if (!newWorker) return
      // "installing" - the install event has fired, but not yet complete
      // "installed"  - install complete
      // "activating" - the activate event has fired, but not yet complete
      // "activated"  - fully active
      // "redundant"  - discarded. Either failed install, or it's been
      //                replaced by a newer version
      const { state } = newWorker
      if (state === 'installing') swChangeStatus('downloading')
      else if (
        state === 'installed' ||
        state === 'activating' ||
        state === 'activated'
      ) {
        swChangeStatus('downloaded')
      }
    }

    reg.addEventListener('updatefound', () => {
      // A wild service worker has appeared in reg.installing!
      const w = reg.installing
      if (!w) return
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      if (newWorker) newWorker.removeEventListener('statechange', onChangeState)
      newWorker = w

      onChangeState()

      newWorker.addEventListener('statechange', onChangeState)
    })
  })
}

function useUpdateStatusWeb() {
  const [status, setStatus] = useState(swUpdateStatus)
  useEffect(() => swEventTarget.listen(setStatus), [])
  return status
}

function useUpdateStatusNative() {
  const [status, setStatus] = useState<UpdateStatus>('loading')

  useEffect(() => {
    let ended = false
    const subscription = Updates.addListener((event) => {
      if (event.type === 'noUpdateAvailable') {
        setStatus('updated')
      } else if (event.type === 'updateAvailable') {
        setStatus('downloading')
        Updates.fetchUpdateAsync()
          .then(() => {
            if (ended) return
            setStatus('downloaded')
          })
          .catch((e) => {
            console.warn(e)
          })
      }
    })
    const disposeDepChange = onDeploymentChange(() => {
      Updates.checkForUpdateAsync().then(({ isAvailable }) => {
        if (isAvailable) {
          setStatus('downloading')
          return Updates.fetchUpdateAsync()
            .then(() => {
              if (ended) return
              setStatus('downloaded')
            })
            .catch((e) => {
              console.warn(e)
            })
        }
      })
    })
    return () => {
      ended = true
      subscription.remove()
      disposeDepChange()
    }
  }, [])
  return status
}

export const useUpdateStatus: () => UpdateStatus =
  Platform.OS === 'web' ? useUpdateStatusWeb : useUpdateStatusNative

export function reloadToUpdate() {
  if (Platform.OS === 'web') {
    window.location.reload()
  } else {
    Updates.reloadAsync()
  }
}
