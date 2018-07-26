
import { Button, Input } from 'element-ui'
import sparkMD5 from 'spark-md5'
import { shallowMount, mount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import { cloneDeep } from 'lodash'
import storeConfig from '@/store/store-config.js'
import Group from '@/views/Group.vue'

describe('views/Group.vue', () => {
  const localVue = createLocalVue()
  localVue.use(Vuex)
  localVue.component(Button.name, Button)
  localVue.component(Input.name, Input)

  const createStore = cloneStoreConfig => {
    return new Vuex.Store(cloneStoreConfig)
  }
  const $$worker = {
    postMessage: jest.fn()
  }
  const $router = {
    push: jest.fn(),
    go: jest.fn()
  }
  const $notify = {
    warning: jest.fn()
  }

  test('init page', () => {
    expect.assertions(3)

    const store = createStore(cloneDeep(storeConfig))
    const wrapper = shallowMount(Group, {
      mocks: { $$worker },
      store,
      localVue
    })

    expect(wrapper.html()).not.toContain('group-item')
    expect($$worker.postMessage)
      .toHaveBeenCalledWith({ key: 'getGroupList' })

    store.commit('setGroupList', { groupList: [{
      md5: '123',
      groupName: 'cs'
    }]})
    expect(wrapper.html()).toContain('group-item')
  })

  test('addGroup 组名不能为空', () => {
    expect.assertions(1)

    const store = createStore(cloneDeep(storeConfig))
    const wrapper = mount(Group, {
      mocks: { $$worker, $notify },
      store,
      localVue
    })

    wrapper.find('#new-group-warp button').trigger('click')
    expect($notify.warning)
      .toHaveBeenCalledWith({
        message: '组名不能为空',
        position: 'bottom-left',
        title: '警告'
      })
  })

  test('addGroup 组名不能重复', () => {
    expect.assertions(1)

    const store = createStore(cloneDeep(storeConfig))
    const wrapper = mount(Group, {
      mocks: { $$worker, $notify },
      store,
      localVue
    })

    const groupName = 'cs'
    const md5 = sparkMD5.hash(groupName)
    store.commit('setGroupList', { groupList: [
      { md5, groupName }
    ]})
    wrapper.vm.newGroupName = 'cs'
    wrapper.find('#new-group-warp button').trigger('click')
    expect($notify.warning)
      .toHaveBeenCalledWith({
        message: '组名不能重复',
        position: 'bottom-left',
        title: '警告'
      })
  })

  test('addGroup success', () => {
    expect.assertions(3)

    const store = createStore(cloneDeep(storeConfig))
    const wrapper = mount(Group, {
      mocks: { $$worker, $notify },
      store,
      localVue
    })

    const groupName = 'cs'
    const md5 = sparkMD5.hash(groupName)
    wrapper.vm.newGroupName = groupName
    wrapper.find('#new-group-warp button').trigger('click')

    const group = {
      key: 'addGroup',
      value: { md5, groupName }
    }
    expect($$worker.postMessage)
      .toHaveBeenCalledWith(group)

    store.commit('addGroup', { group })

    const items = wrapper.findAll('.group-item')
    expect(items.length).toBe(1)
    expect(wrapper.vm.newGroupName).toBe('')
  })

  test('groupSelect', () => {
    expect.assertions(2)

    const store = createStore(cloneDeep(storeConfig))
    const wrapper = shallowMount(Group, {
      mocks: { $$worker, $router },
      store,
      localVue
    })

    const groupName = 'cs'
    const md5 = sparkMD5.hash(groupName)
    store.commit('setGroupList', { groupList: [
      { md5, groupName }
    ]})

    wrapper.find('.group-item').trigger('click')
    expect(store.state.curGroupMd5).toBe(md5)
    expect($router.push)
      .toHaveBeenCalledWith('chat')
  })

  test('delGroup success', async () => {
    expect.assertions(2)

    const $confirm = jest.fn().mockResolvedValue()
    const store = createStore(cloneDeep(storeConfig))

    const wrapper = mount(Group, {
      mocks: { $$worker, $confirm },
      store,
      localVue
    })

    const groupName = 'cs'
    const md5 = sparkMD5.hash(groupName)
    store.commit('setGroupList', { groupList: [
      { md5, groupName }
    ]})

    wrapper.find('.group-item button').trigger('click')

    expect($confirm)
      .toHaveBeenCalledWith('确定删除该组?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
    
    await new Promise(resolve => setTimeout(resolve, 1))

    expect($$worker.postMessage)
      .toHaveBeenCalledWith({
        key: 'delGroup',
        value: { index: 0, md5}
      })
  })

  test('delGroup fail sould be catch', () => {
    expect.assertions(1)

    const $confirm = jest.fn().mockRejectedValue()
    const store = createStore(cloneDeep(storeConfig))
    const wrapper = mount(Group, {
      mocks: { $$worker, $confirm },
      store,
      localVue
    })

    const groupName = 'cs'
    const md5 = sparkMD5.hash(groupName)
    store.commit('setGroupList', { groupList: [
      { md5, groupName }
    ]})

    wrapper.find('.group-item button').trigger('click')

    expect($confirm)
      .toHaveBeenCalledWith('确定删除该组?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
  })

  test('backToPreset', () => {
    expect.assertions(1)

    const store = createStore(cloneDeep(storeConfig))
    const wrapper = mount(Group, {
      mocks: { $$worker, $router },
      store,
      localVue
    })

    wrapper.find('#back-page').trigger('click')
    expect($router.go)
      .toHaveBeenCalledWith(-1)
  })
})