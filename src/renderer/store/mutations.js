
'use strict'

import { SET_USER } from './mutation-types.js'

export default {
  [SET_USER] (state, user) {
    state.user = user
  }
}
