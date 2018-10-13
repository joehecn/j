
jest.mock('../../src/main/robot/login.js')
jest.mock('../../src/main/robot/daemon.js')
jest.mock('../../src/main/robot/something.js')
const Robot = require('../../src/main/robot/index.js')

describe('robot', () => {
  test('Robot', () => {
    expect.assertions(2)

    expect(Object.getOwnPropertyNames(Robot.prototype)).toEqual(
      [ 'constructor', 'start', 'sendmsg' ]
    )

    const robot = new Robot()
    expect(Object.getOwnPropertyNames(robot)).toEqual(
      [ 'domain', '_events', '_eventsCount', '_maxListeners' ]
    )
  })

  test('start', async () => {
    expect.assertions(1)

    const robot = new Robot()
    robot.on('robot-reply', message => {
      expect(message).toEqual({
        key: 'onerror',
        value: { status: 999, message: '未处理错误' }
      })
    })
    await robot.start()
  })

  test('sendmsg', () => {
    expect.assertions(1)
    
    const robot = new Robot()
    robot.on('robot-reply', message => {
      expect(message).toEqual({ key: 'msgListLength', value: 1 })
    })
    robot.sendmsg({msg: 'test'})
  })
})
