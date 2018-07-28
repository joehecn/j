
const {
  getBatchList,
  getMemberList,
  isRoomContact,
  isSpUser,
  isShieldUser
} = require('@/robot/fun.js')

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

    for (let i = 0; i < len; i++) {
      const res = isShieldUser(arr[i].in)
      if (arr[i].out) {
        expect(res).toBeTruthy()
      } else {
        expect(res).toBeFalsy()
      }
    }
  })

  test('isSpUser', () => {
    const arr = [
      { in: '@qqim', out: true },
      { in: 'ddd' }
    ]
    const len = arr.length
    expect.assertions(len)

    for (let i = 0; i < len; i++) {
      const res = isSpUser(arr[i].in)
      if (arr[i].out) {
        expect(res).toBeTruthy()
      } else {
        expect(res).toBeFalsy()
      }
    }
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
