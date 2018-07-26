
jest.mock('superagent')
const superagent = require('superagent')
const webwxapi = require('@/robot/webwxapi')
const mockAgent = require('../../../helper/mockAgent.js')

describe('webwxbatchgetcontact', () => {
  test('success', async () => {
    expect.assertions(1)

    superagent.agent = mockAgent({
      text: `{
        "BaseResponse": {
          "Ret": 0,
          "ErrMsg": ""
        },
        "ContactList": []
      }`,
      hasSend: true
    })

    await webwxapi.jslogin()

    const res = await webwxapi.webwxbatchgetcontact('', {}, [])
    expect(res.length).toBe(0)
  })

  test('808', async () => {
    expect.assertions(2)

    superagent.agent = mockAgent({
      text: `{
        "BaseResponse": {
          "Ret": 1,
          "ErrMsg": ""
        },
        "ContactList": []
      }`,
      hasSend: true
    })

    await webwxapi.jslogin()

    webwxapi.webwxbatchgetcontact('', {}, []).catch(error => {
      expect(error.status).toBe(808)
      expect(error.message).toBe('获取聊天群列表失败')
    })
  })
})
