
const something = require('@/robot/something.js')

something.ctx = {
  User: {
    UserName: 'hemiao'
  }
}

const webwxuploadmediaResArr = [
  { MediaId: 1, BaseResponse: { Ret: 1 } },
  { MediaId: 2, BaseResponse: { Ret: 0 } },
  { MediaId: 3, BaseResponse: { Ret: 0 } },
  { MediaId: 3, BaseResponse: { Ret: 0 } }
]

const webwxsendmsgimgResArr = [
  { BaseResponse: { Ret: 0 } },
  { BaseResponse: { Ret: 1 } }
]

something.webwxapi = {
  webwxbatchgetcontact () {
    return ['3']
  },

  webwxuploadmedia () {
    return webwxuploadmediaResArr.shift()
  },

  webwxsendmsgimg () {
    if (webwxsendmsgimgResArr.length === 0) {
      throw new Error()
    }

    return webwxsendmsgimgResArr.shift()
  }
}

const imgmsgItem = {
  key: '2',
  Type: 3,
  toList: [{
    premd5: '4',
    ToUserName: 'afds',
    failCount: 0
  }, {
    premd5: '5',
    ToUserName: 'baob45',
    failCount: 0
  }, {
    premd5: '6',
    ToUserName: 'baob46',
    failCount: 0
  }, {
    premd5: '7',
    ToUserName: 'baob47',
    failCount: 0
  }]
}

const notifyList = [
  { key: 'batchlist', value: [ '3' ] },
  { key: 'startSendmsg', value: { premd5: '4', Type: 3 } },
  { key: 'sendmsgBack', value: {
    ToUserName: 'afds', failCount: 1, status: 701, leftMsgCount: 3
  }},
  { key: 'startSendmsg', value: { premd5: '5', Type: 3 } },
  { key: 'sendmsgBack', value: {
    ToUserName: 'baob45', failCount: 0, leftMsgCount: 2
  }},
  { key: 'startSendmsg', value: { premd5: '6', Type: 3 } },
  { key: 'sendmsgBack', value: {
    ToUserName: 'baob46', failCount: 1, status: 702, leftMsgCount: 1
  }},
  { key: 'startSendmsg', value: { premd5: '7', Type: 3 } },
  { key: 'sendmsgBack', value: {
    ToUserName: 'baob47', failCount: 1, status: 999, leftMsgCount: 0
  }},
]

test('img', async () => {
  // expect.assertions(notifyList.length)
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
  something.storeToMsgList(imgmsgItem)
  await something.do()
  await something.do()
  await something.do()
  await something.do()
  await something.do()
})
