
jest.mock('../../../../src/main/robot/webwxapi/upload/request.js')

const upload = require('../../../../src/main/robot/webwxapi/upload/upload.js')

const fields = require('../../../../helper/mockFields.js')

const url =
  'https://file.wx2.qq.com/cgi-bin/mmwebwx-bin/webwxuploadmedia?f=json'

const buf = new ArrayBuffer(8)

test('upload', async () => {
  expect.assertions(1)

  const res = await upload(url, fields, buf)
  expect(res).toBeTruthy()
})
