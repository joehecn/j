
'use strict'

import { SET_USER, SET_KEY } from './mutation-types.js'

export default {
  [SET_USER] (state, user) {
    state.user = user
  },

  [SET_KEY] (state, key) {
    state.tulingkey = key
  }
}
