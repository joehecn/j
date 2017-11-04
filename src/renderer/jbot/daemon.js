
/**
 * events
 * on_reluser, on_memberlist, on_msg
 * 
 * public methods API
 * start
 * 
 */

import Emitter from 'events'
import { webwxnewloginpage, webwxinit, webwxstatusnotify, webwxgetcontact,
  synccheck, webwxsync } from './wbwx.js'

export default new class Daemon extends Emitter {
  async start (ctx) {
    let res = await webwxnewloginpage(ctx.codes[1])
    ctx.BaseRequest = {
      Uin: res.wxuin,
      Sid: res.wxsid,
      Skey: res.skey
    }
    ctx.passTicket = res.pass_ticket

    res = await webwxinit(ctx.BaseRequest, ctx.codes[1].lang, ctx.passTicket)
    ctx.SyncKey = res.SyncKey
    ctx.User = res.User

    this.emit('on_reluser', ctx.User)

    res = await webwxstatusnotify(ctx.BaseRequest, ctx.codes[1].lang, ctx.passTicket, ctx.User.UserName)

    res = await webwxgetcontact(ctx.codes[1].lang, ctx.passTicket, ctx.BaseRequest.Skey)
    ctx.MemberList = res.MemberList
    this.emit('on_memberlist', ctx.MemberList)

    while (true) {
      res = await synccheck(ctx.BaseRequest, ctx.SyncKey.List)

      // 新消息
      if (res[1] === '2') {
        res = await webwxsync(ctx.BaseRequest, ctx.codes[1].lang, ctx.SyncKey)
        ctx.SyncKey = res.SyncKey
        res.AddMsgList.forEach(item => {
          switch (item.MsgType) {
            case 1:
              // 发给我的文本消息
              if (item.ToUserName === ctx.User.UserName) {
                this.emit('on_msg', item)
              }
              break
            default:
          }
        })
      }
    }
  }
}()
