
const msgList = []

module.exports = {
  storeToMsgList(msgItem) {
    msgList.push(msgItem)
    this.notify('msgListLength', msgList.length)
  }
}
