
<template>
  <div id="chat">
    <el-tabs v-model="activeName">
      <el-tab-pane label="发消息" name="F">
        <send-message v-if="activeName === 'F'"></send-message>
      </el-tab-pane>
      <el-tab-pane label="联系人" name="M">
        <chat-list category="M"></chat-list>
      </el-tab-pane>
      <el-tab-pane label="微信群" name="B">
        <chat-list category="B"></chat-list>
      </el-tab-pane>
    </el-tabs>
    <el-button
      id="back-page"
      type="primary"
      icon="el-icon-back"
      circle
      @click="backToGroup"></el-button>
  </div>
</template>

<script>
  import SendMessage from '@/components/SendMessage.vue'
  import ChatList from '@/components/ChatList.vue'
  import { mapState } from 'vuex'

  export default {
    components: {
      'send-message': SendMessage,
      'chat-list': ChatList
    },
    data() {
      return {
        activeName: 'F'
      };
    },
    computed: {
      ...mapState({
        curGroupMd5: state => state.curGroupMd5
      })
    },
    mounted () {
      this.$$worker.postMessage({
        key: 'getGroup',
        value: {
          md5: this.curGroupMd5
        }
      })
    },
    // beforeDestroy () {},
    methods: {
      backToGroup () {
        this.$router.go(-1)
      }
    }
  };
</script>

<style scoped>
#chat {
  height: 100%;
  margin: 0 8px;
}
</style>
