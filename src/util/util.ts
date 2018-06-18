export function* generatorTest(): Generator<string> {
  yield 'foo'
  yield 'bar'
  yield 'baz'
}

export class Util {
  public static promiseTest(): Promise<number> {
    return new Promise((resolve, _reject) => {
      resolve(123)
    })
  }
}
