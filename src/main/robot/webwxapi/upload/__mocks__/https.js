
const Emitter = require('events')

const res = new class Res extends Emitter {}()

const req = new class Req extends Emitter {
  setHeader () {}
  write () {}
  end (enddata) {
    if (enddata[8] === 'F') {
      this.emit('error', new Error('fail'))
    } else {
      res.emit('data', 'success')
    }    
  }
}()

module.exports = {
  request (options, cb) {
    cb(res)
    return req
  }
}
