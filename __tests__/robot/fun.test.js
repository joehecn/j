
const {
  getBatchList,
  getMemberList,
  isRoomContact,
  isSpUser,
  isShieldUser
} = require('@/robot/fun.js')

describe('robot/fun.js', () => {
  describe('isShieldUser', () => {
    test('@lbsroom', () => {
      expect.assertions(1)
      const res = isShieldUser('@lbsroom')
      expect(res).toBeTruthy()
    })

    test('@talkroom', () => {
      expect.assertions(1)
      const res = isShieldUser('@talkroom')
      expect(res).toBeTruthy()
    })

    test('newsapp', () => {
      expect.assertions(1)
      const res = isShieldUser('newsapp')
      expect(res).toBeTruthy()
    })

    test('ddd', () => {
      expect.assertions(1)
      const res = isShieldUser('ddd')
      expect(res).toBeFalsy()
    })
  })

  describe('isSpUser', () => {
    test('@qqim', () => {
      expect.assertions(1)
      const res = isSpUser('@qqim')
      expect(res).toBeTruthy()
    })

    test('ddd', () => {
      expect.assertions(1)
      const res = isSpUser('ddd')
      expect(res).toBeFalsy()
    })
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
