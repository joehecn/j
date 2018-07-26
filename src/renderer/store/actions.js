
export default {
  setFalseClearNewGroupNameInput ({ commit }) {
    commit('setFalseClearNewGroupNameInput')
  },

  setCurGroupMd5 ({ commit }, { md5 }) {
    commit('setCurGroupMd5', { md5 })
  }
}
