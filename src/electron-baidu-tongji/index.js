
const request = require('superagent')

/**
 * first step
 * @param {*} ipcMain 
 */
const ebtMain = ipcMain => {
  if (ipcMain.on) {
    // step 2
    ipcMain.on('electron-baidu-tongji-message', (event, arg) => {
      // electron 生产模式下是直接请求文件系统，没有 http 地址
      // 前台拿不到 hm.js 的内容
      // 所以通过 node 模块 superagent 请求
      request
        .get(`https://hm.baidu.com/hm.js?${arg}`)
        .set('Referer', 'https://hm.baidu.com/')
        .buffer(true)
        .then(res => {
          if (res.text && res.text.indexOf('function') > -1) {
            // step 3
            event.sender.send('electron-baidu-tongji-reply', res.text)
          }
        })
    })
  }
}

/**
 * second step
 * @param {*} ipcRenderer 
 * @param {*} siteId 
 * @param {*} router 
 */
const ebtRenderer = (ipcRenderer, siteId, router) => {
  if (!siteId && typeof siteId !== 'string') {
    throw new TypeError(`siteId must be a right's string`)
  }

  if (ipcRenderer.on && ipcRenderer.send) {
    // step 4
    ipcRenderer.on('electron-baidu-tongji-reply', (_, arg) => {
      let hm = document.createElement("script")
      hm.text = arg

      let head = document.getElementsByTagName('head')[0]
      head.appendChild(hm)

      // Vue单页应用时，监听router的每次变化
      // 把虚拟的url地址赋给百度统计的API接口

      /* istanbul ignore else */
      if (router && router.beforeEach) {
        router.beforeEach((to, _, next) => {
          /* istanbul ignore else */
          if (to.path) {
            window._hmt.push(['_trackPageview', '/#' + to.fullPath])
          }

          next()
        })
      }
    })
    // step 1
    ipcRenderer.send('electron-baidu-tongji-message', siteId)
  }
}

module.exports = { ebtMain, ebtRenderer }
