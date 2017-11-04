
'use strict'

// import * as api from '@/api'
import { SET_USER } from './mutation-types.js'

export default {
  setUser ({ commit }, user) {
    commit(SET_USER, user)
  }
}
