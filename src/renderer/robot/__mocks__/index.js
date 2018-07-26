
const Emitter = require('events')

module.exports = class Robot extends Emitter {
  notify (key, value) {
    this.emit(key, { key, value })
  }
  // async start () {
  //   console.log('start')
  // }
  // sendmsg () {}
}
