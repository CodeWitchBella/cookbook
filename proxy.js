const http = require('http')
const httpProxy = require('http-proxy')
const devcert = require('devcert')

const port = 8000
const targetHost = 'kucharka.skorepova.info'

;(async () => {
  const ssl = await devcert.certificateFor('localhost')

  httpProxy
    .createProxyServer({
      ssl,
      target: {
        protocol: 'https:',
        host: targetHost,
        port: 443,
      },
      changeOrigin: true,
      secure: true,
    })
    .listen(port)
})()
