
import getters from '@/store/getters.js'

const testGetList = (state, query) => {
  const getList = getters.getList(state)
  
  const list = getList(query)

  expect(list).toEqual([
    { status: 1, NickName: 'key', RemarkName: '' },
    { status: 1, NickName: 'joe', RemarkName: 'key' }
  ])
}

describe('store/getters', () => {
  let state = null

  beforeEach(() => {
    state = {
      listM: [{
        status: 1,
        NickName: 'key',
        RemarkName: ''
      }, {
        status: 1,
        NickName: 'joe',
        RemarkName: 'key'
      }],
      listB: []
    }
  })

  test('getList M keyword status', () => {
    expect.assertions(1)

    const query = {
      category: 'M',
      keyword: 'key',
      status: 1
    }
    
    testGetList(state, query)
  })

  test('getList B keyword status', () => {
    expect.assertions(1)

    const query = {
      category: 'B',
      keyword: 'key',
      status: 1
    }
    const getList = getters.getList(state)
  
    const list = getList(query)
  
    expect(list).toEqual([])
  })

  test('getList M keyword', () => {
    expect.assertions(1)

    const query = {
      category: 'M',
      keyword: 'key'
    }

    testGetList(state, query)
  })

  test('getList M status', () => {
    expect.assertions(1)

    const query = {
      category: 'M',
      status: 1
    }
    
    testGetList(state, query)
  })

  test('getList M', () => {
    expect.assertions(1)
    
    const query = {
      category: 'M'
    }
    
    testGetList(state, query)
  })
})
