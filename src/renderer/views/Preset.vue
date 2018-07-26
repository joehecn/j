
<template>
  <div id="preset">
    <el-alert
      title="有的账号不会抓取微信群?"
      type="warning"
      :closable="false"
      description="系统会在获取联系人完成 (不是获取微信群完成) 后显示下一步按钮, 请等待30秒, 系统会尝试获取微信群, 尽量在看到 '获取微信群完成！' 提示后再点击下一步按钮">
    </el-alert>
  
    <ol class="ol-success">
      <li v-for="(item, index) in prelist" :key="index">{{ item }}</li>
    </ol>
  
    <div v-if="repeatNameList.length > 0">
      <el-alert
        title="重复的联系人"
        type="error"
        :closable="false"
        description="下面这些是被系统屏蔽的重复的联系人，你需要在官方微信上修改一下备注名才能使用，有的企业号和公众号也可能重名，对于群发来说没有影响， 再就是昵称为空的临时群直接屏蔽了，没名字这里列举不了">
      </el-alert>
      
      <ul class="ul-error">
        <li v-for="(item, index) in repeatNameList" :key="index">{{ item }}</li>
      </ul>
    </div>
    <el-button
      type="primary"
      v-if="showNextBtn"
      @click="gotoGroupPape">下一步</el-button>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      prelist: state => state.prelist,
      showNextBtn: state => state.showNextBtn,
      repeatNameList: state => state.repeatNameList
    })
  },

  methods: {
    gotoGroupPape () {
      this.$router.push('group')
    }
  }
}
</script>

<style scoped>
#preset {
  margin: 8px;
}

.ol-success {
  color: #67c23a;
}

.ul-error {
  color: #f56c6c;
}
</style>
