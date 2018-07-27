
jest.mock('electron')
import { shell } from 'electron'

import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import Github from '@/views/Github.vue'

describe('views/Github.vue', () => {
  const localVue = createLocalVue()
  localVue.use(Vuex)

  const createStore = state => {
    return new Vuex.Store({ state })
  }

  const store = createStore({
    github: {
      tag_name: 'v0.1.3',
      body: '- [x] F 修复 好友大于1000不全 v0.1.3 - [x] U 优化 发送多图 v0.1.3 - [x] N 新增 好友分页 v0.1.3 - [x] N 新增 是否显示头像选项 v0.1.3 - [x] N 新增 备注用户名及搜索 v0.1.3 百度网盘：https://pan.baidu.com/s/1i4QFrzn',
      html_url: 'https://baidu.com'
    }
  })

  test('init page', () => {
    expect.assertions(1)

    const wrapper = shallowMount(Github, {
      store,
      localVue
    })

    expect(wrapper.vm.msgArr).toEqual([
      ' F 修复 好友大于1000不全 ',
      ' U 优化 发送多图 ',
      ' N 新增 好友分页 ',
      ' N 新增 是否显示头像选项 ',
      ' N 新增 备注用户名及搜索 '
    ])
  })

  test('gotoDownloadPage', () => {
    expect.assertions(1)
    
    const wrapper = shallowMount(Github, {
      store,
      localVue
    })

    wrapper.find('#downloadPage').trigger('click')
    expect(shell.openExternal).toHaveBeenCalled()
  })
})
