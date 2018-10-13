
import { ipcRenderer } from 'electron'
import Worker from './back.worker.js'

const worker = new Worker()

const methods = {
  //////////////////
  // robot

  // login.start()
  getUUID (uuid) {
    worker.store.commit('setUuid', { uuid })
  },
  getCode201 (userAvatar) {
    worker.store.commit('setTrueCode201', { loginImg: userAvatar })
  },
  getCode408 () {
    worker.store.commit('plusCode408')
  },
  getLoginStatusSuccessed () {
    worker.store.commit('resetPrelist')
    worker.router.push('preset')
  },

  // daemon.start()
  getUser (value) {
    worker.postMessage({ key: 'getUser', value: value.Uin })
    worker.store.commit('pushPrelist', {
      item: `已获取当前用户: ${value.NickName}`
    })
    worker.store.commit('pushPrelist', {
      item: '开始获取联系人和群, 请耐心等待...'
    })
  },

  // something
  getMemberlist (value) {
    worker.postMessage({ key: 'getMemberlist', value })
  },
  getMemberlistBack (value) {
    worker.store.commit('pushPrelist', {
      item: `已获取${value}个联系人和群`
    })
  },

  getMemberlistEnded () {
    worker.postMessage({ key: 'getMemberlistEnded' })
  },
  getMemberlistEndedBack (list) {
    worker.store.commit('pushPrelist', { item: '获取联系人完成' })
    worker.store.commit('setRepeatNameList', { list })
    worker.store.commit('setTrueShowNextBtn')
  },

  batchlist (value) {
    worker.postMessage({ key: 'batchlist', value })
  },
  batchlistBack (value) {
    worker.store.commit('pushPrelist', {
      item: `获取微信群完成！加联系人一起${value}`
    })
  },

  sendmsg (value) {
    ipcRenderer.send('robot-message', {
      key: 'sendmsg',
      value
    })
  },

  startSendmsg (value) {
    worker.postMessage({ key: 'startSendmsg', value })
  },
  startSendmsgBack (value) {
    worker.store.commit('setSendMsgReport', value)
  },

  sendmsgBack (value) {
    worker.postMessage({ key: 'sendmsgBack', value })
  },
  sendmsgBackBack (value) {
    const { leftMsgCount, sending, toNickName, msgType } = value
    worker.store.commit('setLeftMsgCount', { leftMsgCount })
    worker.store.commit('setSendMsgReport', { sending, toNickName, msgType })
  },

  onerror (value) {
    console.log(value)
    worker.store.commit('setWorkerErr', { workerErr: value })
  },

  //////////////////
  // db
  getGroupListBack (groupList) {
    worker.store.commit('setGroupList', { groupList })
  },
  addGroupBack ({ md5, groupName }) {
    worker.store.commit('addGroup', { group: { md5, groupName } })
  },
  delGroupBack (index) {
    worker.store.commit('delGroup', { index })
  },
  getGroupBack ({listM, listB }) {
    worker.store.commit('setListMB', { list: listM, category: 'M' })
    worker.store.commit('setListMB', { list: listB, category: 'B' })
  },
  changeStatusBack ({ premd5, status, category }) {
    worker.store.commit('setListMBItem', { premd5, status, category } )
  }
}

ipcRenderer.on('robot-reply', (event, arg) => {
  methods[arg.key] && methods[arg.key](arg.value)
})

worker.postRobotMessage = data => {
  ipcRenderer.send('robot-message', data)
}

// 前台: 后台 -> 前台
worker.onmessage = event => {
  const { key, value } = event.data
  methods[key] && methods[key](value)
}

export default worker
