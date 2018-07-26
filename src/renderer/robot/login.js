
module.exports = {
  async start () {
    // 终止外循环 code === 200
    // 内循环条件 code === 408 201
    // 下面用不到
    // * 估计外循环条件 code === 400 500 0 202
    while (true) {
      this.ctx.uuid = await this.webwxapi.jslogin()
      this.notify('getUUID', this.ctx.uuid)

      this.ctx.loginCode = await this.webwxapi.login(this.ctx.uuid, 1)

      while (true) {
        if (this.ctx.loginCode.code === '201') {
          this.notify('getCode201', this.ctx.loginCode.userAvatar)
          this.ctx.loginCode = await this.webwxapi.login(this.ctx.uuid, 0)
        } else if (this.ctx.loginCode.code === '408') {
          this.notify('getCode408')
          this.ctx.loginCode = await this.webwxapi.login(this.ctx.uuid, 0)
        } else {
          // 终止内循环 400 200 ...
          // console.log('终止内循环: code', this.ctx.loginCode.code)
          break
        }
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
