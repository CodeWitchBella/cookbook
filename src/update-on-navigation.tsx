import { useEffect, useRef } from 'react'
// @ts-ignore
import { useLocation } from 'react-router-dom'
import { Platform } from 'react-native'
import { useUpdateStatus, reloadToUpdate, checkUpdate } from 'updates'

if (Platform.OS === 'web') {
  navigator.serviceWorker.addEventListener('message', () => {})
}

export function UpdateOnNavigation() {
  const status = useUpdateStatus()
  useEffect(() => {
    console.log('Update status:', status)
  }, [status])
  const location = useLocation()
  const lastLocation = useRef(location)
  useEffect(() => {
    const pathnamechanged = lastLocation.current.pathname !== location.pathname
    if (pathnamechanged && status === 'updated') {
      checkUpdate()
    }
    if (pathnamechanged && status === 'downloaded') {
      console.log('reloading to update')
      reloadToUpdate()
    }
    lastLocation.current = location
  }, [location, status])
  return null
}
