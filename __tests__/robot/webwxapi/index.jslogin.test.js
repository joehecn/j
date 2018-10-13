
jest.mock('superagent')
const superagent = require('superagent')
const webwxapi = require('../../../src/main/robot/webwxapi')
const mockAgent = require('../../../helper/mockAgent.js')

test('jslogin', async () => {
  expect.assertions(1)

  superagent.agent = mockAgent({
    text: 'window.QRLogin.code = 200; window.QRLogin.uuid = "Qd8I3H7i_w==";'
  })
  
  const res = await webwxapi.jslogin()
  expect(res).toBe('Qd8I3H7i_w==')
})
