import { promiseRequest, checkCSRF, loggedInUserId } from './_promise-request'
import { firestore } from './_firestore'

export default promiseRequest(async (req, res) => {
  checkCSRF(req, 'GET')
  const userId = await loggedInUserId(req)
  if (!userId) {
    return { error: 'Not logged in' }
  }
  const user = await firestore.collection('user').doc(userId).get()
  if (!user.exists) return { error: 'Not logged in' }
  return { ...user.data(), passwordHash: undefined }
})
