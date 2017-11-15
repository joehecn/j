
'use strict'

import { SET_USER, SET_FORM } from './mutation-types.js'

export default {
  setUser ({ commit }, user) {
    commit(SET_USER, user)
  },

  setForm ({ commit }, form) {
    commit(SET_FORM, form)
  }

  // setOss ({ commit }, oss) {
  //   commit(SET_OSS, oss)
  // }
}
