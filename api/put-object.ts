import { promiseRequest, checkCSRF } from './_promise-request'

export default promiseRequest(async (req, res) => {
  checkCSRF(req)
  const { id, type, data } = req.body
  if (!id || !type || !data) {
    res.status(400)
    return 'Missing body field'
  }
  return 'todo'
})
