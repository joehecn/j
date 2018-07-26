
jest.mock('superagent')
const superagent = require('superagent')
const webwxapi = require('@/robot/webwxapi')
const mockAgent = require('../../../helper/mockAgent.js')

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
    expect.assertions(2)
    
    superagent.agent = mockAgent({
      text: `window.synccheck={retcode:"1100",selector:"0"}`
    })
    await webwxapi.jslogin()

    webwxapi.synccheck({}, []).catch(error => {
      expect(error.status).toBe(803)
      expect(error.message).toBe('登出微信')
    })
  })

  test('804', async () => {
    expect.assertions(2)
    
    superagent.agent = mockAgent({
      text: `window.synccheck={retcode:"1101",selector:"0"}`
    })
    await webwxapi.jslogin()

    webwxapi.synccheck({}, []).catch(error => {
      expect(error.status).toBe(804)
      expect(error.message).toBe('其他设备登录web微信')
    })
  })

  test('805', async () => {
    expect.assertions(2)
    
    superagent.agent = mockAgent({
      text: `window.synccheck={retcode:"1102",selector:"0"}`
    })
    await webwxapi.jslogin()

    webwxapi.synccheck({}, []).catch(error => {
      expect(error.status).toBe(805)
      expect(error.message).toBe('暂时不知道')
    })
  })

  test('806', async () => {
    expect.assertions(2)
    
    superagent.agent = mockAgent({
      text: `window.synccheck={retcode:"11",selector:"0"}`
    })
    await webwxapi.jslogin()

    webwxapi.synccheck({}, []).catch(error => {
      expect(error.status).toBe(806)
      expect(error.message).toBe('监听心跳失败')
    })
  })
})
