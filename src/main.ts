import {Util, generatorTest} from './util/util'

const g = generatorTest()
for (;;) {
  const {value, done} = g.next()
  if (done)
    break
  console.log(value)
}

Util.promiseTest()
  .then(result => {
    console.log(`Promise: result=${result}`)
  })
