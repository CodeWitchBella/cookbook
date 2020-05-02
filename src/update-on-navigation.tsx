import { useState, useEffect, useRef } from 'react'
import * as Updates from 'expo-updates'
import { onDeploymentChange } from 'api'
// @ts-ignore
import { useLocation } from 'react-router-dom'

export function UpdateOnNavigation() {
  const status = useUpdateStatus()
  useEffect(() => {
    console.log('Update status:', status)
  }, [status])
  const location = useLocation()
  const lastLocation = useRef(location)
  useEffect(() => {
    if (
      lastLocation.current.pathname !== location.pathname &&
      status === 'downloaded'
    ) {
      Updates.reloadAsync()
    }
    lastLocation.current = location
  }, [location, status])
  return null
}

function useUpdateStatus() {
  const [status, setStatus] = useState<
    'loading' | 'downloading' | 'downloaded' | 'updated'
  >('loading')

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
