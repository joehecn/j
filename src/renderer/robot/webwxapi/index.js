
/**
 * webwx api
 */
const superagent = require('superagent')
const upload = require('./upload/upload.js')
const createErr = require('../createErr.js')

const {
  getUUID,
  getHostAndLoginCode,
  getWebwxDataTicketFromCookies,
  getBaseRequest,
  getDeviceID,
  getFormateSyncCheckKey,
  getFileMd5,
  getWuFile
} = require('./fun.js')

let request = null
let _host = ''

module.exports = {
  /**
   * @returns {String} uuid
   */
  async jslogin() {
    request = superagent.agent()

    const res = await request
      .get('https://login.wx.qq.com/jslogin')
      .retry() // default 3
      .query({
        appid: 'wx782c26e4c19acffb',
        // redirect_uri: 'https://wx.qq.com/cgi-bin/mmwebwx-bin/webwxnewloginpage',
        fun: 'new',
        lang: 'zh_CN',
        _: Date.now()
      })

    // uuid
    return getUUID(res.text)
  },

  /**
   * 
   * @param {String} uuid 
   * @param {Number} tip 
   * tip: 第一次 1，以后 0
   * 
   * @returns {host, loginCode: {code, userAvatar, query}}
   * query: { ticket, uuid, lang, scan fun: 'new', version: 'v2' }
   */
  async login(uuid, tip) {
    const res = await request
      .get('https://login.wx.qq.com/cgi-bin/mmwebwx-bin/login')
      .retry() // default 3
      .query({
        loginicon: true,
        uuid,
        tip,
        r: + ~new Date,
        _: Date.now()
      })
    /*
    res.text =
    window.code=200;
      window.redirect_uri="https://wx2.qq.com/cgi-bin/mmwebwx-bin/webwxnewloginpage?ticket=A5jx4eP42GmsYUsWFr5A2tqN@qrticket_0&uuid=Aa0lWznQxA==&lang=zh_CN&scan=1526546884";

    window.code=201;userAvatar = 'data:img/jpg;base64,/9j...';
    */
    // { loginCode: { code: '201', userAvatar } }
    // { host, loginCode: { code: '200', query } }
    // { loginCode: { code: others } }
    const hostAndLoginCode = getHostAndLoginCode(res.text)
    
    /* istanbul ignore else */
    if (hostAndLoginCode.host) {
      _host = hostAndLoginCode.host
    }

    return hostAndLoginCode.loginCode
  },

  /**
   * 
   * @param {*} query = ctx.loginCode.query
   * { ticket, uuid, lang, scan fun: 'new', version: 'v2' }
   * ticket: A74wzSwsQQ3aujETEozTLJ-E@qrticket_0
   * uuid: 4a_uAo-mJw==
   * lang: zh_CN
   * scan: 1531883977
   * @returns { BaseRequest, passTicket, webwxDataTicket }
   * BaseRequest: { Uin, Sid, Skey }
   */

  /*
   res.text =
   <error>
     <ret>0</ret>
     <message></message>
     <skey>@crypt_a397bd88_d4687b76ae759c62dc3be4665356615c</skey>
     <wxsid>hwzOeMNYnm6np4A6</wxsid><wxuin>3642174990</wxuin>
     <pass_ticket>
       U2WI%2Bj54wHu9eZ54MobYcOEjaJIiFglEHoLGDzjqH%2FQXb7UIDL%2Bh0crF2ucr8bPe
     </pass_ticket>
     <isgrayscale>1</isgrayscale>
   </error>
 */
  async webwxnewloginpage(query) {
    // 如果 参数query 没有 fun 和 version 属性，
    // 会出现 301 重定向
    // try {
    const res = await request
      .get(`https://${_host}/cgi-bin/mmwebwx-bin/webwxnewloginpage`)
      .retry() // default 3
      // .redirects(0)
      .query(query)

    const cookies = res.header['set-cookie']
    const webwxDataTicket = getWebwxDataTicketFromCookies(cookies)
    const { BaseRequest, passTicket } = await getBaseRequest(res.text)
    return { BaseRequest, passTicket, webwxDataTicket }
    // } catch (error) {
    //   // 301 重定向
    //   const res = error.response

    //   console.log('webwxnewloginpage:', 301)
    //   const cookies = res.header['set-cookie']
    //   const webwxDataTicket = getWebwxDataTicketFromCookies(cookies)
    //   const { BaseRequest, passTicket } = await getBaseRequest(res.text)
    //   return { BaseRequest, passTicket, webwxDataTicket }
    // }
  },

  /**
   * 
   * @param {*} passTicket 
   * @param {*} BaseRequest 
   * 
   * @returns { SyncKey, User }
   */
  async webwxinit(passTicket, BaseRequest) {
    BaseRequest.DeviceID = getDeviceID()
    const res = await request
      .post(`https://${_host}/cgi-bin/mmwebwx-bin/webwxinit`)
      .retry() // default 3
      .query({
        r: ~new Date(),
        pass_ticket: passTicket
      })
      .send({ BaseRequest })

    const ress = JSON.parse(res.text)
    if (ress && ress.SyncKey && ress.User && ress.User.Uin) {
      const { SyncKey, User } = ress
      return { SyncKey, User }
    }

    throw createErr(800, '获取 User 失败')
  },

  /**
   * notifyMobile
   * 通知手机
   * 
   * @param {*} passTicket 
   * @param {*} BaseRequest 
   * @param {*} userName 
   * 
   * @returns { success, err }
   */
  async webwxstatusnotify(passTicket, BaseRequest, userName) { // lang,
    try {
      BaseRequest.DeviceID = getDeviceID()

      const res = await request
        .post(`https://${_host}/cgi-bin/mmwebwx-bin/webwxstatusnotify`)
        .retry() // default 3
        .query({
          // lang,
          pass_ticket: passTicket
        })
        .send({
          BaseRequest,
          ClientMsgId: Date.now(),
          Code: 3,
          FromUserName: userName,
          ToUserName: userName
        })

      const ress = JSON.parse(res.text)
      if (ress && ress.BaseResponse && ress.BaseResponse.Ret === 0) {
        return { success: true }
      }

      throw createErr(801, '开启微信状态通知失败')
    } catch (err) {
      const status = err.status || err.statusCode || err.code || 999
      const message = err.message || '未处理错误'

      return { success: false, err: { status, message } }
    }
  },

  /**
   * 
   * @param {*} passTicket 
   * @param {*} seq 
   * @param {*} skey 
   * 
   * @returns { Seq, MemberList }
   */
  async webwxgetcontact(passTicket, seq, skey) { // lang, 
    const res = await request
      .get(`https://${_host}/cgi-bin/mmwebwx-bin/webwxgetcontact`)
      .retry() // default 3
      .query({
        // lang,
        pass_ticket: passTicket,
        r: Date.now(),
        seq,
        skey
      })

    const ress = JSON.parse(res.text)
    if (ress && ress.BaseResponse.Ret === 0) {
      const { Seq, MemberList } = ress
      return { Seq, MemberList }
    }

    throw createErr(802, '获取好友列表失败')
  },

  /**
   * 
   * @param {*} BaseRequest 
   * @param {*} list 
   * 
   * @returns {String} '0' || '2'
   */
  async synccheck(BaseRequest, list) {
    const res = await request
      .get(`https://webpush.${_host}/cgi-bin/mmwebwx-bin/synccheck`)
      .retry() // default 3
      .query({
        r: Date.now(),
        skey: BaseRequest.Skey,
        sid: BaseRequest.Sid,
        uin: BaseRequest.Uin,
        deviceid: getDeviceID(),
        synckey: getFormateSyncCheckKey(list),
        _: Date.now()
      })

    const arr =
      res.text.match(/window.synccheck={retcode:"(\d+)",selector:"(\d+)"}/)
    
    /* istanbul ignore else */
    if (arr) {
      switch (arr[1]) {
        case '0':
          return arr[2]
        case '1100':
          throw createErr(803, '登出微信')
        case '1101':
          throw createErr(804, '其他设备登录web微信')
        case '1102':
          throw createErr(805, '暂时不知道')
      }
    }

    throw createErr(806, '监听心跳失败')
  },

  /**
   * 
   * @param {*} BaseRequest 
   * @param {*} passTicket 
   * @param {*} SyncKey 
   * 
   * @returns { SyncKey, SyncCheckKey, AddMsgList }
   */
  async webwxsync(BaseRequest, passTicket, SyncKey) { // lang, 
    BaseRequest.DeviceID = getDeviceID()
    const res = await request
      .post(`https://${_host}/cgi-bin/mmwebwx-bin/webwxsync`)
      .retry() // default 3
      .query({
        sid: BaseRequest.Sid,
        skey: BaseRequest.Skey,
        pass_ticket: passTicket
        // lang
      })
      .send({
        BaseRequest,
        SyncKey,
        rr: ~new Date()
      })

    const ress = JSON.parse(res.text)
    if (ress && ress.BaseResponse.Ret === 0) {
      const { SyncKey, SyncCheckKey, AddMsgList } = ress
      return { SyncKey, SyncCheckKey, AddMsgList }
    }

    throw createErr(807, '更新 SyncKey 失败')
  },

  /**
   * 
   * @param {*} BaseRequest 
   * @param {*} passTicket 
   * @param {*} List 
   * 
   * @returns {Array} ContactList
   * 
   */
  async webwxbatchgetcontact(passTicket, BaseRequest, List) { // lang,
    BaseRequest.DeviceID = getDeviceID()
    const res = await request
      .post(`https://${_host}/cgi-bin/mmwebwx-bin/webwxbatchgetcontact`)
      .retry() // default 3
      .query({
        type: 'ex',
        r: Date.now(),
        // lang,
        pass_ticket: passTicket
      })
      .send({
        BaseRequest,
        Count: List.length,
        List
      })

    const ress = JSON.parse(res.text)
    if (ress && ress.BaseResponse.Ret === 0) {
      return ress.ContactList
    }

    throw createErr(808, '获取聊天群列表失败')
  },

  /**
   * 
   * @param {*} BaseRequest 
   * @param {*} lang 
   * @param {*} passTicket 
   * @param {*} Msg 
   * ClientMsgId
   * Content
   * FromUserName
   * LocalID
   * ToUserName
   * Type: 1
   */
  async webwxsendmsg(passTicket, BaseRequest, Msg) { // lang, 
    BaseRequest.DeviceID = getDeviceID()

    const res = await request
      .post(`https://${_host}/cgi-bin/mmwebwx-bin/webwxsendmsg`)
      .retry() // default 3
      .query({
        // lang,
        pass_ticket: passTicket
      })
      .send({
        BaseRequest,
        Msg,
        Scene: 0
      })

    return JSON.parse(res.text)
  },

  /**
   * 
   * @param {*} BaseRequest 
   * @param {*} passTicket 
   * @param {*} Msg 
   * ClientMsgId
   * Content: ""
   * FromUserName
   * LocalID
   * MediaId
   * ToUserName
   * Type: 3
   */
  async webwxsendmsgimg(passTicket, BaseRequest, Msg) {
    BaseRequest.DeviceID = getDeviceID()
    Msg.Content = ''

    const res = await request
      .post(`https://${_host}/cgi-bin/mmwebwx-bin/webwxsendmsgimg`)
      .retry() // default 3
      .query({
        fun: 'async',
        f: 'json',
        pass_ticket: passTicket
      })
      .send({
        BaseRequest,
        Msg,
        Scene: 0
      })

    return JSON.parse(res.text)
  },

  async webwxuploadmedia(BaseRequest, webwxDataTicket, file, buf, Msg) {
    BaseRequest.DeviceID = getDeviceID()

    const uploadmediarequest = {
      UploadType: 2,
      BaseRequest,
      ClientMediaId: file.lastModified,
      TotalLen: file.size,
      StartPos: 0,
      DataLen: file.size,
      MediaType: 4,
      FromUserName: Msg.FromUserName,
      ToUserName: Msg.ToUserName,
      FileMd5: getFileMd5(buf)
    }

    const fields = [{
      name: 'id',
      value: getWuFile()
    }, {
      name: 'name',
      value: file.name
    }, {
      name: 'type',
      value: file.type
    }, {
      name: 'lastModifiedDate',
      value: file.lastModifiedDate.toGMTString()
    }, {
      name: 'size',
      value: file.size
    }, {
      name: 'mediatype',
      value: 'pic'
    }, {
      name: 'uploadmediarequest',
      value: JSON.stringify(uploadmediarequest)
    }, {
      name: 'webwx_data_ticket',
      value: webwxDataTicket
    }, {
      name: 'pass_ticket',
      value: 'undefined'
    }, {
      name: 'filename',
      filename: file.name,
      type: file.type
    }]

    // const attach = {
    //   name: 'filename',
    //   filename: file.name,
    //   type: file.type
    // }

    const res = await upload(
      `https://file.${_host}/cgi-bin/mmwebwx-bin/webwxuploadmedia?f=json`,
      // 'WebKitFormBoundary',
      fields,
      // attach,
      buf
    )
    return JSON.parse(res)
  }
}
