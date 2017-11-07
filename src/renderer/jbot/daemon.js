
/**
 * events
 * on_reluser, on_memberlist, on_msg, on_setbatch
 * 
 * public methods API
 * start
 * 
 */

import Emitter from 'events'
import { webwxnewloginpage, webwxinit, webwxstatusnotify, webwxgetcontact,
  synccheck, webwxsync, webwxbatchgetcontact } from './wbwx.js'

const getList = str => {
  const arr = str.split(',')
  return arr.filter(item => {
    return item[1] === '@'
  }).map(item => {
    return { UserName: item }
  })
}

export default new class Daemon extends Emitter {
  async start (ctx) {
    let { obj, webwxDataTicket } = await webwxnewloginpage(ctx.codes[1])
    ctx.BaseRequest = {
      Uin: obj.wxuin,
      Sid: obj.wxsid,
      Skey: obj.skey
    }
    ctx.passTicket = obj.pass_ticket
    ctx.webwxDataTicket = webwxDataTicket

    let res = await webwxinit(ctx.BaseRequest, ctx.codes[1].lang, ctx.passTicket)
    ctx.SyncKey = res.SyncKey
    ctx.User = res.User

    this.emit('on_reluser', ctx.User)

    res = await webwxstatusnotify(ctx.BaseRequest, ctx.codes[1].lang, ctx.passTicket, ctx.User.UserName)

    res = await webwxgetcontact(ctx.codes[1].lang, ctx.passTicket, ctx.BaseRequest.Skey)
    // ctx.MemberList = res.MemberList
    this.emit('on_memberlist', res.MemberList)

    while (true) {
      res = await synccheck(ctx.BaseRequest, ctx.SyncKey.List)

      // 新消息
      if (res[1] === '2') {
        res = await webwxsync(ctx.BaseRequest, ctx.codes[1].lang, ctx.SyncKey)
        ctx.SyncKey = res.SyncKey
        res.AddMsgList.forEach(item => {
          switch (item.MsgType) {
            // 文本消息
            case 1:
              // 发给我的文本消息
              if (item.ToUserName === ctx.User.UserName) {
                this.emit('on_msg', item)
              }
              break
            case 51:
              // 在 StatusNotifyUserName 获取群
              if (item.StatusNotifyUserName) {
                const List = getList(item.StatusNotifyUserName)
                if (List.length > 0) {
                  webwxbatchgetcontact(ctx.BaseRequest, ctx.codes[1].lang, ctx.passTicket, List).then(ContactList => {
                    this.emit('on_batchlist', ContactList)
                  })
                }
              }
              break
            default:
          }
        })
      }
    }
  }
}()
