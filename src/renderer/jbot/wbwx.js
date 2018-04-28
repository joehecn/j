
/**
 * API_jsLogin: "https://" + a + "/jslogin?appid=wx782c26e4c19acffb&redirect_uri=" + encodeURIComponent(location.protocol + "//" + location.host + "/cgi-bin/mmwebwx-bin/webwxnewloginpage") + "&fun=new&lang=" + o,
 * API_login: "https://" + a + "/cgi-bin/mmwebwx-bin/login",
 * API_synccheck: "https://" + i + "/cgi-bin/mmwebwx-bin/synccheck",
 * API_webwxdownloadmedia: "https://" + n + "/cgi-bin/mmwebwx-bin/webwxgetmedia",
 * API_webwxuploadmedia: "https://" + n + "/cgi-bin/mmwebwx-bin/webwxuploadmedia",
 * API_webwxpreview: "/cgi-bin/mmwebwx-bin/webwxpreview",
 * API_webwxinit: "/cgi-bin/mmwebwx-bin/webwxinit?r=" + ~new Date,
 * API_webwxgetcontact: "/cgi-bin/mmwebwx-bin/webwxgetcontact",
 * API_webwxsync: "/cgi-bin/mmwebwx-bin/webwxsync",
 * API_webwxbatchgetcontact: "/cgi-bin/mmwebwx-bin/webwxbatchgetcontact",
 * API_webwxgeticon: "/cgi-bin/mmwebwx-bin/webwxgeticon",
 * API_webwxsendmsg: "/cgi-bin/mmwebwx-bin/webwxsendmsg",
 * API_webwxsendmsgimg: "/cgi-bin/mmwebwx-bin/webwxsendmsgimg",
 * API_webwxsendmsgvedio: "/cgi-bin/mmwebwx-bin/webwxsendvideomsg",
 * API_webwxsendemoticon: "/cgi-bin/mmwebwx-bin/webwxsendemoticon",
 * API_webwxsendappmsg: "/cgi-bin/mmwebwx-bin/webwxsendappmsg",
 * API_webwxgetheadimg: "/cgi-bin/mmwebwx-bin/webwxgetheadimg",
 * API_webwxgetmsgimg: "/cgi-bin/mmwebwx-bin/webwxgetmsgimg",
 * API_webwxgetmedia: "/cgi-bin/mmwebwx-bin/webwxgetmedia",
 * API_webwxgetvideo: "/cgi-bin/mmwebwx-bin/webwxgetvideo",
 * API_webwxlogout: "/cgi-bin/mmwebwx-bin/webwxlogout",
 * API_webwxgetvoice: "/cgi-bin/mmwebwx-bin/webwxgetvoice",
 * API_webwxupdatechatroom: "/cgi-bin/mmwebwx-bin/webwxupdatechatroom",
 * API_webwxcreatechatroom: "/cgi-bin/mmwebwx-bin/webwxcreatechatroom",
 * API_webwxstatusnotify: "/cgi-bin/mmwebwx-bin/webwxstatusnotify",
 * API_webwxcheckurl: "/cgi-bin/mmwebwx-bin/webwxcheckurl",
 * API_webwxverifyuser: "/cgi-bin/mmwebwx-bin/webwxverifyuser",
 * API_webwxfeedback: "/cgi-bin/mmwebwx-bin/webwxsendfeedback",
 * API_webwxreport: "/cgi-bin/mmwebwx-bin/webwxstatreport",
 * API_webwxsearch: "/cgi-bin/mmwebwx-bin/webwxsearchcontact",
 * API_webwxoplog: "/cgi-bin/mmwebwx-bin/webwxoplog",
 * API_checkupload: "/cgi-bin/mmwebwx-bin/webwxcheckupload",
 * API_webwxrevokemsg: "/cgi-bin/mmwebwx-bin/webwxrevokemsg",
 * API_webwxpushloginurl: "/cgi-bin/mmwebwx-bin/webwxpushloginurl",
 *
 * errors
 * "100001": "获取uuid失败"
 * "100002": "获取code失败"
 */

import RPN from 'request-promise-native'
import { URL } from 'url'
import { parseString } from 'xml2js'
// import FormData from 'form-data'

