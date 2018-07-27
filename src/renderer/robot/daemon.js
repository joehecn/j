
const { getBatchList } = require('./fun.js')

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

async function wxsync () {
  let { SyncKey, SyncCheckKey, AddMsgList } = await this.webwxapi.webwxsync(
    this.ctx.BaseRequest,
    // this.ctx.loginCode.query.lang,
    this.ctx.passTicket,
    this.ctx.SyncKey
  )

  this.ctx.SyncKey = SyncKey
  /* istanbul ignore else */
  if (SyncCheckKey && SyncCheckKey.List.length > 0) {
    this.ctx.SyncKey = SyncCheckKey
  }

  AddMsgList && AddMsgList.forEach(item => {
    //StatusNotifyCode = 0 收到消息

    /* istanbul ignore else */
    if (item.StatusNotifyCode === 4) {
      // 在 StatusNotifyUserName 获取群
      /* istanbul ignore else */
      if (item.StatusNotifyUserName) {
        const list = getBatchList(item.StatusNotifyUserName)
        /* istanbul ignore else */
        if (list.length > 0) {
          this.something.add('batchgetcontact', list)
        }
      }
    }
  })
}

async function init () {
  const { BaseRequest, passTicket, webwxDataTicket } =
    await this.webwxapi.webwxnewloginpage(this.ctx.loginCode.query)
  this.ctx.BaseRequest = BaseRequest
  this.ctx.passTicket = passTicket
  this.ctx.webwxDataTicket = webwxDataTicket

  const { SyncKey, User } =
    await this.webwxapi.webwxinit(this.ctx.passTicket, this.ctx.BaseRequest)

  this.ctx.SyncKey = SyncKey

  const { Uin, NickName, UserName } = User
  this.ctx.User = { Uin, NickName, UserName }

  this.notify('getUser', { Uin, NickName })
}

// 通知手机
async function notifyMobile () {
  const { success, err } = await this.webwxapi.webwxstatusnotify(
    this.ctx.passTicket,
    this.ctx.BaseRequest,
    this.ctx.User.UserName
  )
  if (!success) {
    const { status, message } = err
    this.ctx.status = status
    this.ctx.message = message
    this.notify('onerror', this.ctx)
  }
}

module.exports = {
  async start () {
    // 初始化
    await init.bind(this)()

    // 通知手机
    await notifyMobile.bind(this)()

    this.something.add('getcontact', 0)
    while (true) {
      const res = await this.webwxapi.synccheck(
        this.ctx.BaseRequest,
        this.ctx.SyncKey.List
      )
      
      if (res === '0') {
        await this.something.do()
      } else {
        await wxsync.bind(this)()
        // * 要稳定的话注释下面代码

        // * 要加快发送消息的速度可以取消下面两行代码的注释 和
        // 取消最上面关于 sleep 方法的定义的注释
        await this.something.do()
        await sleep(6000) // 休眠 6 秒
      }
    }
  }
}
