

const https = require('https')
const { PassThrough } = require('stream')

module.exports = (option, headers, payload, buf, endData) => {
  return new Promise((resolve, reject) => {
    const req = https.request(option, res => {
      res.on('data', body => {
        resolve(body.toString())
      })
    })

    req.on('error', err => {
      reject(err)
    })

    headers.forEach(({ name, value }) => {
      req.setHeader(name, value)
    })

    // 写入数据到请求主体
    req.write(payload)

    const buffer = Buffer.from(buf)
    const pass = new PassThrough()
    pass.on('finish', () => {
      req.end(endData)
    })
    pass.end(buffer)
    pass.pipe(req)
  })
}
