import { NowRequest, NowResponse } from '@now/node'
import { firestore } from './firestore'

export default (req: NowRequest, res: NowResponse) => {
  handle(req)
    .then((json) => res.json(json))
    .catch((e) => {
      res.statusCode = 500
      res.json({ error: e.stack })
    })
}

async function handle(req: NowRequest) {
  const doc = await firestore.collection('log').add(req.query)
  const getted = await doc.get()
  return getted.data()
}
