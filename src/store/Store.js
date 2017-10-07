import Puyo from './libs/Puyo'
// import GameManager from './libs/GameManager'
// let gm = new GameManager()

export default {
  state: {
    title: 'Hello!',
    ops: {
      pos: new Puyo.Pos(3, 12),
      dir: 0
    }
  },
  setTitle (title) {
    this.state.title = title
  },
  turnLeft: function () {
    this.state.ops.dir = (this.state.ops.dir + 3) % 4
  },
  turnRight: function () {
    this.state.ops.dir = (this.state.ops.dir + 1) % 4
  },
  moveLeft: function () {
    this.state.ops.pos.x = this.state.ops.pos.x - 1
  },
  moveRight: function () {
    this.state.ops.pos.x = this.state.ops.pos.x + 1
  }
}
