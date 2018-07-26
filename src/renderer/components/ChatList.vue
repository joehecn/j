
<template>
  <div id="chat-list">
    <div id="search-bar">
      <el-input
        prefix-icon="el-icon-search"
        placeholder="输入关键字查询"
        v-model="keyword"
        clearable>
      </el-input>

      <el-select v-model="value" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>

    <div id="item-wrap">
      <div
        class="item"
        :class="'item-' + item.status"
        v-for="item in list"
        :key="item.key"
        @click="selectItem(item)">
        <span v-html="item.NickName"></span>
        <small v-if="item.RemarkName" v-html="item.RemarkName"></small>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  props: ['category'],
  data () {
    return {
      keyword: '',
      options: [{
        value: '',
        label: '全部'
      }, {
        value: '1',
        label: '已选'
      }, {
        value: '2',
        label: '未选'
      }, {
        value: '3',
        label: '错误'
      }],
      value: ''
    }
  },
  computed: {
    ...mapState({
      curGroupMd5: state => state.curGroupMd5
    }),
    ...mapGetters(['getList']),
    list () {
      return this.getList({
        category: this.category,
        keyword: this.keyword.trim().toLocaleLowerCase(),
        status: Number(this.value)
      })
    }
  },
  methods: {
    selectItem (item) {
      this.$$worker.postMessage({
        key: 'changeStatus',
        value: {
          md5: this.curGroupMd5,
          item,
          category: this.category,
        }
      })
    }
  }
}
</script>

<style scoped>
#chat-list {
  display: flex;
  flex-direction: column;
}

#search-bar {
  display: flex;
}

small {
  opacity: 0.8;
}

#item-wrap {
  overflow-y: auto;
}

.item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 44px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
}
.item:hover {
  background-color: #eaeaea;
}

.item-1 {
  color: #67c23a;
  background-color: #f0f9eb;
}

.item-2 {
  color: #999;
  background-color: #fff;
}

.item-3 {
  color: #f56c6c;
  background-color: #fef0f0;
}
</style>
