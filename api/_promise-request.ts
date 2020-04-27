import { NowRequest, NowResponse } from '@now/node'

export function promiseRequest(
  handler: (req: NowRequest, res: NowResponse) => Promise<any>,
) {
  return (req: NowRequest, res: NowResponse) => {
    handler(req, res)
      .then((json) => {
        if (typeof json === 'string') res.send(json)
        else res.json(json)
      })
      .catch((e) => {
        res.statusCode = 500
        res.json({ error: e.stack })
      })
  }
}
