import Vue from 'vue'
import {
  Button,
  Input,
  Checkbox,
  Tabs,
  TabPane,
  MessageBox,
  Notification
} from 'element-ui'

import App from './App'
import router from './router'
import store from './store'
import { version } from '../../package.json'
// import os from 'os'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

Vue.use(Button)
Vue.use(Input)
Vue.use(Checkbox)
Vue.use(Tabs)
Vue.use(TabPane)

Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$notify = Notification

// title
// document.title = `${document.title} ${process.env.npm_package_version}`
document.title = `${document.title} ${version}`

// os
// console.log('操作系统内核: ', os.type())
// console.log('操作系统平台: ', os.platform())

// console.log(process.env)

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
