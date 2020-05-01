import { NowRequest, NowResponse } from '@now/node'
import { firestore } from './_firestore'
import { DateTime } from 'luxon'
import { promiseRequest, getFirst } from './_promise-request'

export default promiseRequest(async (req: NowRequest) => {
  const objects = await getObjects(getFirst(req.query.modifiedAfter))
  return objects.docs.map((doc) => doc.data())
})

function getObjects(modifiedAfter?: string) {
  const objects = firestore.collection('objects')
  if (modifiedAfter) {
    return objects
      .where('lastModified', '>', DateTime.fromISO(modifiedAfter).toJSDate())
      .get()
  }
  return objects.get()
}
