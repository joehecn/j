import {
  Input,
  Option,
  Select
} from 'element-ui'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import { cloneDeep } from 'lodash'
import storeConfig from '@/store/store-config.js'
import ChatList from '@/components/ChatList.vue'

describe('components/ChatList.vue', () => {
  const localVue = createLocalVue()
  localVue.use(Vuex)
  localVue.component(Input.name, Input)
  localVue.component(Option.name, Option)
  localVue.component(Select.name, Select)

  const createStore = cloneStoreConfig => {
    return new Vuex.Store(cloneStoreConfig)
  }
  const $$worker = {
    postMessage: jest.fn()
  }

  test('init page', () => {
    expect.assertions(3)

    const cloneStoreConfig = cloneDeep(storeConfig)
    cloneStoreConfig.state.curGroupMd5 = 'md5'
    cloneStoreConfig.state.listM = [{
      premd5: 'premd', status: 1, category: 'M',
      NickName: 'joe', RemarkName: 'he'
    }]
    const store = createStore(cloneStoreConfig)
    const wrapper = shallowMount(ChatList, {
      mocks: { $$worker },
      propsData: {
        category: 'M'
      },
      store,
      localVue
    })

    expect(wrapper.vm.curGroupMd5).toBe('md5')
    expect(wrapper.vm.category).toBe('M')
    expect(wrapper.html()).toContain('<small>he</small>')
  })

  test('selectItem', () => {
    expect.assertions(1)

    const cloneStoreConfig = cloneDeep(storeConfig)
    cloneStoreConfig.state.curGroupMd5 = 'md5'
    cloneStoreConfig.state.listM = [{
      premd5: 'premd', status: 1, category: 'M',
      NickName: 'joe', RemarkName: 'he'
    }]
    const store = createStore(cloneStoreConfig)
    const wrapper = shallowMount(ChatList, {
      mocks: { $$worker },
      propsData: {
        category: 'M'
      },
      store,
      localVue
    })

    wrapper.find('#item-wrap .item').trigger('click')
    expect($$worker.postMessage)
      .toHaveBeenCalledWith({
        key: 'changeStatus',
        value: {
          category: 'M',
          item: {
            NickName: 'joe',
            RemarkName: 'he',
            category: 'M',
            premd5: 'premd',
            status: 1
          },
          md5: 'md5'
        }
      })
  })
})