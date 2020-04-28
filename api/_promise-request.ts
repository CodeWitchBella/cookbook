import { NowRequest, NowResponse } from '@now/node'

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
export function checkCSRF(req: NowRequest) {
  if (req.method !== 'POST') {
    throw createSpecialError('Method not allowed', 405)
  }
  if (req.headers.origin !== VERCEL_URL) {
    throw createSpecialError('Forbidden', 403)
  }
}
