
import { coverBase64 } from './wbwx.js'

let imgs = {}

export const getImg = async url => {
  if (imgs[url]) {
    // console.log('get img from 内存')
    return imgs[url]
  }
  // console.log('get img from 微信')
  const res = await coverBase64(url)
  if (res) {
    imgs[url] = res
  }

  return res
}
