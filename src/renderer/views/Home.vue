<template>
  <div id="home" class="fb fb-column" v-show="showPage">
    <div class="head ft-none fb fb-justify-around fb-align-center">
      <el-checkbox v-model="robot">自动回复</el-checkbox>
      <el-button type="text" @click="downloadMemberlist" :disabled="downloading" :loading="downloading">导出好友列表</el-button>
    </div>
    <div class="ft-auto fb">
      <div class="left ft-none fb fb-column">
        <div class="new-group ft-none fb fb-justify-between fb-align-center">
          <input class="new-group-input" v-model="newgroupname">
          <el-button type="text" @click="addGroup">添加 +</el-button>
        </div>
        <div class="groups ft-auto">
          <div v-for="(group, index) in groups" :key="index">
            <div class="group fb fb-justify-between fb-align-center"
              :class="index === selected ? 'selected' : ''"
              @click="selected = index">
              <div>
                <span class="groupname">{{group.name}}</span>
                <span class="groupnum">{{group.md5 | filterNum}}</span>
              </div>
              <el-button type="text" @click.stop="removeGroup(index)">删除 -</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="ft-auto fb fb-column">
        <div class="tabs-warp ft-auto fb">
          <el-tabs v-show="selected > -1" v-model="activeName" @tab-click="searchText = ''">
            <el-tab-pane label="组成员列表" name="first">
              <div class="fb fb-wrap">
                <div class="friend-item checked ft-none fb fb-align-center" v-for="(item, index) in first" :key="index">
                  <div class="img-wrap">
                    <hm-img :url="item.HeadImgUrl"></hm-img>
                  </div>
                  <div class="item-content" v-html="item.NickName"></div>
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane name="second">
              <div slot="label">
                <span>选择好友</span>
                <span v-show="activeName === 'second'">
                  <input v-model="searchText">
                  <i class="el-icon-search"></i>
                </span>
              </div>
              <div class="fb fb-wrap">
                <div 
                  class="friend-item ft-none fb fb-align-center"
                  :class="item.checked ? 'checked' : ''"
                  v-for="(item, index) in second" :key="index"
                  @click="changeChecked(item)">
                  <div class="img-wrap">
                    <hm-img :url="item.HeadImgUrl"></hm-img>
                  </div>
                  <div class="item-content" v-html="item.NickName"></div>
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane label="选择聊天群" name="third">
              <div class="fb fb-wrap">
                <div class="friend-item ft-none fb fb-align-center"
                  :class="item.checked ? 'checked' : ''"
                  v-for="(item, index) in third" :key="index"
                  @click="changeChecked(item)">
                  <div class="img-wrap">
                    <hm-img :url="item.HeadImgUrl"></hm-img>
                  </div>
                  <div class="item-content" v-html="item.NickName"></div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div v-show="activeName === 'first' && selected > -1" class="msg-wrap ft ft-none fb">
          <hm-upload
            :imgsending="imgsending"
            :first="first"
            @filechange="filechange"></hm-upload>

          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入消息"
            v-model="message">
          </el-input>
          <el-button class="msg-btn" type="text" @click="sendMessage" :disabled="sending" :loading="sending">发送消息</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import jbot from '@/jbot'
import SparkMD5 from 'spark-md5'
import stringify from 'csv-stringify'
import { saveAs } from 'filesaver.js'
import { formatTime } from '@/util/fun.js'

import HmImg from '@/components/HmImg'
import HmUpload from '@/components/HmUpload'

const Sex = {
  0: '',
  1: '男',
  2: '女'
}

