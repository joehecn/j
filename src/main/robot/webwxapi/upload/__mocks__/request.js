
module.exports = (option, headers, payload, buf, endData) => {
  return Promise.resolve({ option, headers, payload, buf, endData })
}
