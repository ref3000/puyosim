import Random from './Random'

// 定数
const Kind = { // ぷよの種類
  BRANK: 0,
  RED: 1,
  GREEN: 2,
  BLUE: 3,
  YELLOW: 4,
  PURPLE: 5,
  OJAMA: 8,
  WALL: 9
}

// 補助関数
function isNull (obj) {
  return obj == null
}

function className (obj) {
  if (obj == null) return ''
  if (obj.constructor == null) return ''
  return obj.constructor.name
}

function isPuyo (obj) {
  return className(obj) === 'Puyo'
}

function printError (mes, obj) {
  console.error(mes, obj)
}

// クラス定義
class PuyoPair {
  constructor (axis, sub) {
    this.axis = isNull(axis) ? new Puyo() : axis
    this.sub = isNull(sub) ? new Puyo() : sub
    if (!isPuyo(this.axis)) printError('PuyoPair: type error', axis)
    if (!isPuyo(this.sub)) printError('PuyoPair: type error', sub)
  }
}

class Next {
  constructor () {
    this._random = new Random()
    this._size = 1024
    this._puyos = []
    for (let i = 0; i < this._size; i++) {
      this._puyos.push(new PuyoPair(new Puyo(this._nextKind()), new Puyo(this._nextKind())))
    }
  }
  size () {
    return this._size
  }
  get (num) {
    return this._puyos[num % 1024]
  }
  _nextKind () {
    switch (this._random.nextInt(4)) {
      case 0: return Kind.RED
      case 1: return Kind.GREEN
      case 2: return Kind.BLUE
      case 3: return Kind.YELLOW
    }
    return Kind.BRANK
  }
}

class Pos {
  constructor (x, y) {
    this.x = isNaN(x) ? 0 : x
    this.y = isNaN(y) ? 0 : y
  }
}

class Field {
  constructor () {
    this.height = 13
    this.width = 6
    this._value = []
    for (let y = 0; y < this.height; y++) {
      let line = []
      for (let x = 0; x < this.width; x++) {
        line.push(new Puyo(Kind.BRANK))
      }
      this._value.push(line)
    }
  }
  isBrank (pos) {
    return this.get(pos).kind === Kind.BRANK
  }
  get (pos) {
    if (pos.y < 1 || pos.y > this.height || pos.x < 1 || pos.x > this.width) {
      return Kind.WALL
    }
    return this._value[pos.y - 1][pos.x - 1]
  }
  set (pos, puyo) {
    if (pos.y < 1 || pos.y > this.height || pos.x < 1 || pos.x > this.width) {
      return
    }
    this._value[pos.y - 1][pos.x - 1] = puyo.kind
  }
  fall () {
    let flag = false // 落下が発生したかどうか
    for (let x = 1; x <= this.width; x++) {
      let t = 1
      for (let y = 1; y <= this.height; y++) {
        let p = this.get(new Pos(x, y))
        if (p === Kind.BRANK) continue
        this.set(new Pos(x, y), this.get(new Pos(x, t)))
        this.set(new Pos(x, t), p)
        if (t !== y) flag = true
        t++
      }
    }
    return flag
  }
  canFall () {
    for (let x = 1; x <= this.width; x++) {
      for (let y = 2; y <= this.height; y++) {
        if (this.get(new Pos(x, y - 1)) === Kind.BRANK && this.get(new Pos(x, y)) !== Kind.BRANK) return true
      }
    }
    return false
  }
  Height () {
    return this.height
  }
  Width () {
    return this.width
  }
}

export default {
  Kind: Kind,
  Pos: Pos,
  Puyo: Puyo,
  Next: Next,
  Field: Field
}
