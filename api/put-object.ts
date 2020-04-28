import { promiseRequest, checkCSRF, loggedInUserId } from './_promise-request'
import { firestore } from './_firestore'

export default promiseRequest(async (req, res) => {
  checkCSRF(req)
  const { id, type, data } = req.body
  if (!type || !data) {
    res.status(400)
    return 'Missing body field'
  }
  const userId = await loggedInUserId(req)
  if (!userId) {
    res.status(403)
    return 'Not logged in'
  }

  if (id) {
    await firestore
      .collection('object')
      .doc(id)
      .set({ ...data, type }, { merge: true })
    return id
  } else {
    const doc = await firestore.collection('object').add({ ...data, type })
    return doc.id
  }
})