// `https://login.wx2.qq.com/jslogin`
// `https://login.wx2.qq.com/cgi-bin/mmwebwx-bin/login`
// `https://${_host}/cgi-bin/mmwebwx-bin/webwxnewloginpage`
// `https://${_host}/cgi-bin/mmwebwx-bin/webwxinit`
// `https://${_host}/cgi-bin/mmwebwx-bin/webwxstatusnotify`
// `https://${_host}/cgi-bin/mmwebwx-bin/webwxgetcontact`
// `https://webpush.${_host}/cgi-bin/mmwebwx-bin/synccheck`
// `https://${_host}/cgi-bin/mmwebwx-bin/webwxsync`
// `https://${_host}/cgi-bin/mmwebwx-bin/webwxbatchgetcontact`
// `https://${_host}/cgi-bin/mmwebwx-bin/webwxsendmsg`
// `https://file.${_host}/cgi-bin/mmwebwx-bin/webwxuploadmedia?f=json`
// `https://${_host}/cgi-bin/mmwebwx-bin/webwxsendmsgimg`
// `https://${_host}`
let _host = ''

let j = RPN.jar()
const rpn = RPN.defaults({jar: j})

// 随机字符串产生函数
const _getDeviceID = () => {
  return 'e' + ('' + Math.random().toFixed(15)).substring(2, 17)
}

const _parseString = str => {
  // console.log(str)
  return new Promise((resolve, reject) => {
    parseString(str, {
      explicitArray: false
    }, (err, result) => {
      if (err) {
        reject(err)
      }

      if (result) {
        resolve(result.error)
      }
    })
  })
}

const _getFormateSyncCheckKey = list => {
  const len = list.length
  let a = []
  for (let i = 0; i < len; i++) {
    a.push(list[i].Key + '_' + list[i].Val)
  }

  return a.join('|')
}

// get uuid
// 'window.QRLogin.code = 200; window.QRLogin.uuid = "wYFkKGMQZg==";'
export const jslogin = async () => {
  const res = await rpn({
    url: 'https://login.wx2.qq.com/jslogin',
    qs: {
      appid: 'wx782c26e4c19acffb',
      fun: 'new',
      lang: 'zh_CN',
      _: Date.now()
    }
  })

  const arr = res.match(/window.QRLogin.code = 200; window.QRLogin.uuid = "(\S+?)";/)
  const uuid = (arr && arr[1]) ? arr[1] : ''
  if (uuid) {
    return uuid
  } else {
    throw new Error('100001') // '获取uuid失败'
  }
}

// tip:1 | 0 第一次为 1
// 'window.code=408;'
// window.code=200;
// window.redirect_uri="https://wx2.qq.com/cgi-bin/mmwebwx-bin/webwxnewloginpage?ticket=A9gYvoNfwJrgsaQVrFVFjFmG@qrticket_0&uuid=YYYURPyTYg==&lang=zh_CN&scan=1509248501";
export const login = async (uuid, tip) => {
  const res = await rpn({
    url: 'https://login.wx2.qq.com/cgi-bin/mmwebwx-bin/login',
    qs: {
      uuid,
      tip,
      _: Date.now()
    }
  })

  const arr = res.match(/window.code=(\d+);/)
  const code = (arr && arr[1]) ? arr[1] : ''
  if (code) {
    let codes = [code, {
      fun: 'new',
      version: 'v2'
    }]

    if (code === '200') {
      const arr2 = res.match(/window.redirect_uri="(\S+?)";/)
      if (arr2 && arr2[1]) {
        const u = new URL(arr2[1])
        // console.log(u)
        _host = u.host
        codes[1].ticket = u.searchParams.get('ticket')
        codes[1].uuid = uuid
        codes[1].lang = u.searchParams.get('lang')
        codes[1].scan = u.searchParams.get('scan')

        return codes
      }
    } else {
      return codes
    }
  }

  throw new Error('100002') // '获取code失败'
}

// ticket:A5NxojSqIYebRO9KlhP-eWQj@qrticket_0
// uuid:YeJMR3UH8A==
// lang:zh_CN
// scan:1509030538
// fun:new
// version:v2
/* <error>
  <ret>0</ret>
  <message></message>
  <skey>@crypt_a397bd88_e8cf402557d60a22deede83afd3ea060</skey>
  <wxsid>JrcO6K8mMrfbWiBK</wxsid>
  <wxuin>3642174990</wxuin>
  <pass_ticket>XDAsqqwfRiRXaCjLfG3ankp%2FuWU4HmrvHKnWJPI1yIXEnt2E6S6%2BK9q6ML5EFaQQ</pass_ticket>
  <isgrayscale>1</isgrayscale>
</error> */
// webwx_data_ticket: webwxDataTicket
export const webwxnewloginpage = async qs => {
  const url = `https://${_host}/cgi-bin/mmwebwx-bin/webwxnewloginpage`
  const res = await rpn({
    url,
    qs
  })

  let webwxDataTicket = ''
  const arr = j.getCookieString(url).split('webwx_data_ticket=')
  if (arr.length > 1) {
    webwxDataTicket = arr[1].split(';')[0]
  }

  const obj = await _parseString(res)

  if (obj && obj.wxuin) {
    return { obj, webwxDataTicket }
  }

  throw new Error('100004') // '获取uin失败'
}

