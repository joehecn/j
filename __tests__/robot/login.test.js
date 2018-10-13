
const login = require('../../src/main/robot/login.js')

const codes = [
  { code: '408' },
  { code: '201' },
  { code: '200' }
]

const notifyList = [
  { key: 'getUUID' },
  { key: 'getCode408' },
  { key: 'getCode201' },
  { key: 'getLoginStatusSuccessed' }
]

login.ctx = {}

login.webwxapi = {
  jslogin () {
    return 'hehe'
  },
  login () {
    return codes.shift()
  }
}

describe('robot/login.js', () => {
  test('start', async () => {
    expect.assertions(4)

    login.notify = function (key) {
      expect(key).toBe(notifyList.shift().key)
    }

    await login.start()
  })
})
