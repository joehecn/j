
'use strict'

import RPN from 'request-promise-native'
import { URL } from 'url'
import { parseString } from 'xml2js'
import store from '@/store'

const rpn = RPN.defaults({jar: true})

let _UUID = ''
let _QS = {
  fun: 'new',
  version: 'v2'
}
let _BASE_REQUEST = {
  Uin: '',
  Sid: '',
  Skey: ''
}

let _PASS_TICKET = ''

// 随机字符串产生函数
const _getDeviceID = () => {
  return 'e' + ('' + Math.random().toFixed(15)).substring(2, 17)
}

const _login = async tip => {
  const res = await rpn({
    url: 'https://login.wx2.qq.com/cgi-bin/mmwebwx-bin/login',
    qs: {
      loginicon: true,
      uuid: _UUID,
      tip,
      _: Date.now()
    }
  })

  const arr = res.match(/window.code=(\d+);/)
  let arr2 = ['', '']
  if (arr[1] === '201') {
    const _arr2 = res.match(/window.userAvatar = '(\S+?)'/)
    if (_arr2 && _arr2[1]) {
      arr2[1] = _arr2[1]
    }
  } else if (arr[1] === '200') {
    // https://wx2.qq.com/cgi-bin/mmwebwx-bin/webwxnewloginpage?ticket=A5NxojSqIYebRO9KlhP-eWQj@qrticket_0&uuid=YeJMR3UH8A==&lang=zh_CN&scan=1509030538
    const _arr2 = res.match(/window.redirect_uri="(\S+?)"/)
    if (_arr2 && _arr2[1]) {
      const u = new URL(_arr2[1])
      _QS.ticket = u.searchParams.get('ticket')
      _QS.uuid = u.searchParams.get('uuid')
      _QS.lang = u.searchParams.get('lang')
      _QS.scan = u.searchParams.get('scan')
      arr2[1] = _arr2[1]
    }
  }

  return [ arr[1], arr2[1] ]
}

const _parseString = str => {
  return new Promise((resolve, reject) => {
    parseString(str, {
      explicitArray: false
    }, (err, result) => {
      if (err) {
        reject(err)
      }

      if (result) {
        resolve(result.error)
      }
    })
  })
}

const getFormateSyncCheckKey = () => {
  const list = store.state.synckey.List || []
  const len = list.length
  let a = []
  for (let i = 0; i < len; i++) {
    a.push(list[i].Key + '_' + list[i].Val)
  }

  return a.join('|')
}

const _synccheck = async () => {
  const res = await rpn({
    url: 'https://webpush.wx2.qq.com/cgi-bin/mmwebwx-bin/synccheck',
    qs: {
      r: Date.now(),
      skey: _BASE_REQUEST.Skey,
      sid: _BASE_REQUEST.Sid,
      uin: _BASE_REQUEST.Uin,
      deviceid: _getDeviceID(),
      synckey: getFormateSyncCheckKey(),
      _: Date.now()
    }
  })

  const arr = res.match(/window.synccheck={retcode:"(\d+)",selector:"(\d+)"}/)

  return [arr[1], arr[2]]
}

export const getuuid = async quick => {
  if (quick) {
    return _UUID
  }

  const res = await rpn({
    url: 'https://login.wx2.qq.com/jslogin',
    qs: {
      appid: 'wx782c26e4c19acffb',
      fun: 'new',
      lang: 'zh_CN',
      _: Date.now()
    }
  })

  const arr = res.match(/window.QRLogin.code = (\d+); window.QRLogin.uuid = "(\S+?)"/)
  if (arr[1] === '200' && arr[2]) {
    _UUID = arr[2]
    return _UUID
  } else {
    throw new Error()
  }
}

export const login = async tip => {
  let res = await _login(tip)
  while (res[0] === '408') {
    await _login(0)
    // console.log(res, new Date())
  }

  return res
}

