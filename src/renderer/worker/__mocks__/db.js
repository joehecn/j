

import { createErr, makeMethod } from '../fun.js'

let delCount = 0

const methods = {
  getMsg () {
    return {
      tos: []
    }
  },
  setMsg () {},

  getGroupList () {
    return []
  },

  setGroup () {},

  getGroup () {
    return 'haha'
  },

  delGroup () {
    if (delCount++ === 1) {
      throw new Error()
    }
  }
}

export default makeMethod(methods, createErr)
