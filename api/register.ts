import * as bcrypt from 'bcryptjs'
import { promiseRequest, checkCSRF } from './_promise-request'
import { firestore } from './_firestore'

export default promiseRequest(async (req, res) => {
  checkCSRF(req)

  const { email, password } = req.body
  if (!email || !password) {
    res.status(400)
    return 'Missing body field'
  }

  res.status(418)
  return "I'm a teapot"

  await firestore
    .collection('user')
    .add({ email, passwordHash: await hashPassword(password) })

  return 'done'
})

export const hashPassword = (password: string): Promise<string> => {
  return new Promise((res, rej) =>
    bcrypt.genSalt(10, (err, salt) => {
      if (err) rej(err)
      else {
        bcrypt.hash(password, salt, (err2, hash) => {
          if (err2) rej(err2)
          else res(hash)
        })
      }
    }),
  )
}
