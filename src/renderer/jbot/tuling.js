
import rpn from 'request-promise-native'

export const sendmsg = async (key, info, userid) => {
  const res = await rpn({
    url: 'http://www.tuling123.com/openapi/api',
    method: 'POST',
    json: true,
    body: {
      key,
      info,
      userid
    }
  })

  // console.log(res)

  if (res && res.code) {
    switch (res.code) {
      case 100000:
        return res.text
      case 200000:
        return `${res.text} ${res.url}`
      case 302000:
        if (res.list && res.list.length > 0) {
          return `${res.list[0].article} ${res.list[0].detailurl}`
        } else {
          return res.text
        }
      case 308000:
        if (res.list && res.list.length > 0) {
          return `${res.list[0].name} ${res.list[0].detailurl}`
        } else {
          return res.text
        }
    }
  }

  throw new Error('100010') // '发送消息失败'
}
