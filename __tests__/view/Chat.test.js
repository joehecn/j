
import {
  Button,
  Input,
  Option,
  Select,
  TabPane,
  Tabs,
} from 'element-ui'
import { shallowMount, mount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import { cloneDeep } from 'lodash'
import storeConfig from '@/store/store-config.js'
import Chat from '@/views/Chat.vue'

describe('views/Chat.vue', () => {
  const localVue = createLocalVue()
  localVue.use(Vuex)
  localVue.component(Button.name, Button)
  localVue.component(Input.name, Input)
  localVue.component(Option.name, Option)
  localVue.component(Select.name, Select)
  localVue.component(TabPane.name, TabPane)
  localVue.component(Tabs.name, Tabs)

  const createStore = cloneStoreConfig => {
    return new Vuex.Store(cloneStoreConfig)
  }

  const $$worker = {
    postMessage: jest.fn()
  }
  const $router = {
    go: jest.fn()
  }

  test('init page', () => {
    expect.assertions(3)

    const store = createStore({
      state: { curGroupMd5: 'md5' }
    })
    const wrapper = shallowMount(Chat, {
      mocks: { $$worker },
      store,
      localVue
    })

    expect(wrapper.vm.curGroupMd5).toBe('md5')
    expect(wrapper.html()).toContain('send-message-stub')
    expect($$worker.postMessage)
      .toHaveBeenCalledWith({ key: 'getGroup', value: { md5: 'md5' } })
  })

  test('selected tabs at tabItem2', () => {
    expect.assertions(1)

    const store = createStore({
      state: { curGroupMd5: 'md5' }
    })
    const wrapper = shallowMount(Chat, {
      mocks: { $$worker },
      store,
      localVue
    })

    wrapper.vm.activeName = 'M'

    expect(wrapper.html()).not.toContain('send-message-stub')
  })

  test('backToGroup', () => {
    expect.assertions(1)

    const cloneStoreConfig = cloneDeep(storeConfig)
    cloneStoreConfig.state.curGroupMd5 = 'md5'
    const store = createStore(cloneStoreConfig)
    const wrapper = mount(Chat, {
      mocks: { $$worker, $router },
      store,
      localVue
    })

    wrapper.find('#back-page').trigger('click')
    expect($router.go)
      .toHaveBeenCalledWith(-1)
  })
})