// BaseResponse: Object
// ChatSet: "filehelper,@@e487ee869ebc28e7b55e0f322ae7f8e8c4cbab8c5cade0340ee9b8538b73a159,weixin,@@60daf4407a42d0d417771e98b268cc272f52a671ffdd17270f5f4f240fe6749d,@@77ed85eb7b3ddc909fc74f2f056456547fc81993b97148ad8ef0c70c3d7ac1eb,@2325e9f9cefeba4d09d74072764d2de7,"
// ClickReportInterval: 600000
// ClientVersion: 637866037
// ContactList: Array(6)
// Count: 6
// GrayScale: 1
// InviteStartCount: 40
// MPSubscribeMsgCount: 0
// MPSubscribeMsgList: Array(0)
// SKey: "@crypt_47714410_e930839fdf47e5125a095d33c56cadc3"
// SyncKey: Object
// SystemTime: 1509265945
// User: Object
export const webwxinit = async (BaseRequest, lang, passTicket) => {
  BaseRequest.DeviceID = _getDeviceID()
  const res = await rpn({
    url: `https://${_host}/cgi-bin/mmwebwx-bin/webwxinit`,
    method: 'POST',
    qs: {
      r: ~new Date(),
      lang,
      pass_ticket: passTicket
    },
    json: true,
    body: {
      BaseRequest
    }
  })

  // 1486186303 老 3642174990 新
  if (res && res.SyncKey && res.User && res.User.Uin) {
    return res
  }

  throw new Error('100005') // '获取User失败'
}

// 开启微信状态通知, 未读数同步
// { BaseResponse: { ErrMsg: "", Ret: 0 }, MsgID: "6536736974794287101" }
export const webwxstatusnotify = async (BaseRequest, lang, passTicket, userName) => {
  BaseRequest.DeviceID = _getDeviceID()
  const res = await rpn({
    url: `https://${_host}/cgi-bin/mmwebwx-bin/webwxstatusnotify`,
    method: 'POST',
    qs: {
      lang,
      pass_ticket: passTicket
    },
    json: true,
    body: {
      BaseRequest,
      ClientMsgId: Date.now(),
      Code: 3,
      FromUserName: userName,
      ToUserName: userName
    }
  })

  if (res && res.BaseResponse.Ret === 0) {
    return res
  }

  throw new Error('100006') // '开启微信状态通知失败'
}

// BaseResponse: Object
// MemberCount: 181
// MemberList: Array(181)
// Seq: 0

// "Uin": 0,
// "UserName": 用户名称，一个"@"为好友，两个"@"为群组
// "NickName": 昵称
// "HeadImgUrl":头像图片链接地址
// "ContactFlag": 1-好友， 2-群组， 3-公众号
// "MemberCount": 成员数量，只有在群组信息中才有效,
// "MemberList": 成员列表,
// "RemarkName": 备注名称
// "HideInputBarFlag": 0,
// "Sex": 性别，0-未设置（公众号、保密），1-男，2-女
// "Signature": 公众号的功能介绍 or 好友的个性签名
// "VerifyFlag": 0,
// "OwnerUin": 0,
// "PYInitial": 用户名拼音缩写
// "PYQuanPin": 用户名拼音全拼
// "RemarkPYInitial":备注拼音缩写
// "RemarkPYQuanPin": 备注拼音全拼
// "StarFriend": 是否为星标朋友  0-否  1-是
// "AppAccountFlag": 0,
// "Statues": 0,
// "AttrStatus": 119911,
// "Province": 省
// "City": 市
// "Alias":
// "SnsFlag": 17,
// "UniFriend": 0,
// "DisplayName": "",
// "ChatRoomId": 0,
// "KeyWord":
// "EncryChatRoomId": ""

/**
 *
 * @param {*} lang
 * @param {*} passTicket
 * @param {*} skey
 */
export const webwxgetcontact = async (lang, passTicket, seq, skey) => {
  const res = await rpn({
    url: `https://${_host}/cgi-bin/mmwebwx-bin/webwxgetcontact`,
    qs: {
      lang,
      pass_ticket: passTicket,
      r: Date.now(),
      seq,
      skey
    },
    json: true
  })

  if (res && res.BaseResponse.Ret === 0) {
    return res
  }

  throw new Error('100007') // '获取好友列表失败'
}

