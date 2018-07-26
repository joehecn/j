
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

const setSendMsgResArr = (msgType, sending) => {
  return [
    { key: 'startSendmsg',
      value: { sending: 2, toNickName: 'hoe', msgType } },
    { key: 'sendmsgBack',
      value: { leftMsgCount: 2, sending, toNickName: 'hoe', msgType } }
  ]
}

describe('worker/back.worker.js', () => {
  test('getUUID', () => {
    expect.assertions(1)

    const worker = newWorker(function () {
      this.notify('getUUID', 'uuid')
    })

    worker.onmessage = event => {
      expect(event.data).toEqual({ key: 'getUUID', value: 'uuid' })
    }

    worker.postMessage({ key: 'start' })
  })

  test('getCode201', () => {
    expect.assertions(1)

    const worker = newWorker(function () {
      this.notify('getCode201', 'userAvatar')
    })

    worker.onmessage = event => {
      expect(event.data).toEqual({ key: 'getCode201', value: 'userAvatar' })
    }

    worker.postMessage({ key: 'start' })
  })

  test('getCode408', () => {
    expect.assertions(1)

    const worker = newWorker(function () {
      this.notify('getCode408')
    })

    worker.onmessage = event => {
      expect(event.data).toEqual({ key: 'getCode408', value: undefined })
    }

    worker.postMessage({ key: 'start' })
  })

  test('getLoginStatusSuccessed', () => {
    expect.assertions(1)

    const worker = newWorker(function () {
      this.notify('getLoginStatusSuccessed')
    })

    worker.onmessage = event => {
      expect(event.data).toEqual({
        key: 'getLoginStatusSuccessed',
        value: undefined
      })
    }

    worker.postMessage({ key: 'start' })
  })

  test('getUser', () => {
    expect.assertions(1)

    const worker = newWorker(function () {
      this.notify('getUser', { Uin: '123', NickName: 'hehe' })
    })

    worker.onmessage = event => {
      expect(event.data).toEqual({ key: 'getUser', value: 'hehe' })
    }

    worker.postMessage({ key: 'start' })
  })

  test('getMemberlist', () => {
    expect.assertions(1)

    const worker = newWorker(function () {
      this.notify('getMemberlist', 1)
    })

    worker.onmessage = event => {
      expect(event.data).toEqual({ key: 'getMemberlist', value: 1 })
    }

    worker.postMessage({ key: 'start' })
  })

  test('getMemberlistEnded', () => {
    expect.assertions(1)

    const worker = newWorker(function () {
      this.notify('getMemberlistEnded', [])
    })

    worker.onmessage = event => {
      expect(event.data).toEqual({ key: 'getMemberlistEnded', value: [] })
    }

    worker.postMessage({ key: 'start' })
  })

  test('batchlist', () => {
    expect.assertions(1)

    const worker = newWorker(function () {
      this.notify('batchlist', 1)
    })

    worker.onmessage = event => {
      expect(event.data).toEqual({ key: 'batchlist', value: 1 })
    }

    worker.postMessage({ key: 'start' })
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

  test('sendmsg: Type 1', async () => {
    const resArr = setSendMsgResArr(1, 1)
    // [
    //   { key: 'startSendmsg',
    //     value: { sending: 2, toNickName: 'hoe', msgType: 1 } },
    //   { key: 'sendmsgBack',
    //     value: { leftMsgCount: 2, sending: 1, toNickName: 'hoe', msgType: 1 } }
    // ]

    expect.assertions(resArr.length)

    const worker = newWorker(function () {}, function () {
      this.notify('startSendmsg', { premd5: '123', Type: 1 })
      this.notify('sendmsgBack', {
        leftMsgCount: 2,
        sending: 1,
        failCount: 0,
        Msg: { Type: 1 }
      })
    })

    worker.onmessage = event => {
      expect(event.data).toEqual(resArr.shift())
    }

    worker.postMessage({ key: 'start' })
    worker.postMessage({
      key: 'sendmsg',
      value: {
        Type: 1,
        Content: 'hello',
        tos: ['joe1']
      }
    })

    await new Promise(resolve => setTimeout(resolve, 1))
  })

  test('sendmsg: Type 3', async () => {
    const resArr = setSendMsgResArr(3, 3)
    // const resArr = [
    //   { key: 'startSendmsg',
    //     value: { sending: 2, toNickName: 'hoe', msgType: 3 } },
    //   { key: 'sendmsgBack',
    //     value: { leftMsgCount: 2, sending: 3, toNickName: 'hoe', msgType: 1 } }
    // ]

    expect.assertions(resArr.length)

    const worker = newWorker(function () {}, function () {
      this.notify('startSendmsg',
        { premd5: '123', Type: 3 })
      this.notify('sendmsgBack', {
        leftMsgCount: 2,
        sending: 1,
        failCount: 1,
        Msg: { Type: 3 }
      })
    })

    worker.onmessage = event => {
      expect(event.data).toEqual(resArr.shift())
    }

    worker.postMessage({ key: 'start' })
    worker.postMessage({
      key: 'sendmsg',
      value: {
        Type: 3,
        file: 'ddd',
        tos: ['joe1']
      }
    })

    await new Promise(resolve => setTimeout(resolve, 1))
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
