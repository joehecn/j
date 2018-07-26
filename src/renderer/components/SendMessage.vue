
<template>
  <div id="send-message">
    <el-input
      type="textarea"
      :rows="10"
      placeholder="输入文本消息"
      v-model="textMessage">
    </el-input>

    <div id="buttons">
      <el-button
        id="send-text-btn"
        type="primary"
        @click="sendTextMsgs">发送文本消息</el-button>

      <el-button
        id="send-img-btn"
        type="primary"
        plain
        @click="sendImgMsgs">发送图片消息</el-button>
    </div>

    <input
      id="sendImgInput"
      ref="imgFiles"
      @change="previewFiles"
      type="file"
      accept="image/png, image/jpeg"
      multiple>
  
    <div v-if="leftMsgCount">待发送消息: {{leftMsgCount}}</div>
  </div>
</template>

<script>

import { mapState, mapGetters } from 'vuex'

// 如果 file.size > splitSize
// 必须分割 buf
// 分片大小 512 * 1024 (512KB)
const splitSize = 524288

export default {
  data () {
    return {
      textMessage: '',
      imagefile: null
    }
  },
  computed: {
    ...mapState({
      leftMsgCount: state => state.leftMsgCount,
      sending: state => state.sending,
      toNickName: state => state.toNickName,
      msgType: state => state.msgType
    }),
    ...mapGetters(['getList'])
  },
  watch: {
    sending (value) {
      let notifyType = 'error'
      let title = '发送失败'
      let message = ''

      const msgTypeStr = this.msgType === 1 ? '文本' : '图片' 
      if (value === 2) { // info sending...
        notifyType = 'info'
        title = '发送消息'
        message = `给 ${this.toNickName} 发送 ${msgTypeStr} 消息中...`
      } else if (value === 1) { // success
        notifyType = 'success'
        title = '发送成功'
        message = `给 ${this.toNickName} 发送 ${msgTypeStr} 消息成功`
      } else {
        message = `给 ${this.toNickName} 发送 ${msgTypeStr} 消息失败`
      }
      
      this.$notify[notifyType]({
        position: 'bottom-left',
        title,
        message
      })
    }
  },
  methods: {
    getTos (tos, category) {
      this.getList({
        category,
        keyword: '',
        status: 1
      }).forEach(item => {
        tos[item.premd5] = 0
      })

      return tos
    },

    getAllTos() {
      const tosM = this.getTos({}, 'M')
      const tos = this.getTos(tosM, 'B')

      return tos
    },

    sendTextMsgs () {
      const Content = this.textMessage.trim()
      if (!Content) {
        this.$notify.warning({
          position: 'bottom-left',
          title: '警告',
          message: '不能发送空消息'
        })
        return
      }

      // tos: { premd5: failCount }
      const tos = this.getAllTos()
      const len = Object.keys(tos).length
      if (!len) {
        this.$notify.warning({
          position: 'bottom-left',
          title: '警告',
          message: '请先选择要发送给哪些人或群'
        })
        return
      }

      this.textMessage = ''

      // value: { Type, Content, tos: { premd5: failCount } }
      this.$$worker.postMessage({
        key: 'sendmsg',
        value: {
          Type: 1,
          Content,
          tos
        }
      })
    },

    sendImgMsgs () {
      // tos: { premd5: failCount }
      const tos = this.getAllTos()
      const len = Object.keys(tos).length
      /* istanbul ignore else */
      if (!len) {
        this.$notify.warning({
          position: 'bottom-left',
          title: '警告',
          message: '请先选择要发送给哪些人或群'
        })
        return
      }

      this.$refs.imgFiles.value = ''
      this.$refs.imgFiles.click()
    },

    // sendImgInput change
    previewFiles () {
      let files = this.$refs.imgFiles.files

      // check files
      for (let i = 0, len = files.length; i < len; i++) {
        const file = files[i]

        if (file.size > splitSize ) { //1048576 * 20) { // 限制 20MB
          this.$notify.warning({
            position: 'bottom-left',
            title: '警告',
            message: '限制图片不能大于 512KB'
          })
          return
        }

        // image/jpeg image/png
        const type = file.type
        if (type !== 'image/jpeg' && type !== 'image/png') {
          this.$notify.warning({
            position: 'bottom-left',
            title: '警告',
            message: '现在只写了发送 jpeg、png 图片的逻辑'
          })
          return
        }
      }

      const tos = this.getAllTos()
      for (let i = 0, len = files.length; i < len; i++) {
        // value: { Type, file, tos: { premd5: failCount } }
        this.$$worker.postMessage({
          key: 'sendmsg',
          value: {
            Type: 3,
            file: files[i],
            tos
          }
        })
      }
    }
  }
}
</script>

<style scoped>
#buttons {
  margin-top: 8px;
}

#sendImgInput {
  display: none;
}
</style>
