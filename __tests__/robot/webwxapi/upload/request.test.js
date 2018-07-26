
jest.mock('https')
jest.mock('stream')

const request = require('@/robot/webwxapi/upload/request.js')

const option = {
  hostname: 'file.wx2.qq.com',
  port: 443,
  path: '/cgi-bin/mmwebwx-bin/webwxuploadmedia?f=json',
  method: 'POST'
}

const contentType =
  'multipart/form-data; boundary=----WebKitFormBoundarycpRyN1SIuBsnjbfM'
const headers = [
  { name: 'Content-Type', value: contentType },
  { name: 'Content-Length', value: 232234 }
]
const payload = 'payload'
const buf = new ArrayBuffer(8)

describe('robot/webwxapi/upload/request.js', () => {
  test('resolve', async () => {
    expect.assertions(1)

    const endData = '\r\n------WebKitFormBoundarycpRyN1SIuBsnjbfM--\r\n'
    const res = await request(option, headers, payload, buf, endData)
    
    expect(res).toBe('success')
  })

  test('reject', () => {
    expect.assertions(1)
    
    const endData = '\r\n------FebKitFormBoundarycpRyN1SIuBsnjbfM--\r\n'

    request(option, headers, payload, buf, endData).catch(err => {
      expect(err.message).toBe('fail')
    })
  })
})
