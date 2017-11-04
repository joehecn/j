
/**
 * events
 * on_scan, on_code_201
 * 
 * public methods API
 * start
 * 
 */

import Emitter from 'events'
import { jslogin, login } from './wbwx.js'

// 保存最新的 start 方法 id
// 用来终止旧 start 方法
let newid = ''

// 随机字符串产生函数
const _random = () => {
  return ('' + Math.random().toFixed(15)).substring(2, 17)
}

export default new class Login extends Emitter {
  async start (ctx) {
    const id = _random()
    newid = id

    // 外循环条件 code === 400
    // 内循环条件 code === '408' || code === '201'
    while (true) {
      if (newid !== id) {
        break
      }

      ctx.uuid = await jslogin()
      this.emit('on_scan', ctx.uuid)

      ctx.codes = await login(ctx.uuid, 1)

      while (true) {
        if (newid !== id) {
          break
        }

        if (ctx.codes[0] === '201') {
          this.emit('on_code_201')

          ctx.codes = await login(ctx.uuid, 0)
        } else if (ctx.codes[0] === '408') {
          ctx.codes = await login(ctx.uuid, 0)
        } else {
          // 终止循环
          break
        }
      }

      if (ctx.codes[0] !== '400') {
        // 终止循环
        break
      }
    }
  }
}()
