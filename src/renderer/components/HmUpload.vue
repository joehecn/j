<template>
  <div class="hm-upload ft-none fb fb-align-center">
    <el-button class="msg-btn" type="text" @click="sendImage" :disabled="imgsending" :loading="imgsending">发送图片</el-button>
    <input type="file" accept="image/png, image/jpeg" ref="input" name="pic" @change="fileChange">
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
      if (e.target.files[0]) {
        // const file = e.target.files[0]
        // console.log(file)
        // const reader = new FileReader()
        // reader.onload = event => {
        //   // console.log(MD5(event.target.result))
        //   const spark = new SparkMD5.ArrayBuffer()
        //   spark.append(event.target.result)
        //   console.log(spark.end())
        // }
        // reader.readAsArrayBuffer(file)

        this.$emit('filechange', e.target.files[0])
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
