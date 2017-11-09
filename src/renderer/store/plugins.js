
'use strict'

import { SET_KEY } from './mutation-types.js'

const localStoragePlugin = store => {
  store.subscribe((mutation, state) => {
    if (mutation.type === SET_KEY) {
      console.log(state)
      window.localStorage.tulingkey = state.tulingkey
    }
  })
}

export default [localStoragePlugin]
