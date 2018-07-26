
/**
 * https://vue-test-utils.vuejs.org/zh/guides/#配合-vuex-使用
 */

import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import { cloneDeep } from 'lodash'
import storeConfig from '@/store/store-config.js'

const localVue = createLocalVue()
localVue.use(Vuex)

test('store/store-config.js', async () => {
  expect.assertions(2)

  const store = new Vuex.Store(cloneDeep(storeConfig))

  store.dispatch('setFalseClearNewGroupNameInput')
  expect(store.state.clearNewGroupNameInput).toBeFalsy()

  const md5 = 'md5'
  store.dispatch('setCurGroupMd5', { md5 })
  expect(store.state.curGroupMd5).toBe(md5)
})
