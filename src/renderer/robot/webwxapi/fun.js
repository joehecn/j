
const { URL } = require('url')

const xml2js = require('xml2js')
const SparkMD5 = require('spark-md5')

const createErr = require('../createErr.js')

// `WU_FILE_${wuFile++}`
let wuFile = 0

const getUserAvatar = str => {
  const arr = str && str.match(/'(\S+?)';/)
  const userAvatar = arr && arr[1]
  return userAvatar ||
    'https://res.wx.qq.com/a/wx_fed/webwx/res/static/img/2KriyDK.png'
}

const getHostAndQuery = str => {
  const arr = str.match(/window.redirect_uri="(\S+?)";/)
  const u = new URL(arr[1])
  const host = u.host
  const query = {
    ticket: u.searchParams.get('ticket'),
    uuid: u.searchParams.get('uuid'),
    lang: u.searchParams.get('lang'),
    scan: u.searchParams.get('scan'),
    fun: 'new',
    version: 'v2'
  }
  return { host, query }
}

const getWebwxDataTicket = cookies => {
  let webwxDataTicket = ''

  for (let i = 0, len = cookies.length; i < len; i++) {
    const cookie = cookies[i]
    const arr = cookie.match(/^webwx_data_ticket=(\S+?);/)
    if (arr) {
      webwxDataTicket = arr[1]
      break
    }
  }

  return webwxDataTicket
}

// webwxuploadmedia
const getFileMd5 = buf => {
  const spark = new SparkMD5.ArrayBuffer()
  spark.append(buf)
  return spark.end()
}
const getWuFile = () => {
  return `WU_FILE_${wuFile++}`
}

const getUploadmediarequest = (BaseRequest, file, Msg, buf) => {
  return {
    UploadType: 2,
    BaseRequest,
    ClientMediaId: file.lastModified,
    TotalLen: file.size,
    StartPos: 0,
    DataLen: file.size,
    MediaType: 4,
    FromUserName: Msg.FromUserName,
    ToUserName: Msg.ToUserName,
    FileMd5: getFileMd5(buf)
  }
}

module.exports = {
  getUUID (str) {
    const arr = str &&
      str.match(/"(\S+?)";$/)
    const uuid = arr && arr[1]
  
    if (uuid) {
      return uuid
    }
  
    throw createErr(900, '获取 uuid 失败')
  },

  getHostAndLoginCode (str) {
    const arr = str && str.match(/window.code=(\d+?);/)
    const code = arr && arr[1]

    if (!code) {
      throw createErr(901, '获取 codes 失败')
    }

    if (code === '201') {
      const userAvatar = getUserAvatar(str)
      return { loginCode: { code, userAvatar } }
    }

    /* istanbul ignore else */
    if (code === '200') {
      const { host, query } = getHostAndQuery(str)
      return { host, loginCode: { code, query } }
    }

    return { loginCode: { code } }
  },

  getWebwxDataTicketFromCookies (cookies) {
    if (cookies && cookies.length) {
      // let webwxDataTicket = ''

      // for (let i = 0, len = cookies.length; i < len; i++) {
      //   const cookie = cookies[i]
      //   const arr = cookie.match(/^webwx_data_ticket=(\S+?);/)
      //   if (arr) {
      //     webwxDataTicket = arr[1]
      //     break
      //   }
      // }
      const webwxDataTicket = getWebwxDataTicket(cookies)

      /* istanbul ignore else */
      if (webwxDataTicket) {
        return webwxDataTicket
      }
    }

    throw createErr(902, '获取 webwxDataTicket 失败')
  },

  getBaseRequest (str) {
    return new Promise((resolve, reject) => {
      xml2js.parseString(str, {
        explicitArray: false
      }, (err, result) => {
        if (result && result.error && result.error.wxuin) {
          const { wxuin, wxsid, skey, pass_ticket } = result.error

          return resolve({
            BaseRequest: {
              Uin: wxuin,
              Sid: wxsid,
              Skey: skey
            },
            passTicket: pass_ticket
          })
        }
  
        if (err) {
          err.status = 903
          return reject(err)
        }
  
        reject(createErr(904, '获取 BaseRequest 失败'))
      })
    })
  },

  /**
   * 随机字符串产生函数
   */
  getDeviceID () {
    return 'e' + ('' + Math.random().toFixed(15)).substring(2, 17)
  },

  getFormateSyncCheckKey (list) {
    let a = []
    for (let i = 0, len = list.length; i < len; i++) {
      a.push(list[i].Key + '_' + list[i].Val)
    }
  
    return a.join('|')
  },

  getSynccheckResNum (str) {
    const arr =
      str.match(/window.synccheck={retcode:"(\d+)",selector:"(\d+)"}/)
    
    /* istanbul ignore else */
    if (arr) {
      switch (arr[1]) {
        case '0':
          return arr[2]
        case '1100':
          throw createErr(803, '登出微信')
        case '1101':
          throw createErr(804, '其他设备登录web微信')
        case '1102':
          throw createErr(805, '暂时不知道')
      }
    }

    throw createErr(806, '监听心跳失败')
  },

  // webwxuploadmedia
  // getFileMd5 (buf) {
  //   const spark = new SparkMD5.ArrayBuffer()
  //   spark.append(buf)
  //   return spark.end()
  // },
  // getWuFile () {
  //   return `WU_FILE_${wuFile++}`
  // }
  getFields ({ BaseRequest, webwxDataTicket, file, buf, Msg }) {
    const uploadmediarequest =
      getUploadmediarequest(BaseRequest, file, Msg, buf)
    
    return [{
      name: 'id',
      value: getWuFile()
    }, {
      name: 'name',
      value: file.name
    }, {
      name: 'type',
      value: file.type
    }, {
      name: 'lastModifiedDate',
      value: file.lastModifiedDate.toGMTString()
    }, {
      name: 'size',
      value: file.size
    }, {
      name: 'mediatype',
      value: 'pic'
    }, {
      name: 'uploadmediarequest',
      value: JSON.stringify(uploadmediarequest)
    }, {
      name: 'webwx_data_ticket',
      value: webwxDataTicket
    }, {
      name: 'pass_ticket',
      value: 'undefined'
    }, {
      name: 'filename',
      filename: file.name,
      type: file.type
    }]
  }
}
