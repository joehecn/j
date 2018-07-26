
const codes = {
  '201': true,
  '408': true
}

async function loginTipFirst () {
  this.ctx.uuid = await this.webwxapi.jslogin()
  this.notify('getUUID', this.ctx.uuid)

  this.ctx.loginCode = await this.webwxapi.login(this.ctx.uuid, 1)
}

function notifyCode () {
  if (this.ctx.loginCode.code === '201') {
    this.notify('getCode201', this.ctx.loginCode.userAvatar)
  } else {
    this.notify('getCode408')
  }
}

module.exports = {
  async start () {
    // 终止外循环 code === 200
    // 内循环条件 code === 408 201
    // 下面用不到
    // * 估计外循环条件 code === 400 500 0 202
    while (true) {
      await loginTipFirst.bind(this)()

      while (true) {
        if (!codes[this.ctx.loginCode.code]) {
          // 终止内循环 400 200 ...
          break
        }
        
        notifyCode.bind(this)()

        this.ctx.loginCode = await this.webwxapi.login(this.ctx.uuid, 0)
      }

      /* istanbul ignore else */
      if (this.ctx.loginCode.code === '200') {
        // console.log('终止外循环: code200')
        // 终止外循环
        break
      }
    }

    this.notify('getLoginStatusSuccessed')
  }
}
