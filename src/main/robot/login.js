
const codes = {
  '201': true,
  '408': true
}

async function loginTipOne () {
  this.ctx.uuid = await this.webwxapi.jslogin()
  this.notify('getUUID', this.ctx.uuid)

  this.ctx.loginCode = await this.webwxapi.login(this.ctx.uuid, 1)
}

async function loginTipZero () {
  if (this.ctx.loginCode.code === '201') {
    this.notify('getCode201', this.ctx.loginCode.userAvatar)
  } else {
    this.notify('getCode408')
  }
  this.ctx.loginCode = await this.webwxapi.login(this.ctx.uuid, 0)
}

async function loginLoop () {
  while (true) {
    if (!codes[this.ctx.loginCode.code]) {
      // 终止内循环 400 200 ...
      break
    }
    
    await loginTipZero.bind(this)()
  }
}

module.exports = {
  async start () {
    // 终止外循环 code === 200
    // 内循环条件 code === 408 201
    // 下面用不到
    // * 估计外循环条件 code === 400 500 0 202
    while (true) {
      if (this.ctx.loginCode && this.ctx.loginCode.code === '200') {
        this.notify('getLoginStatusSuccessed')
        // 终止外循环
        break
      }

      await loginTipOne.bind(this)()

      await loginLoop.bind(this)()
    }
  }
}
