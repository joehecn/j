
'use strict'

import { SET_FORM } from './mutation-types.js'

const localStoragePlugin = store => {
  store.subscribe((mutation, state) => {
    if (mutation.type === SET_FORM) {
      window.localStorage.form = JSON.stringify(state.form)
    }

    // else if (mutation.type === SET_OSS) {
    //   window.localStorage.oss = JSON.stringify(state.oss)
    // }
  })
}

export default [localStoragePlugin]