// window.synccheck={retcode:"0",selector:"2"}
// retcode:
//   0 正常
//   1100 失败/登出微信
//   1101 其他地方登录web微信
// selector:
//   0 正常
//   2 新的消息
//   6 疑似红包消息
//   7 进入/离开聊天界面
export const synccheck = async (BaseRequest, list) => {
  let res
  try {
    res = await rpn({
      url: `https://webpush.${_host}/cgi-bin/mmwebwx-bin/synccheck`,
      qs: {
        r: Date.now(),
        skey: BaseRequest.Skey,
        sid: BaseRequest.Sid,
        uin: BaseRequest.Uin,
        deviceid: _getDeviceID(),
        synckey: _getFormateSyncCheckKey(list),
        _: Date.now()
      }
    })
  } catch (e) {
    // console.log(e)
    if (e.statusCode === 0) {
      return ['0', '2']
    } else {
      throw new Error()
    }
  }

  // console.log(res)

  const arr = res.match(/window.synccheck={retcode:"(\d+)",selector:"(\d+)"}/)
  // console.log('wbwx synccheck: ', arr)
  if (arr && arr[1] === '0') {
    return [arr[1], arr[2]]
  } else if (arr && arr[1] === '1100') {
    throw new Error('101100') // '登出微信'
  } else if (arr && arr[1] === '1101') {
    throw new Error('101101') // '其他设备登录web微信'
  } else {
    throw new Error('100008') // '消息检查失败'
  }
}

// MM_USERATTRVERIFYFALG_BIZ:           1,
// MM_USERATTRVERIFYFALG_FAMOUS:        2,
// MM_USERATTRVERIFYFALG_BIZ_BIG:       4,
// MM_USERATTRVERIFYFALG_BIZ_BRAND:     8,
// MM_USERATTRVERIFYFALG_BIZ_VERIFIED: 16,

// MM_DATA_TEXT:                        1, 文本消息
// MM_DATA_HTML:                        2,
// MM_DATA_IMG:                         3, 图片消息
// MM_DATA_PRIVATEMSG_TEXT:            11,
// MM_DATA_PRIVATEMSG_HTML:            12,
// MM_DATA_PRIVATEMSG_IMG:             13,
// MM_DATA_VOICEMSG:                   34, 语音消息
// MM_DATA_PUSHMAIL:                   35,
// MM_DATA_QMSG:                       36,
// MM_DATA_VERIFYMSG:                  37, 好友确认消息
// MM_DATA_PUSHSYSTEMMSG:              38,
// MM_DATA_QQLIXIANMSG_IMG:            39,
// MM_DATA_POSSIBLEFRIEND_MSG:         40,
// MM_DATA_SHARECARD:                  42, 共享名片
// MM_DATA_VIDEO:                      43, 视频消息
// MM_DATA_VIDEO_IPHONE_EXPORT:        44,
// MM_DATA_EMOJI:                      47, 动画表情
// MM_DATA_LOCATION:                   48, 位置消息
// MM_DATA_APPMSG:                     49, 分享链接
// MM_DATA_VOIPMSG:                    50,
// MM_DATA_STATUSNOTIFY:               51,
// MM_DATA_VOIPNOTIFY:                 52,
// MM_DATA_VOIPINVITE:                 53,
// MM_DATA_MICROVIDEO:                 62, 小视频
// MM_DATA_SYSNOTICE:                9999,
// MM_DATA_SYS:                       1e4, 系统消息
// MM_DATA_RECALLED:                10002, 撤回消息
export const webwxsync = async (BaseRequest, lang, SyncKey) => {
  BaseRequest.DeviceID = _getDeviceID()
  const res = await rpn({
    url: `https://${_host}/cgi-bin/mmwebwx-bin/webwxsync`,
    method: 'POST',
    qs: {
      sid: BaseRequest.Sid,
      skey: BaseRequest.Skey,
      lang
    },
    json: true,
    body: {
      BaseRequest,
      SyncKey,
      rr: ~new Date()
    }
  })

  if (res && res.BaseResponse.Ret === 0) {
    return res
  }

  throw new Error('100009') // '获取最新消息失败'
}

export const webwxbatchgetcontact = async (BaseRequest, lang, passTicket, List) => {
  BaseRequest.DeviceID = _getDeviceID()
  const res = await rpn({
    url: `https://${_host}/cgi-bin/mmwebwx-bin/webwxbatchgetcontact`,
    method: 'POST',
    qs: {
      type: 'ex',
      r: Date.now(),
      lang,
      pass_ticket: passTicket
    },
    json: true,
    body: {
      BaseRequest,
      Count: List.length,
      List
    }
  })

  if (res && res.BaseResponse.Ret === 0) {
    return res.ContactList
  } else {
    // don't throw err
    return []
  }
}

