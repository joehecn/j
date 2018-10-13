
jest.mock('../../../src/main/robot/webwxapi/upload/upload.js')

const webwxapi = require('../../../src/main/robot/webwxapi')


test('webwxuploadmedia', async () => {
  expect.assertions(1)

  const buf = new ArrayBuffer(8)
  const res = await webwxapi.webwxuploadmedia({
    BaseRequest: {},
    webwxDataTicket: '',
    file: {
      lastModifiedDate: new Date()
    },
    buf,
    Msg: {}
  })

  expect(res.success).toBeTruthy()
})
