
/**
 * events
 * on_error, on_scan, on_code_201, on_login
 * on_reluser, on_memberlist, on_msg, on_batchlist
 * 
 * public methods API
 * login
 */

import Emitter from 'events'
import compose from 'koa-compose'
import login from './login.js'
import daemon from './daemon.js'
import * as joss from './joss.js'
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

const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

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
  },

  sendimg: async ctx => {
    if (!(ctx.status && ctx.status === '0')) {
      throw new Error('100003') // '请先登录系统'
    } else {
      await msg.sendimg(ctx)
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
    this.joss = joss

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
    }).on('on_batchlist', batchlist => {
      this.emit('on_batchlist', batchlist)
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
    return ctx
  }

  async robotsendmsg (msg) {
    const res = await tuling.sendmsg(store.state.form.tulingkey.trim(), msg.Content, msg.FromUserName.replace(/@/g, ''))

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
    await method(CTX, this)
    // console.log(ctx)
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

  async sendimg (msg) {
    CTX.method = 'sendimg'
    CTX.file = msg.file
    CTX.FileMd5 = msg.FileMd5
    CTX.buf = msg.buf
    const msgId = (+new Date() + Math.random().toFixed(3)).replace('.', '')
    CTX.Msg = {
      ClientMsgId: msgId,
      Content: '',
      FromUserName: store.state.user.UserName,
      LocalID: msgId,
      ToUserName: msg.ToUserName,
      Type: 3
    }
    const ctx = await method(CTX, this)

    await sleep(6000) // 休眠 6 秒

    return ctx
  }

  async sendimgs (first, fileArr) {
    const len1 = first.length
    const len2 = fileArr.length

    for (let i = 0; i < len1; i++) {
      const item = first[i]
      const ToUserName = item.UserName
      for (let j = 0; j < len2; j++) {
        const fileObj = fileArr[j]

        const ctx = await this.sendimg({
          file: fileObj.file,
          FileMd5: fileObj.FileMd5,
          buf: fileObj.buf,
          ToUserName
        })

        this.emit('on_sendimged', {
          status: ctx.status,
          NickName: item.NickName,
          j
        })
      }
    }
  }
}()
