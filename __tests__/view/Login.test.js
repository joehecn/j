
import { Loading } from 'element-ui'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import Login from '@/views/Login.vue'

describe('views/Login.vue', () => {
  const localVue = createLocalVue()
  localVue.use(Vuex)
  localVue.use(Loading.directive)

  const createStore = state => {
    return new Vuex.Store({ state })
  }

  const $$worker = {
    postMessage: jest.fn()
  }

  test('init page', () => {
    expect.assertions(2)

    const store = createStore({
      loginImg: '',
      code408: 0,
      code201: false
    })
    const wrapper = shallowMount(Login, {
      mocks: { $$worker },
      store,
      localVue
    })

    expect(wrapper.text()).toContain('使用手机微信扫码登录')
    expect($$worker.postMessage)
      .toHaveBeenCalledWith({ key: 'start' })
  })

  test('code201 = true', () => {
    expect.assertions(3)

    const store = createStore({
      loginImg: 'data:img/jpg;base64,/9j/4A',
      code408: 4,
      code201: true
    })
    const wrapper = shallowMount(Login, {
      mocks: { $$worker }, store, localVue
    })

    expect(wrapper.html()).toContain('扫描成功')
    expect(wrapper.html()).toContain('data:img/jpg;base64')
    expect(wrapper.html()).toContain('>&gt;&gt;&gt;&gt;<')
  })
})


// 'data:img/jpg;base64,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'