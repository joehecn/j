
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
  getUser (NickName) {
    worker.store.commit('pushPrelist', {
      item: `已获取当前用户: ${NickName}`
    })
    worker.store.commit('pushPrelist', {
      item: '开始获取联系人和群, 请耐心等待...'
    })
  },
  // something
  getMemberlist (count) {
    worker.store.commit('pushPrelist', {
      item: `已获取${count}个联系人和群`
    })
  },
  getMemberlistEnded (list) {
    worker.store.commit('pushPrelist', { item: '获取联系人完成' })
    worker.store.commit('setRepeatNameList', { list })
    worker.store.commit('setTrueShowNextBtn')
  },
  batchlist (count) {
    worker.store.commit('pushPrelist', {
      item: `获取微信群完成！加联系人一起${count}`
    })
  },
  startSendmsg (value) {
    worker.store.commit('setSendMsgReport', value)
  },
  sendmsgBack (value) {
    const { leftMsgCount, sending, toNickName, msgType } = value
    worker.store.commit('setLeftMsgCount', { leftMsgCount })
    worker.store.commit('setSendMsgReport', { sending, toNickName, msgType })
  },

  onerror (value) {
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

// 前台: 后台 -> 前台
worker.onmessage = event => {
  const { key, value } = event.data
  methods[key] && methods[key](value)
}

export default worker
