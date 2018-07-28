
const something = require('@/robot/something.js')

const webwxgetcontactResArr = [
  { Seq: 100, MemberList: ['1'] },
  { Seq: 0, MemberList: ['2'] }
]

let notifyList = []

something.ctx = {
  User: {
    UserName: 'hemiao'
  },
  BaseRequest: {}
}

something.notify = function (key, value) {
  expect({ key, value }).toEqual(notifyList.shift())
}

test('getcontact', async () => {
  notifyList = [
    { key: 'getMemberlist', value: [ '1' ] },
    { key: 'getMemberlist', value: [ '2' ] },
    { key: 'getMemberlistEnded', value: undefined },
    { key: 'onerror',
        value:
         { User: { UserName: 'hemiao' },
           BaseRequest: {},
           status: 999,
           message: '未处理错误' } }
  ]
  something.webwxapi = {
    webwxgetcontact () {
      if (webwxgetcontactResArr.length === 0) {
        throw new Error()
      }
      return webwxgetcontactResArr.shift()
    }
  }

  expect.assertions(notifyList.length)

  something.add('getcontact', 0)
  await something.do()
  await something.do()
  something.add('getcontact', 0)
  await something.do()
})

test('batchgetcontact', async () => {
  notifyList = [
    { key: 'batchlist', value: [ '3' ] }
  ]
  something.webwxapi = {
    webwxbatchgetcontact () {
      return ['3']
    }
  }

  expect.assertions(notifyList.length)

  something.add('batchgetcontact', [])
  await something.do()
})
