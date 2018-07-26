
jest.mock('superagent')
const superagent = require('superagent')
const webwxapi = require('@/robot/webwxapi')
const mockAgent = require('../../../helper/mockAgent.js')

describe('webwxstatusnotify', () => {
  test('success', async () => {
    expect.assertions(1)

    superagent.agent = mockAgent({
      text: `{
        "BaseResponse": {
          "Ret": 0,
          "ErrMsg": ""
        },
        "MsgID": "8356507241667348659"
      }`,
      hasSend: true
    })

    await webwxapi.jslogin()
  
    const res = await webwxapi.webwxstatusnotify('', {})
    expect(res.success).toBe(true)
  })

  test('801', async () => {
    expect.assertions(2)

    superagent.agent = mockAgent({
      text: JSON.stringify({}),
      hasSend: true
    })

    await webwxapi.jslogin()

    const res = await webwxapi.webwxstatusnotify('', {})
    expect(res.success).toBe(false)
    expect(res.err).toEqual({
      status: 801,
      message: '开启微信状态通知失败'
    })
  })

  test('999', async () => {
    expect.assertions(2)

    superagent.agent = mockAgent({
      text: JSON.stringify({}),
      hasSend: true,
      throwErr: true
    })

    await webwxapi.jslogin()

    const res = await webwxapi.webwxstatusnotify('', {})
    expect(res.success).toBe(false)
    expect(res.err).toEqual({
      status: 999,
      message: '未处理错误'
    })
  })
})
