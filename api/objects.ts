import { NowRequest, NowResponse } from '@now/node'
import { firestore } from './_firestore'
import { DateTime } from 'luxon'

export default (req: NowRequest, res: NowResponse) => {
  handle(req)
    .then((json) => res.json(json))
    .catch((e) => {
      res.statusCode = 500
      res.json({ error: e.stack })
    })
}

async function handle(req: NowRequest) {
  const objects = await getObjects(getFirst(req.query.modifiedAfter))

  return objects.docs.map((doc) => doc.data())
}

function getObjects(modifiedAfter?: string) {
  const objects = firestore.collection('objects')
  if (modifiedAfter) {
    return objects
      .where('lastModified', '>', DateTime.fromISO(modifiedAfter).toJSDate())
      .get()
  }
  return objects.get()
}

function getFirst<T>(o: undefined | T | T[]): T | undefined {
  if (Array.isArray(o)) return o[0]
  return o
}
