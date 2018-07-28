
import data from '@/worker/data.js'

const dataGetListMB = () => {
  return data.getListMB({
    tos: {
      'Mbf403351dfb2ae819874163aff25a49c': {
        NickName: 'a',
        RemarkName: ''
      },
      'Mbf40335': {
        NickName: 'aa',
        RemarkName: ''
      },
      'Bbf40335': {
        NickName: 'aaa',
        RemarkName: ''
      }
    }
  })
}

describe('worker/data.js', () => {
  beforeEach(() => {
    data.addChatListAndRepeatList([
      { NickName: 'joe', UserName: '@joehe', RemarkName: '' },
      { NickName: 'joe', UserName: '@joehe111', RemarkName: '' },
      { NickName: 'joe1', UserName: '@joehe1111', RemarkName: '' },
      { NickName: 'jjjoe', UserName: '@@jjjoehe', RemarkName: '' }
    ])
  })

  afterEach(() => {
    data.resetData()
  })

  test('addChatListAndRepeatList', () => {
    expect.assertions(2)

    const count = data.getChatListCount()
    const repeatNameList = data.getRepeatNameList()

    expect(count).toBe(2)
    expect(repeatNameList).toEqual(['joe'])
  })

  test('getNickName', () => {
    expect.assertions(1)
    const NickName = data.getNickName('B120b1df75e335bb5bedbc198c53b4fe9')
    expect(NickName).toBe('jjjoe')
  })

  test('getListMB', () => {
    expect.assertions(1)
    
    const list = dataGetListMB()

    expect(list).toEqual({
      listM: [{
        premd5: 'Mbf403351dfb2ae819874163aff25a49c',
        NickName: 'joe1',
        RemarkName: '',
        status: 1
      }, {
        premd5: 'Mbf40335',
        NickName: 'aa',
        RemarkName: '',
        status: 3
      }],
      listB: [{
        premd5: 'B120b1df75e335bb5bedbc198c53b4fe9',
        NickName: 'jjjoe',
        RemarkName: '',
        status: 2
      }, {
        premd5: 'Bbf40335',
        NickName: 'aaa',
        RemarkName: '',
        status: 3
      }]
    })
  })

  test('setCurGroup', () => {
    expect.assertions(2)

    dataGetListMB()

    let curGroup = data.setCurGroup({
      status: 3,
      premd5: '1234',
      NickName: 'aa',
      RemarkName: ''
    })

    expect(curGroup).toEqual({
      tos:
      {
        '1234': { NickName: 'aa', RemarkName: '' },
        Mbf403351dfb2ae819874163aff25a49c: { NickName: 'a', RemarkName: '' },
        Mbf40335: { NickName: 'aa', RemarkName: '' },
        Bbf40335: { NickName: 'aaa', RemarkName: '' }
      }
    })

    curGroup = data.setCurGroup({
      status: 1,
      premd5: '1234',
      NickName: 'aa',
      RemarkName: ''
    })

    expect(curGroup).toEqual({
      tos:
      {
        Mbf403351dfb2ae819874163aff25a49c: { NickName: 'a', RemarkName: '' },
        Mbf40335: { NickName: 'aa', RemarkName: '' },
        Bbf40335: { NickName: 'aaa', RemarkName: '' }
      }
    })
  })

  test('getToList', () => {
    expect.assertions(1)

    const list = data.getToList({
      'Mbf403351dfb2ae819874163aff25a49c': 0
    })

    expect(list).toEqual([{
      premd5: 'Mbf403351dfb2ae819874163aff25a49c',
      ToUserName: '@joehe1111',
      failCount: 0
    }])
  })

  test('getBuf', async () => {
    expect.assertions(1)
    const file = new File(['foo'], 'foo.txt', {
      type: 'text/plain',
    })
    const buf = await data.getBuf(file)
    expect(buf.byteLength).toBe(3)
  })

  test('resetData', () => {
    expect.assertions(2)

    data.resetData()

    const count = data.getChatListCount()
    const repeatNameList = data.getRepeatNameList()

    expect(count).toBe(0)
    expect(repeatNameList).toEqual([])
  })
})
