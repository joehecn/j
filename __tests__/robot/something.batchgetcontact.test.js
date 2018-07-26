
const something = require('@/robot/something.js')

something.ctx = {
  User: {
    UserName: 'hemiao'
  }
}

something.webwxapi = {
  webwxbatchgetcontact () {
    return ['3']
  }
}

const notifyList = [
  { key: 'batchlist', value: [ '3' ] }
]

test('batchgetcontact', async () => {
  expect.assertions(notifyList.length)
  something.notify = function(key, value) {
    expect({ key, value }).toEqual(notifyList.shift())
  }

  something.add('batchgetcontact', [])
  await something.do()
})
