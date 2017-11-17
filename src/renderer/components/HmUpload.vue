<template>
  <div class="hm-upload ft-none fb fb-align-center">
    <el-button class="msg-btn" type="text" @click="sendImage" :disabled="imgsending" :loading="imgsending">发送图片</el-button>
    <input type="file" accept="image/png, image/jpeg" ref="input" name="pic" multiple @change="fileChange">
  </div>
</template>

<script>

// import MD5 from 'md5'
// import SparkMD5 from 'spark-md5'

export default {
  name: 'hm-upload',

  props: ['imgsending', 'first'],

  methods: {
    sendImage () {
      const len = this.first.length

      if (len > 0) {
        this.$refs.input.value = null
        this.$refs.input.click()
      }
    },

    fileChange (e) {
      let len = e.target.files.length
      if (len > 0) {
        for (let i = 0; i < len; i++) {
          const file = e.target.files[i]
          // size
          if (file.size > 1048576) { // 限制 1MB
            this.$notify.error({
              title: '失败',
              message: '拍脑袋! 限制图片不能大于 1MB'
            })
            return
          }

          // image/jpeg image/png
          const type = file.type
          if (type !== 'image/jpeg' && type !== 'image/png') {
            this.$notify.error({
              title: '失败',
              message: `现在只写了发送图片的逻辑，有需求找 - Joe`
            })
            return
          }
        }
        this.$emit('filechange', e.target.files)
      }
    }
  }
}
</script>

<style scoped>
.msg-btn {
  margin: 0 8px;
}

input {
  display: none;
}
</style>
