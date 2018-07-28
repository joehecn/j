
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

Vue.use(Vuex)
Vue.use(Router)

const store = new Vuex.Store(storeConfig)
const router = new Router(routerConfig)

// sync(store, router)

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

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
