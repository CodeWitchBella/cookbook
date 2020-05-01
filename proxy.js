const httpProxy = require('http-proxy')
const devcert = require('devcert')

const port = 8000
const target = 'https://kucharka.skorepova.info'

;(async () => {
  const ssl = await devcert.certificateFor('localhost')

  httpProxy
    .createProxyServer({
      ssl,
      target,
      changeOrigin: true,
      secure: true,
    })
    .on('proxyReq', (proxyReq, req, res, options) => {
      const origin = req.headers['origin']
      proxyReq.setHeader('Origin', target)
      if (origin && origin.startsWith('https://localhost')) {
        res.setHeader('Access-Control-Allow-Origin', origin)
        res.setHeader('Vary', 'Origin')
        const headers = req.headers['access-control-request-headers']
        if (headers) res.setHeader('Access-Control-Allow-Headers', headers)
        res.setHeader('Access-Control-Allow-Methods', '*')
        res.setHeader('Access-Control-Max-Age', '86400')
        res.setHeader('Access-Control-Allow-Credentials', 'true')
        if (req.method === 'OPTIONS') {
          res.statusCode = 200
          res.end()
        }
      }
    })
    .listen(port)
})()
