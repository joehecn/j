
'use strict'

// import * as api from '@/api'
import { SET_USER, SET_KEY } from './mutation-types.js'

export default {
  setUser ({ commit }, user) {
    commit(SET_USER, user)
  },

  setKey ({ commit }, key) {
    commit(SET_KEY, key)
  }
}
