
<template>
  <div id='group'>
    <div id="new-group-warp">
      <el-input
        placeholder="填写组名"
        v-model="newGroupName"
        clearable>
      </el-input>
      <el-button type="primary" @click="addGroup">新增组</el-button>
    </div>
    
    <div class="group-item" v-for="(group, index) in groupList"
        :key="group.md5"
        @click="groupSelect(index)">
        <div class="group-name">{{group.groupName}}</div>
        <el-button type="danger"
          icon="el-icon-delete"
          circle
          @click.stop="delGroup(index)"></el-button>
      </div>

      <el-button
        id="back-page"
        type="primary"
        icon="el-icon-back"
        circle
        @click="backToPreset"></el-button>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import sparkMD5 from 'spark-md5'

export default {
  data () {
    return {
      newGroupName: ''
    }
  },
  computed: {
    ...mapState({
      groupList: state => state.groupList,
      clearNewGroupNameInput: state => state.clearNewGroupNameInput
    })
  },
  watch: {
    clearNewGroupNameInput (val) {
      /* istanbul ignore else */
      if (val) {
        this.newGroupName = ''
      }
    }
  },
  mounted () {
    this.$$worker.postMessage({
      key: 'getGroupList'
    })
  },
  // beforeDestroy () {},
  methods: {
    ...mapActions([
      'setFalseClearNewGroupNameInput',
      'setCurGroupMd5'
    ]),
    addGroup () {
      const _newGroupName = this.newGroupName.trim()
      if (!_newGroupName) {
        this.$notify.warning({
          position: 'bottom-left',
          title: '警告',
          message: '组名不能为空'
        })
        return
      }

      const md5 = sparkMD5.hash(_newGroupName)

      // 判断 md5 是否 重复
      const canAdd = this.groupList.every(item => {
        return item.md5 !== md5
      })

      if (!canAdd) {
        this.$notify.warning({
          position: 'bottom-left',
          title: '警告',
          message: '组名不能重复'
        })
        return
      }

      this.setFalseClearNewGroupNameInput()
      this.$$worker.postMessage({
        key: 'addGroup',
        value: {
          md5,
          groupName: _newGroupName
        }
      })
    },
    groupSelect (index) {
      this.setCurGroupMd5({ md5: this.groupList[index].md5 })
      this.$router.push('chat')
    },
    delGroup (index) {
      this.$confirm('确定删除该组?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$$worker.postMessage({
          key: 'delGroup',
          value: {
            index,
            md5: this.groupList[index].md5
          }
        })

      }).catch(() => {})
    },
    backToPreset () {
      this.$router.go(-1)
    }
  }
}
</script>


<style scoped>
#group {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#new-group-warp, .group-item {
  display: flex;
  align-items: center;
}

#new-group-warp {
  margin-top: 30px;
}

.group-item {
  user-select: none;
  padding: 8px;
  border-bottom: 1px solid #eaeaea;
  cursor: pointer;
}

.group-item:hover {
  background: #eaeaea;
}

.group-name {
  width: 220px;
}
</style>
