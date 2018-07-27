
module.exports = input => {
  const texts = [{
    text: 'window.QRLogin.code = 200; window.QRLogin.uuid = "Qd8I3H7i_w==";'
  }]
  texts.push(input)

  function query () {
    let item = texts[0]
    if (item.hasSend) { return this }

    item = texts.shift()
    return Promise.resolve(item)
  }

  function send () {
    let item = texts.shift()
    if (item.throwErr) {
      throw new Error()
    }
    return Promise.resolve(item)
  }

  return () => {
    return {
      get () { return this },
      post () { return this },
      retry () { return this },
      query,
      send
    }
  }
}
