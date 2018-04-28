<template>
  <div id="home" class="fb fb-column" v-show="showPage">
    <div class="head ft-none fb fb-justify-around fb-align-center">
      <el-checkbox v-model="robot" :disabled="robotDisabled">自动回复</el-checkbox>
      <el-checkbox v-model="showImg">显示头像</el-checkbox>
      <el-checkbox v-model="oss" :disabled="ossDisabled">同步分组</el-checkbox>
      <el-button type="text" @click="showDialog">参数配置</el-button>
      <el-button type="text" @click="downloadMemberlist" :disabled="downloading" :loading="downloading">导出好友列表</el-button>
      <div>
        <i class="hm-icon iconfont icon-hartfull"
          :class="jumping ? 'hm-icon-life' : ''"></i>
      </div>
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
                    <hm-img :url="item.HeadImgUrl" :show="showImg"></hm-img>
                  </div>
                  <div>
                    <div class="item-content" v-html="item.NickName"></div>
                    <div>{{item.RemarkName}}</div>
                  </div>
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane name="second">
              <div slot="label">
                <span>选择好友</span>
                <span v-show="activeName === 'second'">
                  ({{memberlist.length}})
                  <input v-model="searchText">
                  <i class="el-icon-search"></i>
                </span>
              </div>
              <div>
                <div class="fb fb-wrap">
                  <div 
                    class="friend-item ft-none fb fb-align-center"
                    :class="item.checked ? 'checked' : ''"
                    v-for="(item, index) in second" :key="index"
                    @click="changeChecked(item)">
                    <div class="img-wrap">
                      <hm-img :url="item.HeadImgUrl" :show="showImg"></hm-img>
                    </div>
                    <div>
                      <div class="item-content" v-html="item.NickName"></div>
                      <div>{{item.RemarkName}}</div>
                    </div>
                  </div>
                </div>
                
                <el-pagination v-show="searchText === ''"
                  layout="prev, pager, next"
                  :page-size="100"
                  :total="memberlist.length"
                  :current-page.sync="currentPage2">
                </el-pagination>
              </div>
            </el-tab-pane>

            <el-tab-pane name="third">
              <div slot="label">
                <span>选择聊天群</span>
                <span v-show="activeName === 'third'">({{third.length}})</span>
              </div>
              <div class="fb fb-wrap">
                <div class="friend-item ft-none fb fb-align-center"
                  :class="item.checked ? 'checked' : ''"
                  v-for="(item, index) in third" :key="index"
                  @click="changeChecked(item)">
                  <div class="img-wrap">
                    <hm-img :url="item.HeadImgUrl" :show="showImg"></hm-img>
                  </div>
                  <div>
                    <div class="item-content" v-html="item.NickName"></div>
                    <div>{{item.RemarkName}}</div>
                  </div>
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

    <el-dialog
      title="配置参数"
      :visible.sync="dialogVisible">
      
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" size="mini">
        <p>
          自动回复 -- 图灵机器人自动应答<br>
          <small>图灵api: www.tuling123.com</small>
        </p>
        <el-form-item label="图灵key" prop="tulingkey" label-width="80px">
          <el-input v-model="ruleForm.tulingkey" auto-complete="off"></el-input>
        </el-form-item>
        <hr>
        <p>
          同步分组 -- 在不同设备间同步分组设置<br>
          <small>阿里云oss: www.aliyun.com</small>
        </p>
        <el-form-item label="region" label-width="80px">
          <el-input v-model="ruleForm.region" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="keyId" label-width="80px">
          <el-input v-model="ruleForm.accessKeyId" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="keySecret" label-width="80px">
          <el-input v-model="ruleForm.accessKeySecret" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="bucket" label-width="80px">
          <el-input v-model="ruleForm.bucket" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
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
    const validateTulingkey = (rule, value, callback) => {
      if (value !== '' && !/^[a-z0-9]{32}$/.test(value)) {
        callback(new Error('key 格式不正确'))
      } else {
        callback()
      }
    }

    return {
      jumping: true, // 心跳
      dialogVisible: false,
      ruleForm: {
        tulingkey: '',
        region: '',
        accessKeyId: '',
        accessKeySecret: '',
        bucket: ''
      },
      rules: {
        tulingkey: [
          { validator: validateTulingkey, trigger: 'blur' }
        ]
      },
      robot: false, // 自动回复
      oss: false, // 分组同步
      showImg: false,
      memberlist: [],
      currentPage2: 1,
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
      searchText: '', // 搜索框
      message: '',
      sending: false,
      imgsending: false,
      showPage: false,
      downloading: false
    }
  },

  computed: {
    robotDisabled () {
      const d = !this.$store.state.form.tulingkey
      if (d) {
        this.robot = false
      }
      return d
    },

    ossDisabled () {
      const d = !this.$store.state.form.region ||
        !this.$store.state.form.accessKeyId ||
        !this.$store.state.form.accessKeySecret ||
        !this.$store.state.form.bucket
      if (d) {
        this.oss = false
        // this.$store.dispatch('setOss', false)
      }
      return d
    },

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
      const _memberlist = this.memberlist.map(item => {
        return {
          HeadImgUrl: item.HeadImgUrl,
          NickName: item.NickName,
          RemarkName: item.RemarkName,
          md5: item.md5,
          checked: _md5[item.md5] || false
        }
      }).filter(item => {
        if (this.searchText === '') {
          return item
        } else {
          const _seach = this.searchText.toUpperCase()
          return (item.NickName.toUpperCase().indexOf(_seach) !== -1) ||
            (item.RemarkName.toUpperCase().indexOf(_seach) !== -1)
        }
      })

      if (this.searchText === '') {
        return _memberlist.slice((this.currentPage2 - 1) * 100, this.currentPage2 * 100)
      } else {
        return _memberlist
      }
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
          RemarkName: item.RemarkName,
          md5: item.md5,
          checked: _md5[item.md5] || false
        }
      })
    }
  },

  watch: {
    // robot (val) {
    //   // 如果为 true, 检测 tuling key
    //   // 如果没有 key, 打开 输入key对话框
    //   if (val && !this.$store.state.tulingkey) {
    //     this.openInputKey()
    //   }
    // }

    oss (val) {
      if (val) {
        // console.log(' -------------- watch oss true ------------ ')
        if (this.$store.state.user.Uin && this.$store.state.user.Uin !== 'hemiao') {
          // 说明准备好了
          jbot.joss.getFile(this.$store.state.user.Uin).then(res => {
            this.groups = JSON.parse(res.content.toString())
          }).catch(err => {
            console.log(err)
          })
        }
      }

      window.localStorage.oss = val
    },

    showImg (val) {
      window.localStorage.showImg = val
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
    jbot.on('on_error', err => {
      console.log(err)
    }).on('on_reluser', user => {
      this.$store.dispatch('setUser', user)
      // 从阿里云oss服务器获取配置文件
      if (this.oss) {
        jbot.joss.getFile(user.Uin).then(res => {
          this.groups = JSON.parse(res.content.toString())
        }).catch(err => {
          console.log(err)
          this.groups = JSON.parse(window.localStorage[user.Uin] || '[]')
        })
      } else {
        this.groups = JSON.parse(window.localStorage[user.Uin] || '[]')
      }
    }).on('on_memberlist', memberlist => {
      const _memberlist = memberlist.filter(item => {
        return item.AttrStatus > 0 && item.UserName[0] === '@'
      }).map(item => {
        item.md5 = SparkMD5.hash(`${item.AttrStatus}${item.NickName}`)
        return item
      })

      this.memberlist = this.memberlist.concat(_memberlist)
      this.showPage = true
    }).on('on_msg', msg => {
      // 自动回复 && 群聊不回复
      if (this.robot && msg.FromUserName.substring(1, 2) !== '@') {
        jbot.robotsendmsg(msg)
      }
    }).on('on_batchlist', batchlist => {
      // console.log(batchlist)
      const _batchlist = batchlist.filter(item => {
        return item.NickName
      }).map(item => {
        // item.md5 = MD5(item.NickName)
        // console.log(item.md5)
        item.md5 = SparkMD5.hash(item.NickName)
        return item
      })

      this.batchlist = this.batchlist.concat(_batchlist)
      // console.log(this.batchlist)
    }).on('on_sendimged', obj => {
      // console.log(obj)
      if (obj.status === '0') {
        this.$notify.success({
          title: '成功',
          dangerouslyUseHTMLString: true,
          message: `给 ${obj.NickName} 发送图片${obj.j + 1}成功`
        })
      } else {
        this.$notify.error({
          title: '失败',
          dangerouslyUseHTMLString: true,
          message: `给 ${obj.NickName} 发送图片${obj.j + 1}失败`
        })
      }
    })

    ipcRenderer.on('downloaded', (event, state) => {
      // console.log('Home downloaded')
      this.downloading = false
      if (state === 'completed') {
        this.$notify.success({
          title: '成功',
          message: '导出好友成功'
        })
      } else if (state !== 'cancelled') {
        this.$notify.error({
          title: '失败',
          message: '导出好友失败'
        })
      }
    })

    this.oss = JSON.parse(window.localStorage.oss || 'false')
    this.showImg = JSON.parse(window.localStorage.showImg || 'false')

    // this.showPage = true
    // 守护进程
    jbot.daemon().then(ctx => {
      const message = ctx.status === '101101' ? '有其他设备登录web微信，您已下线' : '守护进程已死'
      this.jumping = false
      this.$notify.error({
        title: '请重新登录系统',
        message,
        duration: 0
      })
    })
  },

  methods: {
    showDialog () {
      this.ruleForm = JSON.parse(JSON.stringify(this.$store.state.form))
      this.dialogVisible = true
    },

    submitForm () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$store.dispatch('setForm', this.ruleForm)
          this.dialogVisible = false
        }
      })
    },

    // openInputKey () {
    //   this.$prompt('提示: 如果没有key, 请到 www.tuling123.com 注册一个', '请输入图灵 key', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     inputPattern: /^[a-z0-9]{32}$/,
    //     inputErrorMessage: 'key 格式不正确'
    //   }).then(({ value }) => {
    //     this.$store.dispatch('setKey', value)
    //   }).catch(() => {
    //     this.robot = false
    //   })
    // },

    // removeKey () {
    //   this.$store.dispatch('setKey', '')
    //   this.robot = false
    //   this.$notify.success({
    //     title: '成功',
    //     message: '删除图灵key成功'
    //   })
    // },

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
          if (err) {
            console.log(err)
          }

          if (data) {
            const blob = new Blob([data], {type: 'text/plain;charset=utf-8'})
            saveAs(blob, `contact-${formatTime()}.csv`)
          }
        })
      }
    },

    setGroups () {
      const str = JSON.stringify(this.groups)
      window.localStorage[this.$store.state.user.Uin] = str
      this.oss && jbot.joss.setFile(this.$store.state.user.Uin, str).catch()
    },

    addGroup () {
      // console.log(this.newgroupname)
      const _name = this.newgroupname.trim()
      if (_name !== '') {
        this.groups.push({
          name: _name,
          md5: {}
        })

        this.setGroups()
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

        this.setGroups()
      }).catch(() => {})
    },

    changeChecked (item) {
      // console.log(item)
      let _item = this.groups[this.selected]
      _item.md5[item.md5] = !item.checked
      this.$set(this.groups, this.selected, _item)

      this.setGroups()

      // this.searchText = '' 不自动清空，连选比较有效率
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

    sendImages (fileArr) {
      this.imgsending = true
      jbot.sendimgs(this.first, fileArr).then(() => {
        this.imgsending = false
      }).catch(() => {
        this.imgsending = false
      })
    },

    getBuf (file) {
      return new Promise(resolve => {
        // FileMd5
        const reader = new FileReader()
        reader.onload = event => {
          const result = event.target.result
          const spark = new SparkMD5.ArrayBuffer()
          spark.append(event.target.result)
          const FileMd5 = spark.end()

          let buf = Buffer.from(result)

          resolve({ file, FileMd5, buf })
        }
        reader.readAsArrayBuffer(file)
      })
    },

    filechange (files) {
      let fileArr = []
      let len = files.length
      for (let i = 0; i < len; i++) {
        this.getBuf(files[i]).then(res => {
          fileArr.push(res)

          if (fileArr.length === len) {
            this.sendImages(fileArr)
          }
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

.hm-icon {
  position: absolute;
  margin-top: -14px;
  font-size: 22px;
  color: #ddd;
}

.hm-icon-life {
  color: red;
  animation:jump 1.5s infinite linear;
}

@keyframes jump {
  0% {
    font-size: 20px;
  }

  50% {
    font-size: 24px;
  }

  100% {
    font-size: 20px;
  }
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
