

import { createErr, makeMethod } from '../fun.js'

let delCount = 0

const methods = {
  getItem ({ storeName }) {
    if (storeName === 'group') {
      return 'haha'
    }
    return { tos: [] }
  },
  setItem () {},

  getGroupList () {
    return []
  },

  delGroup () {
    if (delCount++ === 1) {
      throw new Error()
    }
  }
}

export default makeMethod(methods, createErr)
