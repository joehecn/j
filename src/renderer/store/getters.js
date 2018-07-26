
export default {
  getList: state => ({ category, keyword, status }) => {
    const list = category === 'M' ? state.listM : state.listB
    if (keyword && status) {
      return list.filter(item => {
        return (item.status === status) &&
          ((item.NickName.toLocaleLowerCase().indexOf(keyword) > -1) ||
          (item.RemarkName.toLocaleLowerCase().indexOf(keyword) > -1))
      })
    }

    if (keyword) {
      return list.filter(item => {
        return (item.NickName.toLocaleLowerCase().indexOf(keyword) > -1) ||
          (item.RemarkName.toLocaleLowerCase().indexOf(keyword) > -1)
      })
    }

    if (status) {
      return list.filter(item => {
        return item.status === status
      })
    }

    return list
  }
}
