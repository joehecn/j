
/**
Content-Disposition: form-data; name="id"

Content-Disposition: form-data; name="filename"; filename="139-150210134411-50.jpg"
Content-Type: image/jpeg
 */
const getPart = (name, filename, type) => {
  const partOne = `Content-Disposition: form-data; name="${name}"`
  if (!filename || !type) {
    return partOne
  }

  return `${partOne}; filename="${filename}"\r\nContent-Type: ${type}`
}

/**
\nContent-Disposition: form-data; name="id"\n\nWU_FILE_0\n--
 */
const getField = ({ name, value, filename, type }) => {
  const part = getPart(name, filename, type)

  if (!value) {
    return `\r\n${part}\r\n\r\n`
  }

  return `\r\n${part}\r\n\r\n${value}\r\n`
}

const getPayload = (bothEnds, boundary, fields) => {
  const arr = fields.map(item => {
    return getField(item)
  })

  arr.unshift('')

  return arr.join(bothEnds + boundary)
}

const getEndData = (bothEnds, boundary) => {
  return `\r\n${bothEnds}${boundary}${bothEnds}\r\n`
}

module.exports = {
  getPayload,
  getEndData
}
