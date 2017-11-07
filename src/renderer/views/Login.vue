<template>
  <div id="login" class="fb fb-column fb-align-center">
    <div class="ft-none img">
      <img :class="status === '201' ? 'opa' : ''" v-if="imageUrl" :src="imageUrl">
    </div>
    <div class="ft-none">
      <p>{{message[0]}}</p>
      <p>{{message[1]}}</p>
    </div>
    <div v-if="status === '201'" class="ft-auto">
      <el-button @click="changeStatus">切换帐号</el-button>
    </div>
  </div>
</template>

<script>
import jbot from '@/jbot'

export default {
  name: 'login',

  data () {
    return {
      uuid: '',
      status: ''
    }
  },

  computed: {
    imageUrl () {
      return this.uuid ? `https://login.weixin.qq.com/qrcode/${this.uuid}` : ''
    },

    message () {
      if (this.status === '201') {
        return ['扫描成功', '请在手机上点击确认以登录']
      }

      return ['使用手机微信扫码登录', '小J需要配合手机使用']
    }
  },

  mounted () {
    jbot.on('on_error', err => {
      console.log(err)
    }).on('on_scan', uuid => {
      this.uuid = uuid
      this.status = ''
    }).on('on_code_201', () => {
      this.status = '201'
    }).on('on_login', ctx => {
      this.status = ctx.codes[0]
      if (this.status === '200') {
        // 临时用户占位
        this.$store.dispatch('setUser', {
          Uin: 'hemiao'
        })
        this.$router.replace(this.$route.query.redirect || '/')
      }
    })

    jbot.login()
  },

  methods: {
    changeStatus () {
      jbot.login()
      this.status = ''
    }
  }
}
</script>

<style scoped>
.icon-refresh {
  position: absolute;
  z-index: 1;
  left: 50%;
  top: 50%;
  margin-left: -48px;
  margin-top: -48px;
  cursor: pointer;
  display: block;
  height: 96px;
  width: 96px;
  background-repeat: no-repeat;
  background-position: 0 -150px;
  background-size: 487px 462px;
}
.img {
  position: relative;
  width: 400px;
  height: 400px;
  overflow-y: hidden;
}

.rotateLoading {
  animation: rotateLoading ease 1s;
}

@keyframes rotateLoading {
  0% {
    -webkit-transform: rotate(0);
    transform: rotate(0);
  }

  to {
    -webkit-transform: rotate(2turn);
  }
}

.img.small {
  margin-top: 70px;
  width: 160px;
  height: 160px;
}

.opa {
  opacity: 0;
}

p {
  text-align: center;
}
</style>
