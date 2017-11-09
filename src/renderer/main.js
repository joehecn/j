import Vue from 'vue'

import './style/iconfont.css'

import {
  Button,
  Input,
  Checkbox,
  Tabs,
  TabPane,
  // Upload,
  MessageBox,
  Notification
} from 'element-ui'

import App from './App'
import router from './router'
import store from './store'
import { version } from '../../package.json'
import { getReleases } from './jbot/github.js'
import { shell } from 'electron'
// import os from 'os'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

Vue.use(Button)
Vue.use(Input)
Vue.use(Checkbox)
Vue.use(Tabs)
Vue.use(TabPane)
// Vue.use(Upload)

Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$notify = Notification

// title
// document.title = `${document.title} ${process.env.npm_package_version}`
document.title = `${document.title} ${version}`

/* eslint-disable */
Window.prototype.joehe_global_js_method = (url) => {
  shell.openExternal(url)
}
/* eslint-enable */

// 检查版本
getReleases().then(res => {
  if (res.tag_name !== version) {
    Notification({
      title: `已发布新版本 ${res.tag_name}`,
      dangerouslyUseHTMLString: true,
      message: `<a style="text-decoration: none;" href="javascript:void(0);" onclick="joehe_global_js_method('${res.html_url}')">请点击这里查看详情和下载</a>`,
      duration: 0
    })
  }
}).catch(() => {
  // console.log('getReleases error')
  // console.log(err)
})

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
