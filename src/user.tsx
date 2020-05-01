import { useState, useEffect, useMemo, useCallback } from 'react'
import { apiFetch, isApiError } from 'api'

export function useUserStore() {
  const [state, setState] = useState({
    loading: true,
    user: null as { id: string; email: string } | null,
  })
  const [reloadCounter, setReloadCounter] = useState(0)

  useEffect(() => {
    function noop(_: number) {}
    noop(reloadCounter) // use it so that I don't accidentaly remove it from deps

    let cancelled = false
    let timeout: ReturnType<typeof setTimeout> | null = null
    let exponentialBackof = 100
    const load = () => {
      timeout = null
      apiFetch('me?_now_no_cache=1', {
        method: 'GET',
      })
        .then((res) => {
          if (cancelled) return
          exponentialBackof = 100
          if (res.code === 'NOT_LOGGED_IN') {
            setState({ loading: false, user: null })
          } else {
            setState({ loading: false, user: { id: res.id, email: res.email } })
          }
          if (timeout) clearTimeout(timeout)
          // refetch login status every day if app is not reset
          timeout = setTimeout(load, 1000 * 3600 * 24)
        })
        .catch((e) => {
          console.warn(e)
          exponentialBackof *= 2
          if (exponentialBackof > 120000) exponentialBackof = 30000
          if (timeout) clearTimeout(timeout)
          timeout = setTimeout(load, exponentialBackof)
        })
    }
    load()
    return () => {
      cancelled = true
      if (timeout) clearTimeout(timeout)
    }
  }, [reloadCounter])
  const login = useCallback(
    (options: { email: string; password: string }): Promise<string | false> => {
      return apiFetch<{}>('login', {
        method: 'POST',
        body: options,
      }).then(
        () => {
          setReloadCounter((v) => v + 1) // reload user
          return false
        },
        (reason) => {
          if (isApiError(reason)) return reason.message
          throw reason
        },
      )
    },
    [],
  )

  return useMemo(() => ({ state, login }), [state, login])
}
export type UserStore = ReturnType<typeof useUserStore>
