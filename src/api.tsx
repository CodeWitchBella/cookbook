import Constants from 'expo-constants'

const localhost = window.location.host.split(':')[0] === 'localhost'
export const apiHost = localhost
  ? 'https://localhost:8000'
  : JSON.stringify(Constants, null, 2) //'kucharka.skorepova.info'
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

function ApiError(message: string) {
  const error = new Error(message)
  // @ts-ignore
  error[apiError] = true
  return error
}

export function isApiError(error: any): error is Error {
  return !!(typeof error === 'object' && error && (error as any)[apiError])
}
