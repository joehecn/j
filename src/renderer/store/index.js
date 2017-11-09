
'use strict'

import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations.js'
import actions from './actions.js'
import plugins from './plugins.js'
import { DEFAULT_USER } from '@/util'

Vue.use(Vuex)

export const USER_KEY = 'user' // Local Storage Key

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    tulingkey: window.localStorage.tulingkey || '',
    user: DEFAULT_USER
  },
  mutations,
  actions,
  plugins
})

export default store
