import { MiniEventTarget } from 'mini-event-target'
import { Platform } from 'react-native'
import { useState, useEffect } from 'react'
import { onDeploymentChange } from 'api'
import * as Updates from 'expo-updates'

type UpdateStatus =
  | 'loading'
  | 'downloading'
  | 'downloaded'
  | 'updated'
  | 'failed'

let updateStatus: UpdateStatus = 'loading'
const eventTarget = new MiniEventTarget<UpdateStatus>()
let swReg: ServiceWorkerRegistration | null = null
function swChangeStatus(status: UpdateStatus) {
  updateStatus = status
  eventTarget.emit(status)
}

if (Platform.OS === 'web' && navigator.serviceWorker) {
  navigator.serviceWorker.ready.then((reg) => {
    swReg = reg
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
} else {
  Updates.addListener((event) => {
    if (event.type === 'noUpdateAvailable') {
      swChangeStatus('updated')
    } else if (event.type === 'updateAvailable') {
      swChangeStatus('downloading')
      Updates.fetchUpdateAsync()
        .then(() => {
          swChangeStatus('downloaded')
        })
        .catch((e) => {
          swChangeStatus('failed')
          console.warn(e)
        })
    }
  })
}
onDeploymentChange(checkUpdate)

export function useUpdateStatus() {
  const [status, setStatus] = useState(updateStatus)
  useEffect(() => eventTarget.listen(setStatus), [])
  return status
}

export function reloadToUpdate() {
  if (Platform.OS === 'web') {
    window.location.reload()
  } else {
    Updates.reloadAsync()
  }
}

let updateInFlight = false
export function checkUpdate() {
  if (updateInFlight) return
  updateInFlight = true
  if (Platform.OS === 'web') {
    swReg
      ?.update()
      .catch((e) => console.warn(e))
      .then(() => {
        updateInFlight = false
      })
  } else {
    Updates.checkForUpdateAsync()
      .then(({ isAvailable }) => {
        if (isAvailable) {
          swChangeStatus('downloading')
          return Updates.fetchUpdateAsync().then(() => {
            swChangeStatus('downloaded')
          })
        }
      })
      .catch((e) => {
        swChangeStatus('failed')
        console.warn(e)
      })
      .then(() => {
        updateInFlight = false
      })
  }
}
