<template>
  <div id="github">
    <p>老版本停用!</p>
    <h1>发现新版本{{ this.github && this.github.tag_name }}</h1>
    <ul>
      <li v-for="(item, index) in msgArr" :key="index">
        {{ item }}
      </li>
    </ul>
    <p id="downloadPage" @click="gotoDownloadPage">下载页面 >></p>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { shell } from 'electron'

export default {
  computed: {
    ...mapState({
      github: state => state.github
    }),
    // - [x] F 修复 好友大于1000不全 v0.1.3 - [x] U 优化 发送多图 v0.1.3 - [x] N 新增 好友分页 v0.1.3 - [x] N 新增 是否显示头像选项 v0.1.3 - [x] N 新增 备注用户名及搜索 v0.1.3 百度网盘：https://pan.baidu.com/s/1i4QFrzn
    msgArr () {
      let _msgArr = []
      if (this.github && this.github.body) {
        const arr = this.github.body.split('[x]')

        for (let i = 1, len = arr.length; i < len; i++) {
          _msgArr.push(`${arr[i].split(this.github.tag_name)[0]}`)
        }
      }

      return _msgArr
    }
  },
  methods: {
    gotoDownloadPage () {
      shell.openExternal(this.github.html_url)
    }
  }
}
</script>


<style scoped>
#github {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-size: cover;
}

#downloadPage {
  cursor: pointer;
  text-decoration: underline;
  color: blue;
}
</style>
