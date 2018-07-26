
module.exports = function mockAgent(input) {
  const texts = [{
    text: 'window.QRLogin.code = 200; window.QRLogin.uuid = "Qd8I3H7i_w==";'
  }]
  texts.push(input)
  return function () {
    return {
      get () {
        return this
      },
      post () {
        return this
      },
      retry () {
        return this
      },
      // redirects() {
      //   return this
      // },
      query () {
        let item = texts[0]
        if (item.hasSend) {
          return this
        }

        item = texts.shift()
        // if (item.throwErr) {
        //   throw new Error()
        // }

        return Promise.resolve(item)
      },
      send () {
        let item = texts.shift()
        if (item.throwErr) {
          throw new Error()
        }

        return Promise.resolve(item)
      }
    }
  }
}
