
jest.mock('@/worker/db.js')
jest.mock('@/worker/data.js')

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

const newWorker = ()  => {
  return new Worker('@/worker/back.worker.js')
}

// const setSendMsgResArr = ({ msgType, sending }) => {
//   return [
//     { key: 'startSendmsg',
//       value: { sending: 2, toNickName: 'hoe', msgType } },
//     { key: 'sendmsgBack',
//       value: { leftMsgCount: 2, sending, toNickName: 'hoe', msgType } }
//   ]
// }

const testStart = (key, value, res) => {
  expect.assertions(1)

  const worker = newWorker(function () {
    console.log(this)
    this.notify(key, value)
  })

  worker.onmessage = event => {
    expect(event.data).toEqual(res || { key, value })
  }

  worker.postMessage({ key: 'start' })
}

describe('worker/back.worker.js', () => {
  test.skip('getUUID', () => {
    testStart('getUUID', 'uuid')
  })

  test.skip('getCode201', () => {
    testStart('getCode201', 'userAvatar')
  })

  test.skip('getCode408', () => {
    testStart('getCode408')
  })

  test.skip('getLoginStatusSuccessed', () => {
    testStart('getLoginStatusSuccessed')
  })

  test.skip('getUser', () => {
    testStart(
      'getUser',
      { Uin: '123', NickName: 'hehe' },
      { key: 'getUser', value: 'hehe' }
    )
  })

  test.skip('getMemberlist', () => {
    testStart('getMemberlist', 1)
  })

  test.skip('getMemberlistEnded', () => {
    testStart('getMemberlistEnded', [])
  })

  test.skip('batchlist', () => {
    testStart('batchlist', 1)
  })

  test.skip('onerror throw', async () => {
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

    const worker = newWorker()

    worker.onmessage = event => {
      expect(event.data.value.status).toBe(999)
    }

    worker.postMessage({
      key: 'sendmsg',
      value: {
        Type: 3,
        tos: ['joe1']
      }
    })

    await new Promise(resolve => setTimeout(resolve, 1))
  })

  test('sendmsg', async () => {
    expect.assertions(2)

    const sendmsg = async ({ msgType, sending }) => {
      const worker = newWorker()

      worker.onmessage = event => {
        expect(event.data.key).toBe('sendmsg')
      }

      worker.postMessage({
        key: 'sendmsg',
        value: {
          Type: msgType,
          // Content: 'hello',
          file: {
            lastModifiedDate: new Date()
          },
          tos: ['joe1']
        }
      })

      await new Promise(resolve => setTimeout(resolve, 1))
    }
    await sendmsg({ msgType: 1, sending: 1 })
    await sendmsg({ msgType: 3, sending: 3 })
  })

  test('getGroupList', () => {
    expect.assertions(1)

    const worker = newWorker()

    worker.onmessage = event => {
      expect(event.data).toEqual({ key: 'getGroupListBack', value: [] })
    }

    worker.postMessage({
      key: 'getGroupList'
    })
  })

  test('addGroup', () => {
    expect.assertions(1)
    
    const worker = newWorker()

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
    
    const worker = newWorker()

    worker.onmessage = event => {
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
    
    const worker = newWorker()

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
    
    const worker = newWorker()

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
