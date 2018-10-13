
const Emitter = require('events')

class PassThrough extends Emitter {
  end () {}
  pipe () {
    this.emit('finish')
  }
} 

module.exports = {
  PassThrough
}
