
const findItem = (premd5, list) => {
  let index = -1
  let item = null
  for (let i = 0; i < list.length; i++) {
    if (list[i].premd5 === premd5) {
      index = i
      item = list[i]
      break
    }
  }
  return { index, item }
}

export default {
  setGithub (state, { github }) {
    state.github = github
  },

  setWorkerErr (state, { workerErr }) {
    state.workerErrStatus = workerErr.status
    state.workerErrMessage = workerErr.message
  },

  setUuid (state, { uuid }) {
    state.code408 = 0
    state.code201 = false
    state.loginImg = `https://login.weixin.qq.com/qrcode/${uuid}`
  },

  plusCode408 (state) {
    state.code408++
  },

  setTrueCode201 (state, { loginImg }) {
    state.code201 = true
    state.loginImg = loginImg
  },

  resetPrelist (state) {
    state.repeatNameList = []
    state.showNextBtn = false
    state.prelist = []
  },

  pushPrelist (state, { item }) {
    state.prelist.push(item)
  },

  setTrueShowNextBtn (state) {
    state.showNextBtn = true
  },

  setRepeatNameList (state, { list }) {
    state.repeatNameList = list
  },

  setGroupList (state, { groupList }) {
    state.groupList = groupList
  },

  addGroup (state, { group }) {
    state.groupList.push(group)
    state.clearNewGroupNameInput = true
  },

  delGroup (state, { index }) {
    state.groupList.splice(index, 1)
  },

  setFalseClearNewGroupNameInput (state) {
    state.clearNewGroupNameInput = false
  },

  setCurGroupMd5 (state, { md5 }) {
    state.curGroupMd5 = md5
  },

  setListMB (state, { list, category }) {
    if (category === 'M') {
      state.listM = list
    } else {
      state.listB = list
    }
  },

  setListMBItem (state, { premd5, status, category }) {
    let list = category === 'M' ? state.listM : state.listB

    const { index, item } = findItem(premd5, list)

    /* istanbul ignore else */
    if (index > -1) {
      if (status === 3) {
        list.splice(index, 1)
      } else {
        item.status = status === 1 ? 2 : 1
        list.splice(index, 1, item)
      }
    }
  },

  setLeftMsgCount (state, { leftMsgCount }) {
    state.leftMsgCount = leftMsgCount
  },

  setSendMsgReport (state, { sending, toNickName, msgType }) {
    state.toNickName = toNickName,
    state.msgType = msgType
    state.sending = sending
  }
}
