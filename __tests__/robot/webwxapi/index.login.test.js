
jest.mock('superagent')
const superagent = require('superagent')
const webwxapi = require('../../../src/main/robot/webwxapi')
const mockAgent = require('../../../helper/mockAgent.js')

test('login', async () => {
  expect.assertions(1)

  superagent.agent = mockAgent({
    text: `window.code=200;
  window.redirect_uri="https://wx2.qq.com/cgi-bin/mmwebwx-bin/webwxnewloginpage?ticket=A5jx4eP42GmsYUsWFr5A2tqN@qrticket_0&uuid=Aa0lWznQxA==&lang=zh_CN&scan=1526546884";`
  })
  await webwxapi.jslogin()
  
  const res = await webwxapi.login()

  expect(res).toEqual({
    code: '200',
    query: {
      fun: 'new',
      version: 'v2',
      ticket: 'A5jx4eP42GmsYUsWFr5A2tqN@qrticket_0',
      uuid: 'Aa0lWznQxA==',
      lang: 'zh_CN',
      scan: '1526546884'
    }
  })
})
