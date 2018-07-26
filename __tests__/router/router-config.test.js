
/**
 * https://vue-test-utils.vuejs.org/zh/guides/#配合-vue-router-使用
 * 
 * 在测试中，你应该杜绝在基本的 Vue 构造函数中安装 Vue Router。安装 Vue Router 之后 Vue * 的原型上会增加 $route 和 $router 这两个只读属性。
 * 为了避免这样的事情发生，我们创建了一个 localVue 并对其安装 Vue Router
 */

import { createLocalVue } from '@vue/test-utils'
import Router from 'vue-router'

import routerConfig from '@/router/router-config.js'
import Login from '@/views/Login.vue'
import Preset from '@/views/Preset.vue'
import Group from '@/views/Group.vue'
import Chat from '@/views/Chat.vue'

describe('router-config.js', () => {
  const localVue = createLocalVue()
  localVue.use(Router)
  let router = null

  beforeEach(() => {
    router = new Router(routerConfig)
  })

  test('Login', () => {
    expect.assertions(1)

    router.push('/login')
    const matchedComponent = router.getMatchedComponents()[0]
    
    expect(matchedComponent).toBe(Login)
  })

  test('Preset', () => {
    expect.assertions(1)

    router.push('/preset')
    const matchedComponent = router.getMatchedComponents()[0]

    expect(matchedComponent).toBe(Preset)
  })

  test('Group', () => {
    expect.assertions(1)

    router.push('/group')
    const matchedComponent = router.getMatchedComponents()[0]

    expect(matchedComponent).toBe(Group)
  })

  test('Chat', () => {
    expect.assertions(1)

    router.push('/chat')
    const matchedComponent = router.getMatchedComponents()[0]

    expect(matchedComponent).toBe(Chat)
  })
})
