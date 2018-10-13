
import './style.css'

import {
  Alert,
  Button,
  Input,
  Option,
  Select,
  TabPane,
  Tabs,
  Loading,
  MessageBox,
  Notification
} from 'element-ui'
import Vue from 'vue'
import Vuex from 'vuex'
import Router from 'vue-router'
import storeConfig from './store/store-config.js'
import routerConfig from './router/router-config.js'
import worker from './worker/worker.js'
import App from './App.vue'
import { version } from '../../package.json'
import github from './github.js'

import { ipcRenderer } from 'electron'
import { ebtRenderer } from 'electron-baidu-tongji'

// 这里可以替换为你自己的 百度统计 siteId
const BAIDU_SITE_ID = 'e0a564dfc08b6db584e25108f652fcd1'

Vue.use(Vuex)
Vue.use(Router)

const store = new Vuex.Store(storeConfig)
const router = new Router(routerConfig)

worker.store = store
worker.router = router

/**
 * element-ui component
 */
Vue.component(Alert.name, Alert)
Vue.component(Button.name, Button)
Vue.component(Input.name, Input)
Vue.component(Option.name, Option)
Vue.component(Select.name, Select)
Vue.component(TabPane.name, TabPane)
Vue.component(Tabs.name, Tabs)
Vue.use(Loading.directive)
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$notify = Notification

Vue.prototype.$$worker = worker

 /**
  * 关闭生产模式下给出的提示
  */
Vue.config.productionTip = false

/**
 * TODO: 检查版本
 */
document.title = `微信机器人${version} - by Joe`
github().then(res => {
  store.commit('setGithub', { github: res })
  if (res.tag_name !== version) {
    router.replace('github')
  } else {
    router.replace('login')
  }
})

// 百度统计
ebtRenderer(ipcRenderer, BAIDU_SITE_ID, router)

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
