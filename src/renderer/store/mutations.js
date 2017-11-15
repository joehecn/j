
'use strict'

import { SET_USER, SET_FORM } from './mutation-types.js'

export default {
  [SET_USER] (state, user) {
    state.user = user
  },

  [SET_FORM] (state, form) {
    state.form = form
  }

  // [SET_OSS] (state, oss) {
  //   state.oss = oss
  // }
}
