import Puyo from './Puyo'

function dropPuyo (field, x, kind) {
  let pos = new Puyo.Pos(x, 13)
  if (field.isBrank(pos)) {
    field.set(pos, kind)
    field.fall()
  }
}

function setOpsToField (field, x, dir, puyoPair) {
  let ax = x
  let sx = (dir === 1) ? x + 1 : (dir === 3) ? x - 1 : x
  if (dir === 2) {
    dropPuyo(field, sx, puyoPair.sub)
    dropPuyo(field, ax, puyoPair.axis)
  } else {
    dropPuyo(field, ax, puyoPair.axis)
    dropPuyo(field, sx, puyoPair.sub)
  }
}

function calcScore (num, color, connections, chain) {
  const A = [0, 8, 16, 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448, 480, 512]
  const B = [0, 3, 6, 12, 24]
  const C = [0, 2, 3, 4, 5, 6, 7, 10]
  let base = num * 10
  let rate = A[chain - 1]
  if (rate === undefined) rate = 512
  rate += B[color - 1]
  for (let i = 0; i < connections.length; i++) {
    let n = connections[i]
    if (n > 11) rate += 10
    else rate += C[n - 4]
  }
  if (rate === 0) rate = 1
  return base * rate
}

function newPos (x, y) {
  return new Puyo.Pos(x, y)
}

class Chart {
  constructor () {
    this.chart = []
    this.size = 0
    for (let i = 0; i < 1000; i++) {
      this.chart.push({})
    }
  }
  set (turn, x, dir) {
    if (turn > 999) return
    this.chart[turn] = {
      x: x,
      dir: dir
    }
    if (turn + 1 > this.size) this.size = turn + 1
  }
  get (turn) {
    if (turn >= this.size) return {}
    return this.chart[turn]
  }
  size () {
    return this.size
  }
  setSize (size) {
    this.size = size
  }
}

