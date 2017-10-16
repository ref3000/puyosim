const table = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_'

export default {
  base64ctoNum: function (c) {
    for (let i = 0; i < table.length; i++) {
      if (c === table[i]) return i
    }
    return 0
  },
  base64stoNum: function (str) {
    let r = 0
    let base = 1
    for (let i = 0; i < str.length; i++) {
      let n = this.base64ctoNum(str[i])
      r += n * base
      base *= 64
    }
    return r
  },
  numToBase64c: function (n) {
    if (n > 63 || n < 0) return '?'
    return table[n]
  },
  numToBase64s: function (n) {
    console.log(n)
    if (n < 0) return '?'
    let s = ''
    for (let i = 0; i < 10; i++) {
      let d = n % 64
      s += table[d]
      n = Math.floor(n / 64)
      if (n === 0) break
    }
    return s
  }
}
