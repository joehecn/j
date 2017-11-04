
/**
 * events
 * on_error, on_scan, on_code_201, on_login
 * on_reluser, on_memberlist, on_daemon
 * 
 * public methods API
 * login
 */

import Emitter from 'events'
import compose from 'koa-compose'
import login from './login.js'
import daemon from './daemon.js'
import * as msg from './msg.js'
import * as tuling from './tuling.js'
import store from '@/store'

// {
//   fun: "new"
//   lang: "zh_CN"
//   scan: "1509251263"
//   ticket: "A8uvqkImlpJsCWwlQX1t6H_X@qrticket_0"
//   uuid: "obnu-6e9rw=="
//   version: "v2"
// }
let CTX = {}

// 方法管理器
const methods = {
  login: async ctx => {
    await login.start(ctx)
  },

  daemon: async ctx => {
    if (!(ctx.status && ctx.status === '0')) {
      throw new Error('100003') // '请先登录系统'
    } else {
      await daemon.start(ctx)
    }
  },

  sendmsg: async ctx => {
    if (!(ctx.status && ctx.status === '0')) {
      throw new Error('100003') // '请先登录系统'
    } else {
      await msg.sendmsg(ctx)
    }
  }
}

const middleware = [
  // 集中处理错误
  async (ctx, next) => {
    try {
      await next()
    } catch (err) {
      console.log(err)
      ctx.status = err.message || '100000' // '未知错误'
    }
  },
  // 方法路由 - 分发业务逻辑
  async ctx => {
    await methods[ctx.method](ctx)
  }
]

// 借鉴 koajs 的洋葱圈模型
const fn = compose(middleware)

const method = async (ctx, jbot) => {
  await fn(ctx)

  if (ctx.status === '0') {
    jbot.emit(`on_${ctx.method}`, ctx)
  } else {
    jbot.emit('on_error', ctx.status)
  }

  return ctx
}

export default new class JBot extends Emitter {
  /**
   * Initialize a new `JBot`.
   *
   * @api public
   */

  constructor () {
    super()

    login.on('on_scan', uuid => {
      this.emit('on_scan', uuid)
    }).on('on_code_201', () => {
      this.emit('on_code_201')
    })

    daemon.on('on_reluser', user => {
      this.emit('on_reluser', user)
    }).on('on_memberlist', memberlist => {
      this.emit('on_memberlist', memberlist)
    }).on('on_msg', msg => {
      this.emit('on_msg', msg)
    })
  }

  async login () {
    const ctx = await method({
      method: 'login',
      status: '0'
    }, this)

    if (ctx.codes[0] === '200') {
      CTX = ctx
    }
  }

  async daemon () {
    CTX.method = 'daemon'

    const ctx = await method(CTX, this)
    console.log(ctx)
  }

  async robotsendmsg (msg) {
    const res = await tuling.sendmsg(msg.Content, msg.FromUserName.replace(/@/g, ''))

    CTX.method = 'sendmsg'

    const msgId = (+new Date() + Math.random().toFixed(3)).replace('.', '')

    CTX.Msg = {
      ClientMsgId: msgId,
      Content: `${res} -- robot 小J`,
      FromUserName: msg.ToUserName,
      LocalID: msgId,
      ToUserName: msg.FromUserName,
      Type: 1
    }
    const ctx = await method(CTX, this)
    console.log(ctx)
  }

  async sendmsg (msg) {
    CTX.method = 'sendmsg'
    const msgId = (+new Date() + Math.random().toFixed(3)).replace('.', '')
    CTX.Msg = {
      ClientMsgId: msgId,
      Content: msg.Content,
      FromUserName: store.state.user.UserName,
      LocalID: msgId,
      ToUserName: msg.ToUserName,
      Type: 1
    }

    const ctx = await method(CTX, this)
    return ctx
  }
}()
