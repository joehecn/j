
jest.mock('@/worker/db.js')
jest.mock('@/worker/data.js')
jest.mock('@/robot/index.js')
import Robot from '@/robot/index.js'

class Worker {
  constructor (path) {
    !window.onmessage && (window.onmessage = null)
    require(path)

    window.postMessage = message => {
      this.onmessage({ data: message})
    }
  }

  postMessage (message) {
    window.onmessage({ data: message})
  }
}

const newWorker = (start, sendmsg)  => {
  Robot.prototype.start = start
  sendmsg && (Robot.prototype.sendmsg = sendmsg)
  return new Worker('@/worker/back.worker.js')
}

const setSendMsgResArr = ({ msgType, sending }) => {
  return [
    { key: 'startSendmsg',
      value: { sending: 2, toNickName: 'hoe', msgType } },
    { key: 'sendmsgBack',
      value: { leftMsgCount: 2, sending, toNickName: 'hoe', msgType } }
  ]
}

const testStart = (key, value, res) => {
  expect.assertions(1)

  const worker = newWorker(function () {
    this.notify(key, value)
  })

  worker.onmessage = event => {
    expect(event.data).toEqual(res || { key, value })
  }

  worker.postMessage({ key: 'start' })
}

describe('worker/back.worker.js', () => {
  test('getUUID', () => {
    testStart('getUUID', 'uuid')
  })

  test('getCode201', () => {
    testStart('getCode201', 'userAvatar')
  })

  test('getCode408', () => {
    testStart('getCode408')
  })

  test('getLoginStatusSuccessed', () => {
    testStart('getLoginStatusSuccessed')
  })

  test('getUser', () => {
    testStart(
      'getUser',
      { Uin: '123', NickName: 'hehe' },
      { key: 'getUser', value: 'hehe' }
    )
  })

  test('getMemberlist', () => {
    testStart('getMemberlist', 1)
  })

  test('getMemberlistEnded', () => {
    testStart('getMemberlistEnded', [])
  })

  test('batchlist', () => {
    testStart('batchlist', 1)
  })

  test('onerror throw', async () => {
    expect.assertions(1)

    const worker = newWorker(async function () {
      const ctx = {}
      try {
        await new Promise(resolve => setTimeout(resolve, 1))
        throw new Error()
      } catch (err) {
        ctx.status = err.status || err.statusCode || err.code || 999
        ctx.message = err.message || '未处理错误'
        this.notify('onerror', ctx)
      }
    })

    worker.onmessage = event => {
      expect(event.data).toEqual({
        key: 'onerror',
        value: { status: 999, message: '未处理错误' }
      })
    }

    worker.postMessage({ key: 'start' })

    await new Promise(resolve => setTimeout(resolve, 1))
  })

  test('onerror reject', async () => {
    expect.assertions(1)

    const worker = newWorker(async function () {
      const ctx = {}
      try {
        await new Promise(resolve => setTimeout(resolve, 1))
        return Promise.reject('err')
      } catch (err) {
        ctx.status = err.status || err.statusCode || err.code || 999
        ctx.message = err.message || '未处理错误'
        this.notify('onerror', ctx)
      }
    })

    worker.onmessage = event => {
      expect(event.data).toEqual({
        key: 'onerror',
        value: { status: 999, message: '未处理错误' }
      })
    }

    worker.postMessage({ key: 'start' })

    await new Promise(resolve => setTimeout(resolve, 1))
  })

  test('sendmsg', async () => {
    expect.assertions(4)

    const sendmsg = async ({ msgType, sending, failCount }) => {
      const resArr = setSendMsgResArr({ msgType, sending })

      const worker = newWorker(function () {}, function () {
        this.notify('startSendmsg', { premd5: '123', Type: msgType })
        this.notify('sendmsgBack', {
          leftMsgCount: 2,
          sending,
          failCount,
          Msg: { Type: msgType }
        })
      })

      worker.onmessage = event => {
        expect(event.data).toEqual(resArr.shift())
      }

      worker.postMessage({ key: 'start' })
      worker.postMessage({
        key: 'sendmsg',
        value: {
          Type: msgType,
          // Content: 'hello',
          tos: ['joe1']
        }
      })

      await new Promise(resolve => setTimeout(resolve, 1))
    }
    await sendmsg({ msgType: 1, sending: 1, failCount: 0 })
    await sendmsg({ msgType: 3, sending: 3, failCount: 1 })
  })

  test('getGroupList', () => {
    expect.assertions(1)

    const worker = newWorker(function () {})

    worker.onmessage = event => {
      expect(event.data).toEqual({ key: 'getGroupListBack', value: [] })
    }

    worker.postMessage({
      key: 'getGroupList'
    })
  })

  test('addGroup', () => {
    expect.assertions(1)
    
    const worker = newWorker(function () {})

    worker.onmessage = event => {
      expect(event.data).toEqual({
        key: 'addGroupBack',
        value: { md5: '123', groupName: '123' }
      })
    }

    worker.postMessage({
      key: 'addGroup',
      value: { md5: '123', groupName: '123' }
    })
  })

  test('delGroup', () => {
    const resArr = [
      { key: 'onerror', value: { status: 1000, message: '数据库错误' } },
      { key: 'delGroupBack', value: 1 }
    ]

    expect.assertions(resArr.length)
    
    const worker = newWorker(function () {})

    worker.onmessage = event => {
      // console.log(event.data)
      expect(event.data).toEqual(resArr.shift())
    }

    worker.postMessage({
      key: 'delGroup',
      value: { index: 1, md5: '123' }
    })
    worker.postMessage({
      key: 'delGroup',
      value: { index: 1, md5: '123' }
    })
  })

  test('getGroup', () => {
    expect.assertions(1)
    
    const worker = newWorker(function () {})

    worker.onmessage = event => {
      expect(event.data).toEqual({
        key: 'getGroupBack',
        value: { listM: [], listB: [] }
      })
    }

    worker.postMessage({
      key: 'getGroup',
      value: { md5: '123' }
    })
  })

  test('changeStatus', () => {
    expect.assertions(1)
    
    const worker = newWorker(function () {})

    worker.onmessage = event => {
      expect(event.data).toEqual({
        key: 'changeStatusBack',
        value: { premd5: undefined, status: undefined, category: 1 }
      })
    }

    worker.postMessage({
      key: 'changeStatus',
      value: {
        md5: '123', item: {}, category: 1
      }
    })
  })
})
