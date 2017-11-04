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

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
// Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(Button)
Vue.use(Input)
Vue.use(Checkbox)
Vue.use(Tabs)
Vue.use(TabPane)

Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$notify = Notification

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
