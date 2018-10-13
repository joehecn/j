
jest.setTimeout(8000)

const daemon = require('../../src/main/robot/daemon.js')

daemon.ctx = {
  loginCode: {}
}

let webwxstatusnotifyRes
let synccheckResArr

daemon.webwxapi = {
  webwxnewloginpage () {
    return { BaseRequest: {}, passTicket: '', webwxDataTicket: '' }
  },

  webwxinit () {
    return { SyncKey: {}, User: {
      Uin: '123', NickName: 'joe', UserName: 'hemiao'
    }}
  },

  webwxstatusnotify () {
    return webwxstatusnotifyRes
  },

  synccheck () {
    if (synccheckResArr.length === 0) {
      throw new Error()
    }
    return synccheckResArr.shift()
  },

  webwxsync () {
    return { SyncKey: {}, SyncCheckKey: {
      List: ['1']
    }, AddMsgList: [{
      StatusNotifyCode: 4,
      StatusNotifyUserName: '@@hehe34,@@hehe45'
    }]}
  }
}

daemon.something = {
  add () {},
  do () {}
}

describe('robot/daemon.js', () => {
  beforeEach(() => {
    synccheckResArr = [ '0', '2' ]
  })

  test('start', async () => {
    expect.assertions(1)
    
    const notifyRes =
      { key: 'getUser', value: { Uin: '123', NickName: 'joe' } }
    webwxstatusnotifyRes = { success: true }
    daemon.notify = (key, value) => {
      expect({ key, value}).toEqual(notifyRes)
    }
    try {
      await daemon.start()
    } catch (err) {}
  })

  test('start onerror', async () => {
    expect.assertions(2)

    const notifyResArr = [
      { key: 'getUser', value: { Uin: '123', NickName: 'joe' } },
      { key: 'onerror',
        value:
        { loginCode: {},
          BaseRequest: {},
          passTicket: '',
          webwxDataTicket: '',
          SyncKey: {},
          User: { Uin: '123', NickName: 'joe', UserName: 'hemiao' },
          status: 600,
          message: 'message' } }
    ]

    webwxstatusnotifyRes = {
      success: false,
      err: {status: 600, message: 'message'}
    }

    daemon.notify = (key, value) => {
      expect({ key, value}).toEqual(notifyResArr.shift())
    }
    try {
      await daemon.start()
    } catch (err) {}
  })
})
