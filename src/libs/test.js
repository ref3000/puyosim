var hoge = 'hoge'

function test () {
  return 'test'
}

function setHoge (s) {
  hoge = s
}

export default {test}
export {hoge}
export {setHoge}
