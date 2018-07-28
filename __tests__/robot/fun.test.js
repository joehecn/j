
const {
  getBatchList,
  getMemberList,
  isRoomContact,
  isSpUser,
  isShieldUser
} = require('@/robot/fun.js')

const testLoop = (arr, method) => {
  for (let i = 0, len = arr.length; i < len; i++) {
    const res = method(arr[i].in)
    if (arr[i].out) {
      expect(res).toBeTruthy()
    } else {
      expect(res).toBeFalsy()
    }
  }
}

describe('robot/fun.js', () => {
  test('isShieldUser', () => {
    const arr = [
      { in: '@lbsroom', out: true },
      { in: '@talkroom', out: true },
      { in: 'newsapp', out: true },
      { in: 'ddd' }
    ]
    const len = arr.length
    expect.assertions(len)

    testLoop(arr, isShieldUser)
  })

  test('isSpUser', () => {
    const arr = [
      { in: '@qqim', out: true },
      { in: 'ddd' }
    ]
    const len = arr.length
    expect.assertions(len)

    testLoop(arr, isSpUser)
  })

  describe('isRoomContact', () => {
    test('@chatroom', () => {
      expect.assertions(1)
      const res = isRoomContact('@chatroom')
      expect(res).toBeTruthy()
    })
  })

  describe('getMemberList', () => {
    test('hemiao', () => {
      expect.assertions(1)
      const res = getMemberList([{
        UserName: 'hemiao'
      }])
      expect(res.length).toBe(1)
    })
  })

  describe('getBatchList', () => {
    test('hemiao,@@hehe', () => {
      expect.assertions(1)
      const res = getBatchList('hemiao,@@hehe')
      expect(res.length).toBe(1)
    })
  })
})
