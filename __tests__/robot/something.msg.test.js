
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

let webwxsendmsgResArr = []

const webwxsendmsg = () => {
  if (webwxsendmsgResArr.length === 0) {
    throw new Error()
  }

  return webwxsendmsgResArr.shift()
}

something.webwxapi = {
  webwxbatchgetcontact () {
    return ['3']
  },

  webwxuploadmedia () {
    return webwxuploadmediaResArr.shift()
  },

  webwxsendmsg,
  webwxsendmsgimg: webwxsendmsg
}

const createNotifyFunc = notifyList => {
  return (key, value) => {
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
}

const testMsg = async (msgItem, notifyList) => {
  expect.assertions(notifyList.length)

  something.notify = createNotifyFunc(notifyList)

  something.add('batchgetcontact', [])
  something.storeToMsgList(msgItem)

  for (let i = 0, len = msgItem.toList.length; i <= len; i++) {
    await something.do()
  }
}

beforeEach(() => {
  webwxsendmsgResArr = [
    { BaseResponse: { Ret: 0 } },
    { BaseResponse: { Ret: 1 } }
  ]
})

test('text', async () => {
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
  
  await testMsg(msgItem, notifyList)
})

test('img', async () => {
  const msgItem = {
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

  await testMsg(msgItem, notifyList)
})
