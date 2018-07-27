
const getIndex = (name, keyword) => {
  return name.toLocaleLowerCase().indexOf(keyword)
}

const checkName = (NickName, RemarkName, keyword) => {
  return (getIndex(NickName, keyword) > -1) ||
  (getIndex(RemarkName, keyword) > -1)
}

const filterBoth = (keyword, status) => {
  return item => {
    return (item.status === status) &&
      checkName(item.NickName, item.RemarkName, keyword)
  }
}

const filterKeyword = keyword => {
  return item => {
    return checkName(item.NickName, item.RemarkName, keyword)
  }
}

const filterStatus = status => {
  return item => {
    return item.status === status
  }
}

export default {
  getList: state => ({ category, keyword, status }) => {
    const list = category === 'M' ? state.listM : state.listB
    
    if (keyword && status) {
      return list.filter(filterBoth(keyword, status))
    }

    if (keyword) {
      return list.filter(filterKeyword(keyword))
    }

    if (status) {
      return list.filter(filterStatus(status))
    }

    return list
  }
}
