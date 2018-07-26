
const something = require('@/robot/something.js')

const webwxgetcontactResArr = [
  { Seq: 100, MemberList: ['1'] },
  { Seq: 0, MemberList: ['2'] }
]

something.ctx = {
  User: {
    UserName: 'hemiao'
  },
  BaseRequest: {}
}

something.webwxapi = {
  webwxgetcontact () {
    if (webwxgetcontactResArr.length === 0) {
      throw new Error()
    }
    return webwxgetcontactResArr.shift()
  }
}

const notifyList = [
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

test('getcontact', async () => {
  expect.assertions(notifyList.length)
  something.notify = function(key, value) {
    expect({ key, value }).toEqual(notifyList.shift())
  }

  something.add('getcontact', 0)
  await something.do()
  await something.do()
  something.add('getcontact', 0)
  await something.do()
})
