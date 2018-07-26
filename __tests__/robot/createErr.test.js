
const createErr = require('@/robot/createErr.js')

test('robot/createErr.js', () => {
  expect.assertions(2)

  const error = createErr(999, 'message')
  
  expect(error.message).toBe('message')
  expect(error.status).toBe(999)
})
