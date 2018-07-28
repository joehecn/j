
import { Alert, Button } from 'element-ui'
import { shallowMount, mount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import Preset from '@/views/Preset.vue'

describe('views/Preset.vue', () => {
  const localVue = createLocalVue()
  localVue.use(Vuex)
  localVue.component(Alert.name, Alert)
  localVue.component(Button.name, Button)

  const createStore = state => {
    return new Vuex.Store({ state })
  }

  const $router = {
    push: jest.fn()
  }

  test('init page', () => {
    expect.assertions(1)
    
    const store = createStore({
      prelist: [],
      showNextBtn: false,
      repeatNameList: []
    })
    const wrapper = shallowMount(Preset, {
      store,
      localVue
    })

    expect(wrapper.html()).not.toContain('elbutton-stub')
  })

  test('showNextBtn', () => {
    expect.assertions(1)

    const store = createStore({
      prelist: [],
      showNextBtn: true,
      repeatNameList: []
    })
    const wrapper = shallowMount(Preset, {
      store,
      localVue
    })

    expect(wrapper.html()).toContain('elbutton-stub')
  })

  test('click btn', () => {
    expect.assertions(1)

    const store = createStore({
      prelist: [],
      showNextBtn: true,
      repeatNameList: []
    })
    const wrapper = mount(Preset, {
      mocks: { $router },
      store,
      localVue
    })

    wrapper.find('button').trigger('click')

    expect($router.push)
      .toHaveBeenCalledWith('group')
  })
})
