import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { apiFetch, isApiError, apiHost } from 'api'
import Constants from 'expo-constants'
import { Platform, AsyncStorage } from 'react-native'
import { timeout } from 'helpers'
import { Duration } from 'luxon'
import { asyncStorageKeys } from 'async-storage'

function load(
  instance: ReturnType<typeof useUserStoreInstance>,
  setState: (state: UserStore['state']) => void,
) {
  const boundLoad = () => {
    load(instance, setState)
  }

  return apiFetch('me', {
    method: 'GET',
  })
    .then((res) => {
      if (instance.unmounted) return
      instance.exponentialBackof = 100
      if (res.code === 'NOT_LOGGED_IN') {
        setState({ loading: false, user: null })
      } else {
        setState({ loading: false, user: { id: res.id, email: res.email } })
      }
      instance.clearTimeout?.()
      // refetch login status every day if app is not reset
      instance.clearTimeout = timeout({ day: 1 }, boundLoad)
    })
    .catch((e) => {
      console.warn(e)
      instance.exponentialBackof *= 2
      if (
        instance.exponentialBackof >
        Duration.fromObject({ minute: 2 }).as('millisecond')
      )
        instance.exponentialBackof = 30000
      instance.clearTimeout?.()
      instance.clearTimeout = timeout(instance.exponentialBackof, boundLoad)
    })
}
function useUserStoreInstance() {
  return useRef({
    clearTimeout: null as (() => void) | null,
    exponentialBackof: 100,
    unmounted: false,
  }).current
}

export function useUserStore() {
  const [state, setState] = useState({
    loading: true,
    user: null as { id: string; email: string } | null,
  })
  const instance = useUserStoreInstance()
  const fromCache = useUserFromAsyncStorage(state)

  useEffect(() => {
    load(instance, setState)
    return () => {
      instance.unmounted = true
      instance.clearTimeout?.()
    }
  }, [instance])

  const login = useCallback(
    (options: { email: string; password: string }): Promise<string | false> => {
      return apiFetch<{}>('login', {
        method: 'POST',
        body: { ...options, extra: getDeviceInfo() },
      })
        .then(() => load(instance, setState))
        .then(
          () => false,
          (reason) => {
            if (isApiError(reason)) return reason.message
            throw reason
          },
        )
    },
    [instance],
  )

  const resState = !state.loading
    ? state
    : !fromCache.loading
    ? fromCache
    : null
  return useMemo(
    () => ({ state: resState ?? { loading: true, user: null }, login }),
    [resState, login],
  )
}
export type UserStore = ReturnType<typeof useUserStore>

export function getDeviceInfo() {
  const ret: { [key: string]: string | number | null | undefined | boolean } = {
    deviceYearClass: Constants?.deviceYearClass,
    deviceName: Constants?.deviceName,

    installationId: Constants?.installationId,
    appOwnership: Constants?.appOwnership,
    expoVersion: Constants?.expoVersion,
    osName: Platform?.OS,
    osVersion: Platform?.Version,
    simulator: !Constants?.isDevice,
    apiHost,
  }

  ret.expoReleaseChannel = Constants?.manifest?.releaseChannel
  ret.expoAppVersion = Constants?.manifest?.version
  ret.expoAppPublishedTime = Constants?.manifest?.publishedTime
  ret.expoSdkVersion = Constants?.sdkVersion
  ret.model = Constants?.platform?.ios?.model || 'n/a'
  if (typeof window !== 'undefined' && window?.location)
    ret.webOrigin = window.location.protocol + '//' + window.location.host

  if (Constants.platform?.web) ret.webUa = Constants.platform?.web.ua

  return ret
}

function useUserFromAsyncStorage(remoteUser: UserStore['state']) {
  const [state, setState] = useState({
    loading: true,
    user: null as { id: string; email: string } | null,
  })
  useEffect(() => {
    AsyncStorage.getItem(asyncStorageKeys.user)
      .then((v) => {
        if (!v) return v
        return JSON.parse(v)
      })
      .then((user) => {
        setState({ loading: false, user })
      })
      .catch((e) => {
        console.warn(e)
      })
  }, [])
  useEffect(() => {
    if (!remoteUser.loading)
      AsyncStorage.setItem(
        asyncStorageKeys.user,
        JSON.stringify(remoteUser.user),
      )
  }, [remoteUser])
  return state
}
