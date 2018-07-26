
const webwxapi = require('@/robot/webwxapi')

test('robot/webwxapi', () => {
  expect.assertions(1)
  
  const propertys = Object.keys(webwxapi)
  expect(propertys.length).toBe(12)
})
