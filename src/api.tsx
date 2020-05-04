import { AsyncStorage } from 'react-native'
import { asyncStorageKeys } from 'async-storage'
import { MiniEventTarget } from 'mini-event-target'

const localhost = window.location.host.split(':')[0] === 'localhost'
export const apiHost = localhost
  ? 'https://localhost:8000'
  : 'https://kucharka.skorepova.info'
const apiError = Symbol()

export function apiFetch<T extends {}>(
  endpoint: string,
  options: {
    credentials?: 'omit'
    headers?: { [key: string]: string }
  } & ({ method: 'GET' } | { method: 'POST'; body: { [key: string]: any } }),
) {
  const body = 'body' in options ? JSON.stringify(options.body) : undefined
  return fetch(apiHost + '/api/' + endpoint, {
    credentials: options.credentials || 'include',
    method: options.method,
    body: body,
    headers: {
      'content-type': 'application/json',
      ...options.headers,
    },
  })
    .then((res) => {
      onDeployment(res.headers.get('x-deployment') ?? '')
      if (res.status === 304) {
        return res.text().then((v) => (v.startsWith('{') ? JSON.parse(v) : v))
      }
      if (res.status === 200) return res.json()
      return res.text()
    })
    .then((res) => {
      if (typeof res === 'string') throw ApiError(res)
      return res
    })
}

const deploymentChangeListeners = new MiniEventTarget<string>()
export const onDeploymentChange = deploymentChangeListeners.listen

let lastDeployment = AsyncStorage.getItem(asyncStorageKeys.lastDeployment)
function onDeployment(dep: string) {
  if (!dep) return
  lastDeployment
    .then((last) => {
      if (last !== dep) {
        deploymentChangeListeners.emit(dep)
      }
      lastDeployment = Promise.resolve(dep)
    })
    .catch((e) => {
      console.warn(e)
    })
}

function ApiError(message: string) {
  const error = new Error(message)
  // @ts-ignore
  error[apiError] = true
  return error
}

export function isApiError(error: any): error is Error {
  return !!(typeof error === 'object' && error && (error as any)[apiError])
}