export default {
  name: 'home',

  components: { HmImg, HmUpload },

  data () {
    return {
      robot: false,
      memberlist: [],
      batchlist: [],
      // [
      //   { name: 'fds', md5: {} },
      //   { name: 'dad', md5: {} },
      //   { name: '好多话', md5: {} }
      // ]
      groups: [],
      newgroupname: '',
      selected: -1,
      activeName: 'first',
      searchText: '',
      message: '',
      sending: false,
      imgsending: false,
      showPage: false,
      downloading: false
    }
  },

  computed: {
    first () {
      if (this.selected === -1 || this.activeName !== 'first') {
        return []
      }

      const _md5 = this.groups[this.selected].md5
      const members = this.memberlist.filter(item => {
        return _md5[item.md5] === true
      })
      const batchs = this.batchlist.filter(item => {
        return _md5[item.md5] === true
      })

      return members.concat(batchs)
    },

    second () {
      if (this.selected === -1 || this.activeName !== 'second') {
        return []
      }

      const _md5 = this.groups[this.selected].md5
      return this.memberlist.map(item => {
        return {
          HeadImgUrl: item.HeadImgUrl,
          NickName: item.NickName,
          md5: item.md5,
          checked: _md5[item.md5] || false
        }
      }).filter(item => {
        if (this.searchText === '') {
          return item
        } else {
          return item.NickName.toUpperCase().indexOf(this.searchText.toUpperCase()) !== -1
        }
      })
    },

    third () {
      if (this.selected === -1 || this.activeName !== 'third') {
        return []
      }

      const _md5 = this.groups[this.selected].md5

      return this.batchlist.map(item => {
        return {
          HeadImgUrl: item.HeadImgUrl,
          NickName: item.NickName,
          md5: item.md5,
          checked: _md5[item.md5] || false
        }
      })
    }
  },

  filters: {
    filterNum (md5) {
      let num = 0
      for (let key in md5) {
        if (md5.hasOwnProperty(key) && md5[key]) {
          num++
        }
      }
      return num
    }
  },

  mounted () {
    this.groups = JSON.parse(window.localStorage.groups || '[]')

    // this.memberlist = JSON.parse(window.localStorage.memberlist || '[]').map(item => {
    //   item.md5 = MD5(`${item.AttrStatus}${item.NickName}`)
    //   return item
    // })
    // this.showPage = true

    jbot.on('on_error', err => {
      console.log(err)
    }).on('on_reluser', user => {
      this.$store.dispatch('setUser', user)
    }).on('on_memberlist', memberlist => {
      this.memberlist = memberlist.filter(item => {
        return item.AttrStatus > 0 && item.UserName[0] === '@'
      }).map(item => {
        // item.md5 = MD5(`${item.AttrStatus}${item.NickName}`)
        // console.log(item.md5)
        item.md5 = SparkMD5.hash(`${item.AttrStatus}${item.NickName}`)
        return item
      })

      this.showPage = true
    }).on('on_msg', msg => {
      // console.log(msg)
      // console.log(this.robot)
      // 自动回复 && 群聊不回复
      if (this.robot && msg.FromUserName.substring(1, 2) !== '@') {
        jbot.robotsendmsg(msg)
      }
    }).on('on_batchlist', batchlist => {
      // console.log(batchlist)
      this.batchlist = batchlist.filter(item => {
        return item.NickName
      }).map(item => {
        // item.md5 = MD5(item.NickName)
        // console.log(item.md5)
        item.md5 = SparkMD5.hash(item.NickName)
        return item
      })
      // console.log(this.batchlist)
    })

    ipcRenderer.on('downloaded', (event, state) => {
      this.downloading = false
      if (state === 'completed') {
        this.$notify.success({
          title: '成功',
          message: '下载成功'
        })
      } else {
        this.$notify.error({
          title: '失败',
          message: '下载失败'
        })
      }
    })

    // 守护进程
    jbot.daemon()
  },

  methods: {
    downloadMemberlist () {
      if (this.memberlist.length > 0) {
        this.downloading = true

        const input = this.memberlist.map((item, index) => {
          return [
            index + 1,
            item.AttrStatus,
            item.NickName,
            Sex[item.Sex] || ''
          ]
        })

        stringify(input, { header: true, columns: [ 'SN', 'AttrStatus', 'NickName', 'Sex' ], eof: false }, (err, data) => {
          console.log(err)
          if (data) {
            const blob = new Blob([data], {type: 'text/plain;charset=utf-8'})
            saveAs(blob, `contact-${formatTime()}.csv`)
          }
        })
      }
    },

    addGroup () {
      // console.log(this.newgroupname)
      const _name = this.newgroupname.trim()
      if (_name !== '') {
        this.groups.push({
          name: _name,
          md5: {}
        })

        window.localStorage.groups = JSON.stringify(this.groups)
      }

      this.newgroupname = ''
    },

    removeGroup (index) {
      // console.log(this.activeName)
      // console.log('remove:', index)
      this.$confirm('此操作将永久删除该组, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.selected = -1

        this.groups.splice(index, 1)
        window.localStorage.groups = JSON.stringify(this.groups)
      }).catch(() => {})
    },

    changeChecked (item) {
      // console.log(item)
      let _item = this.groups[this.selected]
      _item.md5[item.md5] = !item.checked
      this.$set(this.groups, this.selected, _item)
      window.localStorage.groups = JSON.stringify(this.groups)
      this.searchText = ''
    },

    sendMessage () {
      const Content = this.message.trim()
      if (Content) {
        const len = this.first.length
        let count = 0

        if (len > 0) {
          this.sending = true
          this.first.forEach((item, index) => {
            setTimeout(() => {
              const ToUserName = item.UserName
              jbot.sendmsg({
                Content,
                ToUserName
              }).then(ctx => {
                if (ctx.status === '0') {
                  this.$notify.success({
                    title: '成功',
                    dangerouslyUseHTMLString: true,
                    message: `给 ${item.NickName} 发送消息成功`
                  })
                } else {
                  this.$notify.error({
                    title: '失败',
                    dangerouslyUseHTMLString: true,
                    message: `给 ${item.NickName} 发送消息失败`
                  })
                }

                count++
                if (count === len) {
                  this.message = ''
                  this.sending = false
                }
              })
            }, 6000 * index)
          })
        }
      }
    },

    sendImage (file, FileMd5, buf) {
      const len = this.first.length
      let count = 0

      this.imgsending = true
      this.first.forEach((item, index) => {
        setTimeout(() => {
          const ToUserName = item.UserName
          jbot.sendimg({
            file,
            FileMd5,
            buf,
            ToUserName
          }).then(ctx => {
            if (ctx.status === '0') {
              this.$notify.success({
                title: '成功',
                dangerouslyUseHTMLString: true,
                message: `给 ${item.NickName} 发送图片成功`
              })
            } else {
              this.$notify.error({
                title: '失败',
                dangerouslyUseHTMLString: true,
                message: `给 ${item.NickName} 发送图片失败`
              })
            }

            count++
            if (count === len) {
              this.imgsending = false
            }
          })
        }, 6000 * index)
      })
    },

    filechange (file) {
      // console.log('sendImage')
      // console.log(file)
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
      if (type === 'image/jpeg' || type === 'image/png') {
        // FileMd5
        const reader = new FileReader()
        reader.onload = event => {
          const result = event.target.result
          const spark = new SparkMD5.ArrayBuffer()
          spark.append(event.target.result)
          const FileMd5 = spark.end()

          let buf = Buffer.from(result)
          // var view = new Uint8Array(result)
          // for (let i = 0; i < buf.length; i++) {
          //   buf[i] = view[i]
          // }

          this.sendImage(file, FileMd5, buf)
        }
        reader.readAsArrayBuffer(file)
      } else {
        this.$notify.error({
          title: '失败',
          message: `现在只写了发送图片的逻辑，有需求找 - Joe`
        })
      }
    }
  }
}
</script>

<style scoped>
#home {
  height: 100%;
}

.head {
  background: #eaeaea;
  border-bottom: 1px solid #ddd;
}

.left {
  background: #eaeaea;
  border-right: 1px solid #ddd;
}

.new-group {
  padding: 0 10px;
  width: 240px;
  border-bottom: 1px solid #ddd;
}

.new-group-input {
  height: 24px;
  border: none;
}

.groups {
  overflow-y: auto;
}

.group {
  padding: 0 10px;
  border-bottom: 1px solid #ddd;
}

.groupname {
  display: inline-block;
  min-width: 100px;
}

.groupnum {
  color: #999;
}

.selected {
  background: #fff;
}

.tabs-warp {
  padding: 0 10px;
}

.friend-item {
  padding: 6px;
  margin: 6px;
  border: 1px solid #ddd;
}

.img-wrap {
  margin-right: 8px;
}

.checked {
  border-color: #409EFF!important;
  background: #409EFF;
  color: #fff;
}

.item-content {
  width: 150px;
}

.msg-wrap {
  /* border-top: 1px solid #409EFF; */
  background: #eaeaea;
}

.msg-btn {
  margin: 0 8px;
}
</style>
