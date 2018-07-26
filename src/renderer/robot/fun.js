
const JOEs = [
  'weibo', 'qqmail', 'fmessage', 'tmessage', 'qmessage',
  'qqsync', 'floatbottle', 'lbsapp', 'shakeapp', 'medianote',
  'qqfriend', 'readerapp', 'blogapp', 'facebookapp', 'masssendapp',
  'meishiapp', 'feedsapp', 'voip', 'blogappweixin', 'weixin',
  'brandsessionholder', 'weixinreminder', 'wxid_novlwrv3lqwv11',
  'gh_22b87fa7cb3c', 'officialaccounts', 'notification_messages'
]

const JOEl = [
  'newsapp', 'wxid_novlwrv3lqwv11',
  'gh_22b87fa7cb3c', 'notification_messages'
]

const isRoomContact = e => !!e && /^@@|@chatroom$/.test(e)

const isSpUser = e => {
  for (var t = 0, a = JOEs.length; t < a; t++) {
    if (JOEs[t] === e || /@qqim$/.test(e)) { return !0 }
  }
  return !1
}

const isShieldUser = e => {
  if (/@lbsroom$/.test(e) || /@talkroom$/.test(e)) { return !0 }
  for (var t = 0, a = JOEl.length; t < a; ++t) {
    if (JOEl[t] === e) { return !0 }
  }
  return !1
}

module.exports = {
  getBatchList (str) {
    const arr = str.split(',')
    return arr.filter(item => {
      return !isShieldUser(item) && !isSpUser(item) && isRoomContact(item)
    }).map(item => {
      return { UserName: item }
    })
  },

  getMemberList (list) {
    return list.filter(item => {
      return !isShieldUser(item.UserName) && !isSpUser(item.UserName)
    })
  },

  // for test
  isRoomContact,
  isSpUser,
  isShieldUser
}
