
'use strict'

import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations.js'
import actions from './actions.js'
import plugins from './plugins.js'
import { DEFAULT_USER, DEFAULT_FORM } from '@/util'

Vue.use(Vuex)

export const USER_KEY = 'user' // Local Storage Key

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    user: DEFAULT_USER,
    form: JSON.parse(window.localStorage.form || DEFAULT_FORM)
    // oss: JSON.parse(window.localStorage.oss || 'false')
  },
  mutations,
  actions,
  plugins
})

export default store
