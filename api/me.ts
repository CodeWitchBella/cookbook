import { promiseRequest, checkCSRF, loggedInUserId } from './_promise-request'
import { firestore } from './_firestore'

export default promiseRequest(async (req, res) => {
  checkCSRF(req, 'GET')
  const userId = await loggedInUserId(req)
  if (!userId) {
    return { error: 'Not logged in', code: 'NOT_LOGGED_IN' }
  }
  const user = await firestore.collection('user').doc(userId).get()
  if (!user.exists) return { error: 'Not logged in' }
  return { id: user.id, ...user.data(), passwordHash: undefined }
})
