
let delCount = 0

const methods = {
  getMsg () {
    return {
      tos: []
    }
  },
  setMsg () {
    // throw new Error()
  },

  getGroupList () {
    return []
  },

  setGroup () {},

  getGroup () {
    return 'haha'
  },

  delGroup () {
    if (delCount++ === 1) {
      throw new Error()
    }
  }
}

const createErr = (status, message) => {
  const err = new Error(message)
  err.status = status
  return err
}

export default async (method, arg) => {
  try {
    /* istanbul ignore else */
    if (methods[method]) {
      const res = await methods[method](arg)
      return res
    }
  } catch (err) {
    throw createErr(1000, err.message || '数据库错误')
  }
}
