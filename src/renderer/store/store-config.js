
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

const state = {
  //////////////////
  // github
  github: null,

  //////////////////
  // worker
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

export default {
  state,
  getters,
  mutations,
  actions
}
