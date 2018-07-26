
<template>
  <div id="login">
    <div id="card">
      <div id="code-img" v-loading="loading">
        <img :src="codeImg">
      </div>
      <p id="msg">{{msg}}</p>
      <p id="code408">{{ code408_ }}</p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      loginImg: state => state.loginImg,
      code408: state => state.code408,
      code201: state => state.code201
    }),
    codeImg () {
      return this.loginImg
    },
    loading () {
      return !this.loginImg
    },
    code408_ () {
      return new Array(this.code408 + 1).join('>')
    },
    msg () {
      return this.code201
        ? '扫描成功, 请在手机上确认登录'
        : '使用手机微信扫码登录'
    }
  },

  mounted () {
    this.$$worker.postMessage({
      key: 'start'
    })
  }
}
</script>

<style scoped>
#login {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url(../assets/login-bg.jpg) no-repeat 50%;
  background-size: cover;
}

#card {
  width: 300px;
  height: 400px;
  display: flex;
  flex-direction: column;
  background: white;
}

#code-img {
    width: 270px;
    height: 270px;
    margin: 20px auto 10px;
}

#code-img img {
    width: 270px;
    height: 270px;
}

#msg, #code408 {
  text-align: center;
}
</style>
