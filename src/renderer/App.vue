
<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
html, body, div {
  margin: 0;
  padding: 0;
}

html, body {
  height: 100%;
}

.el-message-box {
  width: 300px !important;
}

#back-page {
  position: fixed;
  right: 8px;
  bottom: 8px;
}

.el-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.el-tabs__content, .el-tab-pane {
  display: flex;
  flex-direction: column;
}
</style>

<style scoped>
#app {
  height: 100%
}
</style>
