
import actions from '@/store/actions.js'

describe('store/actions.js', () => {
  let context = null

  beforeEach(() => {
    context = {
      commit: jest.fn()
    }
  })

  test('setFalseClearNewGroupNameInput', () => {
    expect.assertions(1)

    actions.setFalseClearNewGroupNameInput(context)

    expect(context.commit)
      .toHaveBeenCalledWith(
        'setFalseClearNewGroupNameInput'
      )
  })

  test('setCurGroupMd5', () => {
    expect.assertions(1)

    const md5 = 'md5'
    actions.setCurGroupMd5(context, { md5 })

    expect(context.commit).toHaveBeenCalledWith(
      'setCurGroupMd5',
      { md5 }
    )
  })
})
