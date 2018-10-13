
import { ipcMain } from 'electron'
import Robot from './robot'

let robot = null

const methods = {
  async start(_, event) {
    robot = new Robot()

    robot.on('robot-reply', res => {
      event.sender.send('robot-reply', res)
    })
    // .on('getUUID', res => {
    //   event.sender.send('robot-reply', res)
    // })
    // .on('getCode201', res => {
    //   event.sender.send('robot-reply', res)
    // }).on('getCode408', res => {
    //   event.sender.send('robot-reply', res)
    // }).on('getLoginStatusSuccessed', res => {
    //   event.sender.send('robot-reply', res)
    // }).on('getUser', res => {
    //   event.sender.send('robot-reply', res)
    // }).on('getMemberlist', res => {
    //   event.sender.send('robot-reply', res)
    // }).on('getMemberlistEnded', res => {
    //   event.sender.send('robot-reply', res)
    // }).on('batchlist', res => {
    //   event.sender.send('robot-reply', res)
    // }).on('startSendmsg', res => {
    //   event.sender.send('robot-reply', res)
    // }).on('sendmsgBack', res => {
    //   event.sender.send('robot-reply', res)
    // }).on('onerror', res => {
    //   event.sender.send('robot-reply', res)
    // })

    await robot.start()
  },

  // value = { Type, (Content || file), tos: { premd5: failCount } }
  async sendmsg (value) {
    robot.sendmsg(value)
  }
}

export default () => {
  ipcMain.on('robot-message', (event, arg) => {
    methods[arg.key] && methods[arg.key](arg.value, event)
  })
}
