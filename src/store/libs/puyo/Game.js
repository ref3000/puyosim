import Puyo from './Puyo'

class Game {
  constructor () {
    this.field = new Puyo.Field()
    this.next = new Puyo.Next()
    this.ops = {
      pos: new Puyo.Pos(3, 12),
      dir: 0
    }
    this.turn = 1
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
    this.ops.pos.x = this.ops.pos.x - 1
  }
  moveRight () {
    this.ops.pos.x = this.ops.pos.x + 1
  }
  rotateLeft () {
    this.ops.dir = (this.ops.dir + 3) % 4
  }
  rotateRight () {
    this.ops.dir = (this.ops.dir + 1) % 4
  }
  setDown () {
    let ap = this.axisPos()
    let sp = this.subPos()
    if (!this.field.isBrank(ap) || !this.field.isBrank(sp)) {
      console.log('無理置き')
      return
    }
    this.field.set(ap, this.next.get(this.turn).axis)
    this.field.set(sp, this.next.get(this.turn).sub)
    if (!this.field.fall()) return
    this.ops.pos = new Puyo.Pos(3, 12)
    this.ops.dir = 0
    this.turn++
  }
}

export default Game
