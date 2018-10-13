
export const createErr = (status, message) => {
  const err = new Error(message)
  err.status = status
  return err
}

export const makeMethod = (methods, createErr)  => {
  return async (method, arg) => {
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
}
