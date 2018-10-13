
/**
 * robot
 * -- 只操作 login daemon
 */

const Emitter = require('events')
const login = require('./login.js')
const daemon = require('./daemon.js')
const something = require('./something.js')
const webwxapi = require('./webwxapi')

/*
  ctx = {
    // -------- login.js
    uuid: '',                              // jslogin
    loginCode: { code, userAvatar, query } // login
    // -------- daemon.js
    BaseRequest: { Uin, Sid, Skey }
    passTicket: ''
    webwxDataTicket: ''                    // webwxnewloginpage
    SyncKey,
    User,                                  // webwxinit
    status,
    message
  }
*/
const ctx = {}

const loginCreate = Object.create(login)
const daemonCreate = Object.create(daemon)
const somethingCreate = Object.create(something)

loginCreate.ctx =
  daemonCreate.ctx =
  somethingCreate.ctx = ctx

daemonCreate.something = somethingCreate

let notifyBind = null

function notify (key, value) {
  this.emit('robot-reply', { key, value })
}

module.exports = class Robot extends Emitter {
  constructor () {
    super()
    const webwxapiCreate = Object.create(webwxapi)
    loginCreate.webwxapi =
      daemonCreate.webwxapi =
      somethingCreate.webwxapi = webwxapiCreate

    notifyBind = notify.bind(this)
    loginCreate.notify =
      daemonCreate.notify =
      somethingCreate.notify = notifyBind
  }

  async start () {
    try {
      await loginCreate.start()
      await daemonCreate.start()
    } catch (err) {
      ctx.status = err.status || err.statusCode || err.code || 999
      ctx.message = err.message || '未处理错误'
      notifyBind('onerror', ctx)
    }
  }

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
  sendmsg (msgItem) {
    somethingCreate.storeToMsgList(msgItem)
  }
}
