
import sparkMD5 from 'spark-md5'
const isRoomContact = e => !!e && /^@@|@chatroom$/.test(e)

let curGroup = {}

// 当前重复的、聊天的人和群
let repeatList = {}

// {"Uin":0,"UserName":"@8d502ae9bd1e1b5d4480d4e846f14f5121b091bae52e42cad80da8eddc20df28","NickName":"Joe","HeadImgUrl":"/cgi-bin/mmwebwx-bin/webwxgeticon?seq=601370069&username=@8d502ae9bd1e1b5d4480d4e846f14f5121b091bae52e42cad80da8eddc20df28&skey=@crypt_a397bd88_e75765433939a2e1921ae44eb491bd29","ContactFlag":3,"MemberCount":0,"MemberList":[],"RemarkName":"","HideInputBarFlag":0,"Sex":1,"Signature":"","VerifyFlag":0,"OwnerUin":0,"PYInitial":"JOE","PYQuanPin":"Joe","RemarkPYInitial":"","RemarkPYQuanPin":"","StarFriend":0,"AppAccountFlag":0,"Statues":0,"AttrStatus":103357,"Province":"广东","City":"深圳","Alias":"","SnsFlag":16,"UniFriend":0,"DisplayName":"","ChatRoomId":0,"KeyWord":"","EncryChatRoomId":"","IsOwner":0}
// 当前有效的、聊天的人和群
let chatList = {}

const getPremd5 = (UserName, NickName, RemarkName) => {
  let pre = 'M'
  if (isRoomContact(UserName)) {
    pre = 'B'
  }
  return pre + sparkMD5.hash(`${NickName}${RemarkName}`)
}

const addChatListAndRepeatList = list => {
  list.filter(item => {
    return !!item.NickName
  }).forEach(item => {
    const premd5 = getPremd5(item.UserName, item.NickName, item.RemarkName)

    if (chatList[premd5]) {
      /* istanbul ignore else */
      if (chatList[premd5].UserName !== item.UserName) {
        // 说明两个不同的人重名了
        delete chatList[premd5]
        repeatList[premd5] = item
      }
    } else {
      chatList[premd5] = item
    }
  })
}

const getNickName = premd5 => {
  return chatList[premd5].NickName
}

const getChatListCount = () => {
  return Object.keys(chatList).length
}

const getRepeatNameList = () => {
  let list = []
  for (let key in repeatList) {
    list.push(repeatList[key].NickName)
  }
  return list
}

const getNormalListMB = (chatList, tos) => {
  let nListM = []
  let nListB = []

  for (let premd5 in chatList) {
    const item = {
      premd5,
      NickName: chatList[premd5].NickName,
      RemarkName: chatList[premd5].RemarkName,
      status: tos[premd5] ? 1 : 2
    }

    if (premd5[0] === 'M') {
      nListM.push(item)
    } else {
      nListB.push(item)
    }
  }

  return { nListM, nListB }
}

const getErrListMB = (chatList, tos) => {
  let eListM = []
  let eListB = []

  for (let premd5 in tos) {
    if (!chatList[premd5]) {
      const item = {
        premd5,
        NickName: tos[premd5].NickName,
        RemarkName: tos[premd5].RemarkName,
        status: 3
      }
      if (premd5[0] === 'M') {
        eListM.push(item)
      } else {
        eListB.push(item)
      }
    }
  }

  return { eListM, eListB }
}

// 这里有个副作用 curGroup = group
const getListMB = group => {
  curGroup = group

  const tos = group.tos
  const { nListM, nListB } = getNormalListMB(chatList, tos)
  // 错误的
  const { eListM, eListB } = getErrListMB(chatList, tos)
  
  return {
    listM: nListM.concat(eListM),
    listB: nListB.concat(eListB)
  }
}

const setCurGroup = ({ status, premd5, NickName, RemarkName }) => {
  const isAdd = !(status === 1)

  if (isAdd) {
    curGroup.tos[premd5] = { NickName, RemarkName }
  } else {
    delete curGroup.tos[premd5]
  }

  return curGroup
}

const resetData = () => {
  curGroup = {}
  repeatList = {}
  chatList = {}
}

/*
tos: { premd5: failCount }
toList: [{
  premd5,
  ToUserName,
  failCount
}]
*/
const getToList = tos => {
  return Object.keys(tos).map(premd5 => {
    return {
      premd5,
      ToUserName: chatList[premd5] && chatList[premd5].UserName,
      failCount: tos[premd5]
    }
  })
  // .filter(item => {
  //   return !!item.ToUserName
  // })
}

const getBuf = file => {
  return new Promise(resolve => {
    const reader = new FileReader()

    reader.onload = event => {
      // buf = event.target.result
      resolve(event.target.result)
    }

    reader.readAsArrayBuffer(file)
  })
}

export default {
  addChatListAndRepeatList,
  getNickName,
  getChatListCount,
  getRepeatNameList,
  getListMB,
  setCurGroup,
  resetData,
  getToList,
  getBuf
}
