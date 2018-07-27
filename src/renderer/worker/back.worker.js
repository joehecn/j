
/**
 * backWorker
 * -- 操作 robot db data
 * 
 *
 *
 */

import Robot from '../robot'
import db from './db.js'
import data from './data.js'

let robot = null
let Uin = ''

const passMessage = message => {
  postMessage(message)
}

const getLoginStatusSuccessed = message => {
  data.resetData()
  postMessage(message)
}

const getUser = ({ key, value }) => {
  Uin = value.Uin
  postMessage({ key, value: value.NickName })
}

const getMemberlist = ({ key, value }) => {
  data.addChatListAndRepeatList(value) // list
  const count = data.getChatListCount()
  postMessage({ key, value: count })
}

const getMemberlistEnded = ({ key }) => {
  const repeatNameList = data.getRepeatNameList()
  postMessage({ key, value: repeatNameList })
}

const batchlist = ({ key, value }) => {
  data.addChatListAndRepeatList(value)
  const count = data.getChatListCount()
  postMessage({ key, value: count })
}

const startSendmsg = ({ key, value }) => {
  const { premd5, Type } = value
  const toNickName = data.getNickName(premd5)
  postMessage({
    key,
    value: {
      sending: 2,
      toNickName,
      msgType: Type
    }
  })
}

const sendmsgBack = async ({ key, value }) => {
  // value { Msg failCount key leftMsgCount premd5 }
  // Msg { Type }
  // db
  // let msg = await db('getMsg', {
  //   Uin,
  //   key: value.key
  // })
  let msg = await db('getItem', {
    name: Uin,
    storeName: 'msg',
    key: value.key
  })

  let sending = 3
  if (value.failCount === 0) {
    // 说明消息发送成功
    sending = 1
    delete msg.tos[value.premd5]
  } else {
    msg.tos[value.premd5] = value.failCount
  }

  // await db('setMsg', {
  //   Uin,
  //   key: value.key,
  //   msg
  // })
  await db('setItem', {
    name: Uin,
    storeName: 'msg',
    key: value.key,
    value: msg
  })

  const toNickName = data.getNickName(value.premd5)
  postMessage({
    key,
    value: {
      leftMsgCount: value.leftMsgCount,
      sending,
      toNickName,
      msgType: value.Msg.Type
    }
  })
}

const methods = {
  //////////////////
  // robot

  async start() {
    robot = new Robot()

    robot
      .on('getUUID', passMessage)
      .on('getCode201', passMessage)
      .on('getCode408', passMessage)
      .on('getLoginStatusSuccessed', getLoginStatusSuccessed)
      .on('getUser', getUser)
      .on('getMemberlist', getMemberlist)
      .on('getMemberlistEnded', getMemberlistEnded)
      .on('batchlist', batchlist)
      .on('startSendmsg', startSendmsg)
      .on('sendmsgBack', sendmsgBack)
      .on('onerror', passMessage)

    await robot.start()
  },

  // value = { Type, (Content || file), tos: { premd5: failCount } }
  async sendmsg(value) {
    // db
    // { key: { Type, (Content || file), tos: { premd5: failCount } } }
    const key = (+new Date() + Math.random().toFixed(3)).replace('.', '')
    // await db('setMsg', {
    //   Uin,
    //   key,
    //   msg: value
    // })
    await db('setItem', {
      name: Uin,
      storeName: 'msg',
      key,
      value
    })

    // robot
    /*
    msgItem: {
      key,
      Type,
      Content, || file, buf
      toList: [{
        premd5,
        ToUserName,
        failCount
      }]
    }
    */
    const { Type, Content, file, tos } = value
    const toList = data.getToList(tos)

    const msgItem = {
      key,
      Type,
      toList
    }

    if (Type === 1) {
      msgItem.Content = Content
    } else {
      msgItem.file = file
      msgItem.buf = await data.getBuf(file)
    }

    robot.sendmsg(msgItem)
  },

  //////////////////
  // db

  // group
  async getGroupList() {
    const groupList = await db('getGroupList', Uin)
    postMessage({
      key: 'getGroupListBack',
      value: groupList
    })
  },
  async addGroup({ md5, groupName }) {
    // await db('setGroup', {
    //   Uin,
    //   md5,
    //   group: {
    //     groupName,
    //     tos: {}
    //   }
    // })
    await db('setItem', {
      name: Uin,
      storeName: 'group',
      key: md5,
      value: {
        groupName,
        tos: {}
      }
    })
    postMessage({
      key: 'addGroupBack',
      value: { md5, groupName }
    })
  },
  async delGroup({ index, md5 }) {
    await db('delGroup', { Uin, md5 })
    postMessage({
      key: 'delGroupBack',
      value: index
    })
  },
  async getGroup({ md5 }) {
    // const group = await db('getGroup', { Uin, md5 })
    const group = await db('getItem', {
      name: Uin,
      storeName: 'group',
      key: md5
    })
    const {listM, listB } = data.getListMB(group)
    postMessage({
      key: 'getGroupBack',
      value: {listM, listB }
    })
  },
  async changeStatus({ md5, item, category }) {
    const group = data.setCurGroup(item)
    // await db('setGroup', { Uin, md5, group })
    await db('setItem', {
      name: Uin,
      storeName: 'group',
      key: md5,
      value: group
    })
    postMessage({
      key: 'changeStatusBack',
      value: { premd5: item.premd5, status: item.status, category }
    })
  }
}

// 后台: 前台 -> 后台
onmessage = event => {
  methods[event.data.key] && methods[event.data.key](event.data.value)
    .catch(err => {
      postMessage({
        key: 'onerror',
        value: {
          status: err.status || 999,
          message: err.message || '未处理错误'
        }
      })
    })
}
