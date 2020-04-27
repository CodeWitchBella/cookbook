import { promiseRequest } from './_promise-request'

const { VERCEL_URL } = process.env
export default promiseRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405)
    return 'Method not allowed'
  }
  if (req.headers.origin !== VERCEL_URL) {
    res.status(403)
    return 'Forbidden'
  }
  return 'todo'
})
