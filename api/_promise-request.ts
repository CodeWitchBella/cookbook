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

const { VERCEL_URL } = process.env
export function checkCSRF(req: NowRequest, method = 'POST') {
  if (req.method !== method) {
    throw createSpecialError('Method not allowed', 405)
  }
  if (req.headers.origin !== 'https://' + VERCEL_URL) {
    throw createSpecialError(
      'Forbidden ' + req.headers.origin + ' ' + VERCEL_URL,
      403,
    )
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
