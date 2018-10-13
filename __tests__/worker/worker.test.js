
// jest.mock('@/worker/back.worker.js')

// import worker from '@/worker/worker.js'

// worker.store = {
//   commit: jest.fn()
// }

// worker.router = {
//   push: jest.fn()
// }

// const testNormal = (data, key, value) => {
//   expect.assertions(1)

//   worker.onmessage({ data })

//   expect(worker.store.commit)
//     .toHaveBeenCalledWith(key, value)
// }

describe.skip('worker/worker.js', () => {
  test('getUUID', () => {
    const data = {
      key: 'getUUID',
      value: 'uuid'
    }

    testNormal(data, 'setUuid', { uuid: 'uuid' })
  })

  test('getCode201', () => {
    const data = {
      key: 'getCode201',
      value: 'userAvatar'
    }

    testNormal(data, 'setTrueCode201', { loginImg: 'userAvatar' })
  })

  test('getCode408', () => {
    expect.assertions(1)

    const data = {
      key: 'getCode408'
    }
    // worker.onmessage({ data })

    expect(worker.store.commit)
      .toHaveBeenCalledWith('plusCode408')
  })

  test('getLoginStatusSuccessed', () => {
    expect.assertions(2)

    const data = {
      key: 'getLoginStatusSuccessed'
    }
    // worker.onmessage({ data })

    expect(worker.store.commit)
      .toHaveBeenCalledWith('resetPrelist')
    expect(worker.router.push)
      .toHaveBeenCalledWith('preset')
  })

  test('getUser', () => {
    expect.assertions(2)

    const data = {
      key: 'getUser',
      value: 'joe'
    }
    // worker.onmessage({ data })

    expect(worker.store.commit)
      .toHaveBeenCalledWith('pushPrelist', { item: '已获取当前用户: joe' })
    expect(worker.store.commit)
      .toHaveBeenCalledWith('pushPrelist', {
        item: '开始获取联系人和群, 请耐心等待...'
      })
  })

  test('getMemberlist', () => {
    const data = {
      key: 'getMemberlist',
      value: 2
    }

    testNormal(data, 'pushPrelist', { item: '已获取2个联系人和群' })
  })

  test('getMemberlistEnded', () => {
    expect.assertions(3)

    const data = {
      key: 'getMemberlistEnded',
      value: []
    }
    // worker.onmessage({ data })

    expect(worker.store.commit)
      .toHaveBeenCalledWith('pushPrelist', { item: '获取联系人完成' })
    expect(worker.store.commit)
      .toHaveBeenCalledWith('setRepeatNameList', { list: [] })
    expect(worker.store.commit)
      .toHaveBeenCalledWith('setTrueShowNextBtn')
  })

  test('batchlist', () => {
    const data = {
      key: 'batchlist',
      value: 1
    }

    testNormal(data, 'pushPrelist', { item: '获取微信群完成！加联系人一起1' })
  })

  test('startSendmsg', () => {
    expect.assertions(1)

    const data = {
      key: 'startSendmsg',
      value: 'start'
    }
    // worker.onmessage({ data })

    expect(worker.store.commit)
      .toHaveBeenCalledWith('setSendMsgReport', 'start')
  })

  test('sendmsgBack', () => {
    expect.assertions(2)

    const data = {
      key: 'sendmsgBack',
      value : { leftMsgCount: 1, sending: 1, toNickName: 'joe', msgType: 1 }
    }
    // worker.onmessage({ data })

    expect(worker.store.commit)
      .toHaveBeenCalledWith('setLeftMsgCount', { leftMsgCount: 1 })
    expect(worker.store.commit)
      .toHaveBeenCalledWith('setSendMsgReport', {
        sending: 1, toNickName: 'joe', msgType: 1
      })
  })

  test('onerror', () => {
    const data = {
      key: 'onerror',
      value: { status: 900, message: 'ddd' }
    }
    // worker.onmessage({ data })

    expect(worker.store.commit)
      .toHaveBeenCalledWith('setWorkerErr', {
        workerErr: { status: 900, message: 'ddd' }
      })
  })

  test('getGroupListBack', () => {
    expect.assertions(1)

    const data = {
      key: 'getGroupListBack',
      value: []
    }
    // worker.onmessage({ data })

    expect(worker.store.commit)
      .toHaveBeenCalledWith('setGroupList', { groupList: [] })
  })

  test('addGroupBack', () => {
    expect.assertions(1)

    const data = {
      key: 'addGroupBack',
      value: { md5: '123', groupName: 'test' }
    }
    // worker.onmessage({ data })

    expect(worker.store.commit)
      .toHaveBeenCalledWith('addGroup',  {
        group: { md5: '123', groupName: 'test' }
      })
  })

  test('delGroupBack', () => {
    expect.assertions(1)

    const data = {
      key: 'delGroupBack',
      value: 1
    }
    // worker.onmessage({ data })

    expect(worker.store.commit)
      .toHaveBeenCalledWith('delGroup', { index: 1 })
  })

  test('getGroupBack', () => {
    expect.assertions(2)

    const data = {
      key: 'getGroupBack',
      value: { listM: [], listB: [] }
    }
    // worker.onmessage({ data })

    expect(worker.store.commit)
      .toHaveBeenCalledWith('setListMB', { list: [], category: 'M' })
    expect(worker.store.commit)
      .toHaveBeenCalledWith('setListMB', { list: [], category: 'B' })
  })

  test('changeStatusBack', () => {
    expect.assertions(1)

    const data = {
      key: 'changeStatusBack',
      value: { premd5: 'pp', status: 1, category: 'M' }
    }
    // worker.onmessage({ data })

    expect(worker.store.commit)
      .toHaveBeenCalledWith('setListMBItem', {
        premd5: 'pp', status: 1, category: 'M'
      })
  })
})
