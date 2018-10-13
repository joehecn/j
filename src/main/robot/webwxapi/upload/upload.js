
const { getPayload, getEndData } = require('./requestPayload.js')
const request = require('./request.js')

const pre = '----WebKitFormBoundary'
const bothEnds = '--'

/**
 * 
 * @param {*} url
 * https://file.wx2.qq.com/cgi-bin/mmwebwx-bin/webwxuploadmedia?f=json
 */
const getOption = url => {
  const u = new URL(url)

  return {
    hostname: u.hostname,
    port: 443,
    // path 应包括查询字符串（如有的话）
    path: `${u.pathname}${u.search}`,
    method: 'POST'
  }
}

/**
 * ----WebKitFormBoundarycpRyN1SIuBsnjbfM
 * pre + random
 * '----WebKitFormBoundary' + 'cpRyN1SIuBsnjbfM'
 */
const getRandomBoundary = pre => {
  let chars = [ pre ]

  const arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c',
    'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r',
    's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G',
    'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V',
    'W', 'X', 'Y', 'Z']

  // 随机产生
  for (let i = 0; i < 16; i++) {
    const pos = Math.round(Math.random() * (arr.length - 1))
    chars.push(arr[pos])
  }

  return chars.join('')
}

const getContentType = boundary => {
  return `multipart/form-data; boundary=${boundary}`
}

const getContentLength = (payload, endData, buf) => {
  return Buffer.byteLength(payload) +
    Buffer.byteLength(endData) +
    buf.length
}

module.exports = async (url, fields, buf) => {
  const option = getOption(url)
  const boundary = getRandomBoundary(pre)
  const payload = getPayload(bothEnds, boundary, fields)
  const endData = getEndData(bothEnds, boundary)
  const headers = [
    { name: 'Content-Type', value: getContentType(boundary) },
    { name: 'Content-Length', value: getContentLength(payload, endData, buf) }
  ]

  const res = await request(option, headers, payload, buf, endData)
  return res
}
