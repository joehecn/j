
import github from '@/github.js'
import { doesNotThrow } from 'assert';

beforeEach(() => {
  global.Headers = class Headers {
    append () {}
  }
  global.Request = class Request {}
  global.fetch = () => {
    return {
      json() {
        return { msg: 'test' }
      }
    }
  }
})

test('github.js', async () => {
  expect.assertions(1)
  const res = await github()
  expect(res).toEqual({ msg: 'test' })
})
