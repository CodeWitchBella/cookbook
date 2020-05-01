import { NowRequest, NowResponse } from '@now/node'
import { firestore } from './_firestore'
import { DateTime } from 'luxon'

const specialError = Symbol()

export function promiseRequest(
  handler: (req: NowRequest, res: NowResponse) => Promise<any>,
) {
  return (req: NowRequest, res: NowResponse) => {
    handler(req, res)
      .then((json) => {
        respond(json, res)
      })
      .catch((e) => {
        if (specialError in e) {
          if (typeof e.status === 'number') res.status(e.status)
          respond(e[specialError], res)
          return
        }
        res.statusCode = 500
        res.json({ error: e.stack })
      })
  }
}

function respond(value: any, res: NowResponse) {
  if (typeof value === 'string') res.send(value)
  else res.json(value)
}

function createSpecialError(body: string, status?: number) {
  return { [specialError]: body, status: 405 }
}

export function checkCSRF(req: NowRequest, method = 'POST') {
  if (req.method !== method) {
    throw createSpecialError('Method not allowed', 405)
  }
  const url = req.headers['x-now-deployment-url']
  if (
    ![url, 'kucharka.skorepova.info']
      .map((host) => 'https://' + host)
      .includes(getFirst(req.headers.origin) || '')
  ) {
    throw createSpecialError('Forbidden', 403)
  }
  if (
    method === 'POST' &&
    getFirst(req.headers['content-range']) !== 'application/json'
  ) {
    throw createSpecialError('Bad content-type', 403)
  }
}

export async function loggedInUserId(req: NowRequest): Promise<string | null> {
  const key = req.cookies.session
  if (!key) return null
  const session = await firestore.collection('session').doc(key).get()
  if (!session.exists) return null
  if (DateTime.fromISO(session.get('expires')) < DateTime.utc()) {
    return null
  }
  return session.get('user') || null
}

export function getFirst<T>(o: undefined | T | T[]): T | undefined {
  if (Array.isArray(o)) return o[0]
  return o
}
