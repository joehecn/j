'use strict'

import { app, Menu, BrowserWindow } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  console.log('main createWindow')
  /**
   * Menu
   */
  const template = [
    {
      submenu: [
        {role: 'quit', label: '退出小J'}
      ]
    },
    {
      label: '编辑',
      submenu: [
        {role: 'undo', label: '撤销'},
        {role: 'redo', label: '重做'},
        {type: 'separator'},
        {role: 'cut', label: '剪切'},
        {role: 'copy', label: '复制'},
        {role: 'paste', label: '粘贴'},
        {role: 'pasteandmatchstyle', label: '粘贴并匹配样式'},
        {role: 'delete', label: '删除'},
        {role: 'selectall', label: '全选'}
      ]
    }
  ]

  // 注册菜单
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))

  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    console.log('main closed')
    mainWindow = null
  })

  mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
    console.log('main will-download')
    // item.on('updated', (event, state) => {
    //   if (state === 'interrupted') {
    //     console.log('Download is interrupted but can be resumed')
    //   } else if (state === 'progressing') {
    //     if (item.isPaused()) {
    //       console.log('Download is paused')
    //     } else {
    //       console.log(`Received bytes: ${item.getReceivedBytes()}`)
    //     }
    //   }
    // })
    item.once('done', (event, state) => {
      console.log('main done')
      // if (state === 'completed') {
      //   console.log('Download successfully')
      // } else {
      //   console.log(`Download failed: ${state}`)
      // }

      mainWindow.webContents.send('downloaded', state)
    })
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  console.log('main window-all-closed')
  // 不注释掉 MacOS 会重复注册 will-download 事件
  // 不知道怎么 注销 will-download 事件
  // if (process.platform !== 'darwin') {
  app.quit()
  // }
})

app.on('activate', () => {
  if (mainWindow === null) {
    console.log('on activate createWindow()')
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
