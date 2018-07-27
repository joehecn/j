
const something = require('@/robot/something.js')

something.ctx = {
  User: {
    UserName: 'hemiao'
  }
}

const webwxsendmsgResArr = [
  { BaseResponse: { Ret: 0 } },
  { BaseResponse: { Ret: 1 } }
]

something.webwxapi = {
  webwxbatchgetcontact () {
    return ['3']
  },

  webwxsendmsg () {
    if (webwxsendmsgResArr.length === 0) {
      throw new Error()
    }

    return webwxsendmsgResArr.shift()
  }
}

const msgItem = {
  key: '1',
  Type: 1,
  Content: 'hello',
  toList: [{
    premd5: '1',
    ToUserName: 'fdsa',
    failCount: 0
  }, {
    premd5: '2',
    ToUserName: 'haba',
    failCount: 0
  }, {
    premd5: '3',
    ToUserName: 'baob',
    failCount: 0
  }]
}

const notifyList = [
  { key: 'batchlist', value: [ '3' ] },
  { key: 'startSendmsg', value: { premd5: '1', Type: 1 } },
  { key: 'sendmsgBack', value: {
    ToUserName: 'fdsa', failCount: 0, leftMsgCount: 2
  }},
  { key: 'startSendmsg', value: { premd5: '2', Type: 1 } },
  { key: 'sendmsgBack', value: {
    ToUserName: 'haba', failCount: 1, status: 700, leftMsgCount: 1
  }},
  { key: 'startSendmsg', value: { premd5: '3', Type: 1 } },
  { key: 'sendmsgBack', value: {
    ToUserName: 'baob', failCount: 1, status: 999, leftMsgCount: 0
  }}
]

test('text', async () => {
  expect.assertions(notifyList.length)

  something.notify = function(key, value) {
    const item = notifyList.shift()
    if (item.key === 'sendmsgBack') {
      const ToUserName = value.Msg.ToUserName
      const failCount = value.failCount
      const status = value.err ? value.err.status : undefined
      const leftMsgCount = value.leftMsgCount

      expect({
        key,
        value: {
          ToUserName, failCount, status, leftMsgCount
        }}).toEqual(item)
    } else {
      expect({ key, value }).toEqual(item)
    }
  }

  something.add('batchgetcontact', [])
  something.storeToMsgList(msgItem)
  
  for (let i = 0, len = msgItem.toList.length; i <= len; i++) {
    await something.do()
  }
})
