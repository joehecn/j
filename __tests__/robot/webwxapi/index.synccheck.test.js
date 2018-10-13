
jest.mock('superagent')
const superagent = require('superagent')
const webwxapi = require('../../../src/main/robot/webwxapi')
const mockAgent = require('../../../helper/mockAgent.js')

const testErr = async (text, status, message) => {
  expect.assertions(2)
    
  superagent.agent = mockAgent({ text })
  await webwxapi.jslogin()

  webwxapi.synccheck({}, []).catch(error => {
    expect(error.status).toBe(status)
    expect(error.message).toBe(message)
  })
}

describe('synccheck', () => {
  test('success', async () => {
    expect.assertions(1)
    
    superagent.agent = mockAgent({
      text: `window.synccheck={retcode:"0",selector:"0"}`
    })
    await webwxapi.jslogin()

    const res = await webwxapi.synccheck({}, [])

    expect(res).toBe('0')
  })

  test('803', async () => {
    const text = 'window.synccheck={retcode:"1100",selector:"0"}'
    await testErr(text, 803, '登出微信')
  })

  test('804', async () => {
    const text = 'window.synccheck={retcode:"1101",selector:"0"}'
    await testErr(text, 804, '其他设备登录web微信')
  })

  test('805', async () => {
    const text = 'window.synccheck={retcode:"1102",selector:"0"}'
    await testErr(text, 805, '暂时不知道')
  })

  test('806', async () => {
    const text = 'window.synccheck={retcode:"11",selector:"0"}'
    await testErr(text, 806, '监听心跳失败')
  })
})
