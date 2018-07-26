
jest.mock('superagent')
const superagent = require('superagent')
const webwxapi = require('@/robot/webwxapi')
const mockAgent = require('../../../helper/mockAgent.js')

/*
Object {
  "obj": Object {
    "isgrayscale": "1",
    "message": "",
    "pass_ticket": "U2WI...",
    "ret": "0",
    "skey": "@crypt_a397bd88_d4687b76ae759c62dc3be4665356615c",
    "wxsid": "hwzOeMNYnm6np4A6",
    "wxuin": "3642174990",
  },
  "webwxDataTicket": "gSeYURhH/6K32ealuJwWWICe",
}
*/
test('webwxnewloginpage', async () => {
  expect.assertions(3)

  superagent.agent = mockAgent({
    header: {
      'set-cookie': [
        'wxuin=3642174990; Domain=wx2.qq.com; Path=/; Expires=Fri, 13-Jul-2018 07:14:28 GMT; Secure',
        'wxsid=YO8zmoUn7iutckLH; Domain=wx2.qq.com; Path=/; Expires=Fri, 13-Jul-2018 07:14:28 GMT; Secure',
        'wxloadtime=1531422868; Domain=wx2.qq.com; Path=/; Expires=Fri, 13-Jul-2018 07:14:28 GMT; Secure',
        'mm_lang=zh_CN; Domain=wx2.qq.com; Path=/; Expires=Fri, 13-Jul-2018 07:14:28 GMT; Secure',
        'webwx_data_ticket=gSeYURhH/6K32ealuJwWWICe; Domain…=/; Expires=Fri, 13-Jul-2018 07:14:28 GMT; Secure',
        'webwxuvid=f6f845b6bbbeee863d5619a980af8eca4855286a…=/; Expires=Sun, 09-Jul-2028 19:14:28 GMT; Secure',
        'webwx_auth_ticket=CIsBEKzV3dAKGoAB9NT+XAP696ELWM7R…=/; Expires=Sun, 09-Jul-2028 19:14:28 GMT; Secure'
      ]
    },
    text: `<error>
      <ret>0</ret>
      <message></message>
      <skey>@crypt_a397bd88_d4687b76ae759c62dc3be4665356615c</skey>
      <wxsid>hwzOeMNYnm6np4A6</wxsid>
      <wxuin>3642174990</wxuin>
      <pass_ticket>U2WI%2Bj54wHu9eZ54MobYcOEjaJIiFglEHoLGDzjqH%2FQXb7UIDL%2Bh0crF2ucr8bPe</pass_ticket>
      <isgrayscale>1</isgrayscale>
    </error>`
  })
  await webwxapi.jslogin()
  
  const res = await webwxapi.webwxnewloginpage()
  expect(res.BaseRequest).toEqual({
    Sid: 'hwzOeMNYnm6np4A6',
    Skey: '@crypt_a397bd88_d4687b76ae759c62dc3be4665356615c',
    Uin: '3642174990'
  })
  expect(res.passTicket).toBe('U2WI%2Bj54wHu9eZ54MobYcOEjaJIiFglEHoLGDzjqH%2FQXb7UIDL%2Bh0crF2ucr8bPe')
  expect(res.webwxDataTicket).toBe('gSeYURhH/6K32ealuJwWWICe')
})
