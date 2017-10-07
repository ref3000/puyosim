export default {
  Kind: {
    BRANK: Symbol()
  },
  Pos: class {
    constructor (x, y) {
      this.x = (isNaN(x)) ? 0 : x
      this.y = (isNaN(y)) ? 0 : y
    }
  }
}
