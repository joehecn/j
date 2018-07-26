
jest.mock('@/robot/webwxapi/upload/upload.js')

const webwxapi = require('@/robot/webwxapi')


test('webwxuploadmedia', async () => {
  expect.assertions(1)

  const buf = new ArrayBuffer(8)
  const res = await webwxapi.webwxuploadmedia({}, '', {
    lastModifiedDate: new Date()
  }, buf, {})

  expect(res.success).toBeTruthy()
})
