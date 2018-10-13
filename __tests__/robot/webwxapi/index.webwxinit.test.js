
jest.mock('superagent')
const superagent = require('superagent')
const webwxapi = require('../../../src/main/robot/webwxapi')
const mockAgent = require('../../../helper/mockAgent.js')

describe('webwxinit', () => {
  test('success', async () => {
    expect.assertions(1)

    const obj = {SyncKey:1,User:{Uin:1}}
    
    superagent.agent = mockAgent({
      text: JSON.stringify(obj),
      hasSend: true
    })
    await webwxapi.jslogin()

    const res = await webwxapi.webwxinit('', {})
    expect(res).toEqual(obj)
  })

  test('800', async () => {
    expect.assertions(2)

    superagent.agent = mockAgent({
      text: JSON.stringify({}),
      hasSend: true
    })
    await webwxapi.jslogin()

    webwxapi.webwxinit('', {}).catch(error => {
      expect(error.status).toBe(800)
      expect(error.message).toBe('获取 User 失败')
    })
  })
})