class Game {
  constructor () {
    this.field = new Puyo.Field()
    this.next = new Puyo.Next()
    this.ops = {
      pos: new Puyo.Pos(),
      dir: 0,
      available: false
    }
    this.turn = 0
    this.chart = new Chart()
    this.score = 0
    this.sumScore = 0
    this.chain = 0
    this.moveTurn(0)
  }
  axisPos () {
    return this.ops.pos
  }
  subPos () {
    let axisPos = this.ops.pos
    switch (this.ops.dir) {
      case 0:
        return new Puyo.Pos(axisPos.x, axisPos.y + 1)
      case 1:
        return new Puyo.Pos(axisPos.x + 1, axisPos.y)
      case 2:
        return new Puyo.Pos(axisPos.x, axisPos.y - 1)
      case 3:
        return new Puyo.Pos(axisPos.x - 1, axisPos.y)
    }
    return new Puyo.Pos() // error
  }
  moveLeft () {
    if (!this.ops.available) return
    let ap = this.axisPos()
    let sp = this.subPos()
    if (this.field.isBrank(newPos(ap.x - 1, ap.y)) && this.field.isBrank(newPos(sp.x - 1, sp.y))) {
      this.ops.pos.x--
    }
  }
  moveRight () {
    if (!this.ops.available) return
    let ap = this.axisPos()
    let sp = this.subPos()
    if (this.field.isBrank(newPos(ap.x + 1, ap.y)) && this.field.isBrank(newPos(sp.x + 1, sp.y))) {
      this.ops.pos.x++
    }
  }
  rotateLeft () {
    if (!this.ops.available) return false
    let ap = this.axisPos()
    let apl = newPos(ap.x - 1, ap.y)
    let apr = newPos(ap.x + 1, ap.y)
    let apd = newPos(ap.x, ap.y - 1)
    switch (this.ops.dir) {
      case 0:
        if (!this.field.isBrank(apl)) {
          if (!this.field.isBrank(apr)) return false
          this.ops.pos.x++
        }
        break
      case 1:
        break
      case 2:
        if (!this.field.isBrank(apr)) {
          if (!this.field.isBrank(apl)) return false
          this.ops.pos.x--
        }
        break
      case 3:
        if (!this.field.isBrank(apd)) {
          if (this.ops.pos.y >= this.field.Height()) return false
          this.ops.pos.y++
        }
        break
    }
    this.ops.dir = (this.ops.dir + 3) % 4
    return true
  }
  rotateRight () {
    if (!this.ops.available) return false
    let ap = this.axisPos()
    let apl = newPos(ap.x - 1, ap.y)
    let apr = newPos(ap.x + 1, ap.y)
    let apd = newPos(ap.x, ap.y - 1)
    switch (this.ops.dir) {
      case 0:
        if (!this.field.isBrank(apr)) {
          if (!this.field.isBrank(apl)) return false
          this.ops.pos.x--
        }
        break
      case 1:
        if (!this.field.isBrank(apd)) {
          if (this.ops.pos.y >= this.field.Height()) return false
          this.ops.pos.y++
        }
        break
      case 2:
        if (!this.field.isBrank(apl)) {
          if (!this.field.isBrank(apr)) return false
          this.ops.pos.x++
        }
        break
      case 3:
        break
    }
    this.ops.dir = (this.ops.dir + 1) % 4
    return true
  }
  rotateLeftQuick () {
    if (!this.ops.available) return false
    if (this.ops.dir === 1 || this.ops.dir === 3) return false
    let ap = this.axisPos()
    let apd = newPos(ap.x, ap.y - 1)
    if (this.ops.dir === 0) {
      if (!this.field.isBrank(apd)) this.ops.pos.y++
    }
    this.ops.dir = (this.ops.dir + 2) % 4
  }
  rotateRightQuick () {
    return this.rotateLeftQuick()
  }
  setDown () {
    if (!this.ops.available) return
    let ap = this.axisPos()
    let sp = this.subPos()
    if (!this.field.isBrank(ap) || !this.field.isBrank(sp)) {
      console.log('無理置き')
      return
    }
    this.ops.available = false
    // 設置
    this.field.set(ap, this.next.get(this.turn).axis)
    this.field.set(sp, this.next.get(this.turn).sub)
    this.field.fall()
    // 履歴をセット
    // let ch = this.chart.get(this.turn)
    // if (ch.x !== this.ops.pos.x || ch.dir !== this.ops.dir) {
    //   this.chart.setSize(this.turn)
    // }
    this.chart.setSize(this.turn)
    this.chart.set(this.turn, this.ops.pos.x, this.ops.dir)
    // 発火可能なら発火処理
    if (this.field.canFire()) {
      this.chain = 0
      this.score = 0
      return
    }
    this.moveTurn(this.turn + 1)
    return
  }
  moveTurn (turnNum, opsSetFlag) {
    console.log('moveTurn', turnNum, opsSetFlag)
    if (turnNum < 0) return
    // Game初期化
    this.chain = 0
    this.score = 0
    this.sumScore = 0
    // history から field を再現
    this.field = new Puyo.Field()
    for (let i = 0; i < this.chart.size && i < turnNum; i++) {
      let ch = this.chart.get(i)
      setOpsToField(this.field, ch.x, ch.dir, this.next.get(i))
      if (!this.field.canFire()) continue
      this.score = 0
      for (let i = 1; i < 20; i++) {
        let info = this.field.stepFire()
        let score = calcScore(info.num, info.color, info.connections, i)
        this.chain = i
        this.score += score
        this.sumScore += score
        this.field.fall()
        if (!this.field.canFire()) break
      }
    }
    // 移動後の履歴状態に応じて処理
    let ch = this.chart.get(turnNum)
    if (ch.x == null || ch.dir == null) {
      // case: 履歴が存在しないか不完全
      this.chart.set(turnNum, null, null)
      this.ops.pos = new Puyo.Pos(3, 12)
      this.ops.dir = 0
    } else {
      // case: 履歴が存在
      if (opsSetFlag === true) {
        this.ops.pos = new Puyo.Pos(ch.x, 12)
        this.ops.dir = ch.dir
        if (!this.field.isBrank(this.axisPos()) || !this.field.isBrank(this.subPos())) {
          this.ops.pos.y++
        }
      } else {
        this.ops.pos = new Puyo.Pos(3, 12)
        this.ops.dir = 0
      }
    }
    //
    this.turn = turnNum
    this.ops.available = true
  }
  nextStep () {
    if (this.field.canFall()) {
      this.field.fall()
      if (this.field.canFire()) return
      this.ops.available = true
      this.moveTurn(this.turn + 1)
      return
    }
    if (this.field.canFire()) {
      let info = this.field.stepFire()
      this.chain++
      let score = calcScore(info.num, info.color, info.connections, this.chain)
      this.score += score
      this.sumScore += score
      // step
      if (this.field.canFall()) return
      this.ops.available = true
      this.moveTurn(this.turn + 1)
      return
    }
  }
  existNextStep () {
    return this.field.canFall() || this.field.canFire()
  }
  setNextSeed (seed) {
    this.next = new Puyo.Next(seed)
  }
  setNextMode (mode) {
    this.next.init(this.next._seed, mode)
  }
}

export default Game
