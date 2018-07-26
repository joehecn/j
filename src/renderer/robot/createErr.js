
module.exports = function createErr (status, message) {
  const err = new Error(message)
  err.status = status
  return err
}
