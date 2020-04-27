import { NowRequest, NowResponse } from '@now/node'

export function promiseRequest(handler: (req: NowRequest) => Promise<any>) {
  return (req: NowRequest, res: NowResponse) => {
    handler(req)
      .then((json) => res.json(json))
      .catch((e) => {
        res.statusCode = 500
        res.json({ error: e.stack })
      })
  }
}
