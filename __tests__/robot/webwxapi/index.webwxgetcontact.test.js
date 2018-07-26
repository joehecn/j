
jest.mock('superagent')
const superagent = require('superagent')
const webwxapi = require('@/robot/webwxapi')
const mockAgent = require('../../../helper/mockAgent.js')

describe('webwxgetcontact', () => {
  test('success', async () => {
    expect.assertions(1)
    
    superagent.agent = mockAgent({
      text: `{
        "BaseResponse": {
          "Ret": 0,
          "ErrMsg": ""
        },
        "Seq": 0
      }`
    })
    await webwxapi.jslogin()

    const res = await webwxapi.webwxgetcontact()

    expect(res.Seq).toBe(0)
  })

  test('802', async () => {
    expect.assertions(2)

    superagent.agent = mockAgent({
      text: `{
        "BaseResponse": {
          "Ret": 1,
          "ErrMsg": ""
        },
        "Seq": 0
      }`
    })

    await webwxapi.jslogin()

    webwxapi.webwxgetcontact().catch(error => {
      expect(error.status).toBe(802)
      expect(error.message).toBe('获取好友列表失败')
    })
  })
})