// ticket:A5NxojSqIYebRO9KlhP-eWQj@qrticket_0
// uuid:YeJMR3UH8A==
// lang:zh_CN
// scan:1509030538
// fun:new
// version:v2
export const webwxnewloginpage = async () => {
  const res = await rpn({
    url: 'https://wx2.qq.com/cgi-bin/mmwebwx-bin/webwxnewloginpage',
    qs: _QS
  })

  // <error>
  //   <ret>0</ret>
  //   <message></message>
  //   <skey>@crypt_47714410_b6e022dc6ddcc0187883acf43aba17ba</skey>
  //   <wxsid>6uDNwSp9CkmiBQ+x</wxsid>
  //   <wxuin>1486186303</wxuin>
  //   <pass_ticket>7CrirezmR/dRDn+siVb3hCyJoN+6Y8pXyAjysy/RbKD+aAoDgbyLVvZ4bV760pvJ</pass_ticket>
  //   <isgrayscale>1</isgrayscale>
  // </error>

  const obj = await _parseString(res)

  if (obj.skey) {
    _BASE_REQUEST.Uin = obj.wxuin
    _BASE_REQUEST.Sid = obj.wxsid
    _BASE_REQUEST.Skey = obj.skey
    _PASS_TICKET = obj.pass_ticket
  } else {
    throw new Error()
  }
}

export const webwxinit = async () => {
  _BASE_REQUEST.DeviceID = _getDeviceID()
  const res = await rpn({
    url: 'https://wx2.qq.com/cgi-bin/mmwebwx-bin/webwxinit',
    method: 'POST',
    qs: {
      r: ~new Date(),
      lang: _QS.lang,
      pass_ticket: _PASS_TICKET
    },
    json: true,
    body: {
      BaseRequest: _BASE_REQUEST
    }
  })

  if (res.User && res.User.Uin) {
    return res
  }

  throw new Error()
}

export const synccheck = async () => {
  let res = await _synccheck()

  while (res[0] === '0' && res[1] === '0') {
    await _synccheck()
    // console.log(res, new Date())
  }

  return res
}

export const webwxsync = async () => {
  _BASE_REQUEST.DeviceID = _getDeviceID()
  const res = await rpn({
    url: 'https://wx2.qq.com/cgi-bin/mmwebwx-bin/webwxsync',
    method: 'POST',
    qs: {
      sid: _BASE_REQUEST.Sid,
      skey: _BASE_REQUEST.Skey,
      lang: _QS.lang
    },
    json: true,
    body: {
      BaseRequest: _BASE_REQUEST,
      SyncKey: store.state.synckey,
      rr: ~new Date()
    }
  })

  return res
}

export const webwxstatusnotify = async () => {
  _BASE_REQUEST.DeviceID = _getDeviceID()
  const res = await rpn({
    url: 'https://wx2.qq.com/cgi-bin/mmwebwx-bin/webwxstatusnotify',
    method: 'POST',
    qs: {
      lang: _QS.lang,
      pass_ticket: _PASS_TICKET
    },
    json: true,
    body: {
      BaseRequest: _BASE_REQUEST,
      ClientMsgId: Date.now(),
      Code: 3,
      FromUserName: store.state.user.UserName,
      ToUserName: store.state.user.UserName
    }
  })

  return res
}

export const webwxgetcontact = async () => {
  const res = await rpn({
    url: 'https://wx2.qq.com/cgi-bin/mmwebwx-bin/webwxgetcontact',
    qs: {
      lang: _QS.lang,
      pass_ticket: _PASS_TICKET,
      r: Date.now(),
      seq: 0,
      skey: _BASE_REQUEST.Skey
    },
    json: true
  })

  return res
}

export const coverBase64 = url => {
  return new Promise(resolve => {
    let Writable = require('stream').Writable
    let ws = Writable()
    let chunks = []
    let size = 0
    let type = 'image/jpeg'

    ws._write = (chunk, end, next) => {
      size += chunk.length
      chunks.push(chunk)
      next()
    }

    ws.on('finish', () => {
      let buf = Buffer.concat(chunks, size)
      let base = buf.toString('base64')
      let data = ''
      if (base) {
        data = `data:${type};base64,${base}`
      }
      resolve(data)
    })

    rpn(`https://wx2.qq.com${url}`).on('response', response => {
      type = response.headers['content-type'] // 'image/png'
    }).pipe(ws)
  })
}
