
import mutations from '@/store/mutations.js'

describe('store/mutations', () => {
  let state = null

  beforeEach(() => {
    state = {
      workerErrStatus: 0,
      workerErrMessage: '',
    
      //////////////////
      // login
      loginImg: '',
      code408: 0,
      code201: false,
    
      //////////////////
      // preset
      prelist: [],
      showNextBtn: false,
      repeatNameList: [],
    
      //////////////////
      // group
      groupList: [],
      clearNewGroupNameInput: false,
    
      //////////////////
      // chat
      curGroupMd5: '',
      listM: [],
      listB: [],
    
      leftMsgCount: 0,
    
      sending: 1, // 1 success 2 info(sending) 3 error
      toNickName: '',
      msgType: 1
    }
  })

  test('setGithub', () => {
    expect.assertions(1)
    
    const github = { tag_name: 'v1' }
    mutations.setGithub(state, { github })

    expect(state.github).toBe(github)
  })

  test('setWorkerErr', () => {
    expect.assertions(2)

    const workerErr = { status: 999, message: '未处理错误' }
    mutations.setWorkerErr(state, { workerErr })

    expect(state.workerErrStatus).toBe(workerErr.status)
    expect(state.workerErrMessage).toBe(workerErr.message)
  })

  test('setUuid', () => {
    expect.assertions(3)

    const uuid = 'uuid'
    mutations.setUuid(state, { uuid })

    expect(state.code408).toBe(0)
    expect(state.code201).toBeFalsy()
    expect(state.loginImg).toBe(`https://login.weixin.qq.com/qrcode/${uuid}`)
  })

  test('plusCode408', () => {
    expect.assertions(1)

    mutations.plusCode408(state)

    expect(state.code408).toBe(1)
  })

  test('setTrueCode201', () => {
    expect.assertions(2)

    const loginImg = 'loginImg'
    mutations.setTrueCode201(state, { loginImg })

    expect(state.code201).toBeTruthy()
    expect(state.loginImg).toBe(loginImg)
  })

  test('resetPrelist', () => {
    expect.assertions(3)

    mutations.resetPrelist(state)

    expect(state.repeatNameList).toEqual([])
    expect(state.showNextBtn).toBeFalsy()
    expect(state.prelist).toEqual([])
  })

  test('pushPrelist', () => {
    expect.assertions(1)

    const item = {}
    mutations.pushPrelist(state, { item })

    expect(state.prelist).toEqual([{}])
  })

  test('setTrueShowNextBtn', () => {
    expect.assertions(1)

    mutations.setTrueShowNextBtn(state)
    
    expect(state.showNextBtn).toBeTruthy()
  })

  test('setRepeatNameList', () => {
    expect.assertions(1)

    const list = [ 'hehe' ]
    mutations.setRepeatNameList(state, { list })

    expect(state.repeatNameList).toEqual([ 'hehe' ])
  })

  test('setGroupList', () => {
    expect.assertions(1)

    const groupList = [ 'hehe' ]
    mutations.setGroupList(state, { groupList })

    expect(state.groupList).toEqual([ 'hehe' ])
  })

  test('addGroup', () => {
    expect.assertions(2)

    const group = {}
    mutations.addGroup(state, { group })

    expect(state.clearNewGroupNameInput).toBeTruthy()
    expect(state.groupList).toEqual([{}])
  })

  test('delGroup', () => {
    expect.assertions(1)

    mutations.addGroup(state, { group: {} })
    mutations.delGroup(state, { index: 0 })

    expect(state.groupList).toEqual([])
  })

  test('setFalseClearNewGroupNameInput', () => {
    expect.assertions(1)

    mutations.setFalseClearNewGroupNameInput(state)

    expect(state.clearNewGroupNameInput).toBeFalsy()
  })

  test('setCurGroupMd5', () => {
    expect.assertions(1)

    const md5 = 'md5'
    mutations.setCurGroupMd5(state, { md5 })

    expect(state.curGroupMd5).toBe(md5)
  })

  test('setListMB', () => {
    expect.assertions(2)

    mutations.setListMB(state, { list: [ 'M' ], category: 'M' })
    mutations.setListMB(state, { list: [ 'B' ], category: 'B' })

    expect(state.listM).toEqual([ 'M' ])
    expect(state.listB).toEqual([ 'B' ])
  })

  test('setListMBItem', () => {
    const itemM = { premd5: 'premd51', status: 3, category: 'M' }
    const itemB1 = { premd5: 'premd52', status: 1, category: 'B' }
    const itemB2 = { premd5: 'premd53', status: 2, category: 'B' }
    mutations.setListMB(state, { list: [ itemM ], category: 'M' })
    mutations.setListMB(state, { list: [ itemB1, itemB2 ], category: 'B' })

    mutations.setListMBItem(state, itemM)
    mutations.setListMBItem(state, itemB1)
    mutations.setListMBItem(state, itemB2)

    expect(state.listM).toEqual([])
    expect(state.listB).toEqual([
      { premd5: 'premd52', status: 2, category: 'B' },
      { premd5: 'premd53', status: 1, category: 'B' }
    ])
  })

  test('setLeftMsgCount', () => {
    expect.assertions(1)

    const leftMsgCount = 1
    mutations.setLeftMsgCount(state, { leftMsgCount })

    expect(state.leftMsgCount).toBe(1)
  })

  test('setSendMsgReport', () => {
    expect.assertions(3)

    const report = {
      sending: 1,
      toNickName: 'joe',
      msgType: 1
    }
    mutations.setSendMsgReport(state, report)

    expect(state.sending).toBe(1)
    expect(state.toNickName).toBe('joe')
    expect(state.msgType).toBe(1)
  })
})
