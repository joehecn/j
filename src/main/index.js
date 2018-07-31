
import { app, BrowserWindow, Menu } from 'electron'
import * as path from 'path'
import { format as formatUrl } from 'url'

// 关闭警告
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true

// 保持窗口对象的全局引用，如果没有，则当JavaScript对象被垃圾回收时，窗口将自动关闭
let mainWindow = null

const isDevelopment = process.env.NODE_ENV !== 'production'

// Menu
const template = [{
  label: '编辑',
  submenu: [
    {role: 'undo', label: '撤销'},
    {role: 'redo', label: '重做'},
    {type: 'separator'},
    {role: 'cut', label: '剪切'},
    {role: 'copy', label: '复制'},
    {role: 'paste', label: '粘贴'},
    {role: 'delete', label: '删除'},
    {role: 'selectall', label: '全选'}
  ]
}]
const createMenu = () => {
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

// 开发模式
const makeDevelopmentMode = win => {
  win.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
  win.setBounds({
    x: 0,
    y: 0,
    width: 800,
    height: 600
  })
  win.webContents.openDevTools()
}

// 生产模式
const makeProductMode = win => {
  win.loadURL(formatUrl({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file',
    slashes: true
  }))
  win.setResizable(false) // 禁止用户改变窗口大小
}

const createMainWindow = () => {
  // Menu
  createMenu()

  // 创建浏览器窗口
  const win = new BrowserWindow({
    width: 400,
    height: 600,
    webPreferences: {
      nodeIntegrationInWorker: true // 在WebWorkers中使用多线程Node.js
    }
  })

  // 当 window 被关闭，这个事件会被触发。
  win.on('closed', () => {
    // 取消引用 window 对象，如果你的应用支持多窗口的话，
    // 通常会把多个 window 对象存放在一个数组里面，
    // 与此同时，你应该删除相应的元素。
    mainWindow = null
  })

  // 开发模式
  if (isDevelopment) {
    makeDevelopmentMode(win)
    return win
  }

  // 生产模式
  makeProductMode(win)
  return win
}

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // 在macOS上，当单击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (mainWindow === null) {
    mainWindow = createMainWindow()
  }
})

// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', () => {
  mainWindow = createMainWindow()
})

// 在这个文件中，你可以续写应用剩下主进程代码。
// 也可以拆分成几个文件，然后用 require 导入。
