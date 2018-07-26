
jest.mock('superagent')
const superagent = require('superagent')
const webwxapi = require('@/robot/webwxapi')
const mockAgent = require('../../../helper/mockAgent.js')

describe('webwxsync', () => {
  test('success', async () => {
    expect.assertions(1)

    superagent.agent = mockAgent({
      text: `{
        "BaseResponse": {
          "Ret": 0,
          "ErrMsg": ""
        },
        "SyncKey": "SyncKey"
      }`,
      hasSend: true
    })

    await webwxapi.jslogin()

    const res = await webwxapi.webwxsync({})
    expect(res.SyncKey).toBe('SyncKey')
  })

  test('807', async () => {
    expect.assertions(2)

    superagent.agent = mockAgent({
      text: `{
        "BaseResponse": {
          "Ret": 1,
          "ErrMsg": ""
        },
        "SyncKey": "SyncKey"
      }`,
      hasSend: true
    })

    await webwxapi.jslogin()

    webwxapi.webwxsync({}).catch(error => {
      expect(error.status).toBe(807)
      expect(error.message).toBe('更新 SyncKey 失败')
    })
  })
})