// AppInfo: Object
// AppMsgType: 0
// Content: "777"
// CreateTime: 1509277327
// FileName: ""
// FileSize: ""
// ForwardFlag: 0
// FromUserName: "@2c189cba0be21e4e787b1f72799265f81f2d05ba816fb8524ac611330efcd2b1"
// HasProductId: 0
// ImgHeight: 0
// ImgStatus: 1
// ImgWidth: 0
// MediaId: ""
// MsgId: "1747445588949743624"
// MsgType: 1
// NewMsgId: 1747445588949743600
// OriContent: ""
// PlayLength: 0
// RecommendInfo: Object
// Status: 3
// StatusNotifyCode: 0
// StatusNotifyUserName: ""
// SubMsgType: 0
// Ticket: ""
// ToUserName: "@c70493bb8095d7d179f0511a666cc026b487ab2931c7168043368f5196166988"
// Url: ""
// VoiceLength: 0

// ClientMsgId: msgId,
// Content: '444',
// FromUserName: msg,
// LocalID: msgId,
// ToUserName: msg,
// Type: 1
export const webwxsendmsg = async (BaseRequest, lang, passTicket, Msg) => {
  BaseRequest.DeviceID = _getDeviceID()
  const res = await rpn({
    url: `https://${_host}/cgi-bin/mmwebwx-bin/webwxsendmsg`,
    method: 'POST',
    qs: {
      lang,
      pass_ticket: passTicket
    },
    json: true,
    body: {
      BaseRequest,
      Msg,
      Scene: 0
    }
  })

  // console.log(res)

  if (res && res.BaseResponse.Ret === 0) {
    return res
  }

  throw new Error('100010') // '发送消息失败'
}

// 这个 api 让我泪奔～～
export const webwxuploadmedia = async (BaseRequest, passTicket, webwxDataTicket, file, FileMd5, buf, Msg) => {
  BaseRequest.DeviceID = _getDeviceID()
  const res = await rpn({
    url: `https://file.${_host}/cgi-bin/mmwebwx-bin/webwxuploadmedia?f=json`,
    method: 'POST',
    json: true,
    formData: {
      id: 'WU_FILE_0',
      name: file.name,
      type: file.type,
      lastModifiedDate: file.lastModifiedDate.toGMTString(),
      size: file.size,
      mediatype: 'pic',
      uploadmediarequest: JSON.stringify({
        UploadType: 2,
        BaseRequest,
        ClientMediaId: file.lastModified,
        TotalLen: file.size,
        StartPos: 0,
        DataLen: file.size,
        MediaType: 4,
        FromUserName: Msg.FromUserName,
        ToUserName: Msg.ToUserName,
        FileMd5
      }),
      webwx_data_ticket: webwxDataTicket,
      pass_ticket: passTicket,
      filename: {
        value: buf,
        options: {
          filename: file.name,
          contentType: file.type
        }
      }
    }
  })

  if (res && res.BaseResponse.Ret === 0) {
    return res
  }

  throw new Error('100011') // 上传图片失败
}

export const webwxsendmsgimg = async (BaseRequest, passTicket, Msg) => {
  BaseRequest.DeviceID = _getDeviceID()
  const res = await rpn({
    url: `https://${_host}/cgi-bin/mmwebwx-bin/webwxsendmsgimg`,
    method: 'POST',
    qs: {
      fun: 'async',
      f: 'json',
      pass_ticket: passTicket
    },
    json: true,
    body: {
      BaseRequest,
      Msg,
      Scene: 0
    }
  })

  if (res && res.BaseResponse.Ret === 0) {
    return res
  }

  throw new Error('100012') // '发送图片失败'
}

export const coverBase64 = url => {
  return new Promise(resolve => {
    let Writable = require('stream').Writable
    let ws = Writable()
    let chunks = []
    let size = 0
    let type = 'image/jpeg'

    ws._write = (chunk, end, next) => {
      size += chunk.length
      chunks.push(chunk)
      next()
    }

    ws.on('finish', () => {
      let buf = Buffer.concat(chunks, size)
      let base = buf.toString('base64')
      let data = ''
      if (base) {
        data = `data:${type};base64,${base}`
      }
      resolve(data)
    })

    rpn(`https://${_host}${url}`).on('response', response => {
      type = response.headers['content-type'] // 'image/png'
    }).pipe(ws)
  })
}
