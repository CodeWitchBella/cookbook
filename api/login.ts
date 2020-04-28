import { promiseRequest, checkCSRF } from './_promise-request'
import { NowResponse } from '@now/node'
import { Duration, DateTime } from 'luxon'
import { firestore } from './_firestore'
import * as bcrypt from 'bcryptjs'

export default promiseRequest(async (req, res) => {
  checkCSRF(req)

  const { email, password } = req.body
  if (!email || !password) {
    res.status(400)
    return 'Missing body field'
  }
  const user = (
    await firestore
      .collection('user')
      .where('email', '==', email)
      .limit(1)
      .get()
  ).docs[0]

  if (!user) {
    res.status(401)
    return 'User not found'
  }

  if (!(await comparePassword(password, user.get('passwordHash')))) {
    res.status(401)
    return 'Wrong password'
  }

  const duration = Duration.fromObject({ year: 1 })
  const session = await firestore.collection('session').add({
    user: user.id,
    expires: DateTime.utc().plus(duration).toISO(),
  })
  setSessionCookie(res, session.id, duration)

  return 'Success'
})

function setSessionCookie(res: NowResponse, value: string, duration: Duration) {
  res.setHeader(
    'Set-Cookie',
    `session=${value}; Max-Age=${duration.as(
      'seconds',
    )}; HttpOnly; Secure; SameSite=Strict; Path=/`,
  )
}

function comparePassword(password: string, hash: string) {
  return new Promise<boolean>((resolve, reject) => {
    bcrypt.compare(password, hash, (err, res) => {
      if (err) reject(err)
      else resolve(res)
    })
  })
}
