<template>
  <div id="home" class="fb fb-column" v-show="showPage">
    <div class="head ft-none fb fb-justify-around fb-align-center">
      <el-checkbox v-model="robot">自动回复</el-checkbox>
      <el-button type="text" @click="downloadMemberlist">导出好友列表</el-button>
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
                <span class="groupnum">{{group.md5 | filterNum}}人</span>
              </div>
              <el-button type="text" @click.stop="removeGroup(index)">删除 -</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="ft-auto fb fb-column">
        <div class="tabs-warp ft-auto fb">
          <el-tabs v-model="activeName" @tab-click="searchText = ''">
            <el-tab-pane label="成员列表" name="first">
              <div class="fb fb-wrap">
                <div class="friend-item checked ft-none fb fb-align-center" v-for="(item, index) in first" :key="index">
                  <div>
                    <hm-img :url="item.HeadImgUrl"></hm-img>
                  </div>
                  <div class="item-content" v-html="item.NickName"></div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane name="second">
              <div slot="label">
                <span>管理成员</span>
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
                  <div>
                    <hm-img :url="item.HeadImgUrl"></hm-img>
                  </div>
                  <div class="item-content" v-html="item.NickName"></div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div v-show="activeName === 'first' && selected > -1" class="msg-wrap ft ft-none fb">
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

'use strict'

import jbot from '@/jbot'
import MD5 from 'md5'
import stringify from 'csv-stringify'
import { saveAs } from 'filesaver.js'
import { formatTime } from '@/util/fun.js'

import HmImg from '@/components/HmImg'

const Sex = {
  0: '',
  1: '男',
  2: '女'
}

// const cloneObj = obj => {
//   return JSON.parse(JSON.stringify(obj))
// }

export default {
  name: 'home',

  components: { HmImg },

  data () {
    return {
      robot: false,
      memberlist: [],
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
      showPage: false
    }
  },

  computed: {
    first () {
      if (this.selected === -1 || this.activeName === 'second') {
        return []
      }

      const _md5 = this.groups[this.selected].md5
      return this.memberlist.filter(item => {
        return _md5[item.md5] === true
      })
    },

    second () {
      if (this.selected === -1 || this.activeName === 'first') {
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
    //   item.md5 = md5(`${item.AttrStatus}${item.NickName}`)
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
        item.md5 = MD5(`${item.AttrStatus}${item.NickName}`)
        return item
      })

      this.showPage = true
    }).on('on_msg', msg => {
      console.log(msg)
      console.log(this.robot)
      // 自动回复 && 群聊不回复
      if (this.robot && msg.FromUserName.substring(1, 2) !== '@') {
        jbot.robotsendmsg(msg)
      }
    }).on('on_daemon', ctx => {
      console.log(ctx)
    })

    // 守护进程
    jbot.daemon()
  },

  methods: {
    downloadMemberlist () {
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
    },

    addGroup () {
      console.log(this.newgroupname)
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
      console.log(this.activeName)
      console.log('remove:', index)
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
      console.log(item)
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
                  this.sending = false
                }
              })
            }, 6000 * index)
          })
        }
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
  width: 200px;
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

.checked {
  border-color: #409EFF!important;
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
