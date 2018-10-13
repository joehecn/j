
import { Loading } from 'element-ui'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import Login from '@/views/Login.vue'

describe.skip('views/Login.vue', () => {
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
