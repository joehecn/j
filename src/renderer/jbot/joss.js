
// const OSS = require('ali-oss').Wrapper
import store from '@/store'

let _client = null

const getClient = () => {
  const OSS = require('ali-oss').Wrapper
  if (_client) {
    return _client
  } else {
    _client = new OSS({
      region: store.state.form.region.trim(),
      accessKeyId: store.state.form.accessKeyId.trim(),
      accessKeySecret: store.state.form.accessKeySecret.trim(),
      bucket: store.state.form.bucket.trim()
    })
    return _client
  }
}

export const getFile = async filename => {
  // console.log(filename)
  // console.log(store)
  const client = getClient()
  const res = await client.get(`${filename}.json`)
  return res
}

export const setFile = async (filename, str) => {
  const client = getClient()
  const res = await client.put(`${filename}.json`, Buffer.from(str))
  return res
}
