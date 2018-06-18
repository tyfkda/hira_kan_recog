import {Util, generatorTest} from '../../src/util/util'

describe('util', () => {
  it('generatorTest', () => {
    const g = generatorTest()
    expect(g.next()).toEqual({value: 'foo', done: false})
    expect(g.next()).toEqual({value: 'bar', done: false})
    expect(g.next()).toEqual({value: 'baz', done: false})
    expect(g.next()).toEqual({value: undefined, done: true})
  })

  it('promiseTest', () => {
    Util.promiseTest()
      .then((result) => {
        expect(result).toBe(123)
      })
      .catch((error) => {
        fail('Must not be here: ' + error)
      })
  })
})
