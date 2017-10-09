import Puyo from './libs/puyo/Puyo'
// import Util from './libs/PuyoUtil'
import Game from './libs/puyo/Game'
let game = new Game()

let state = {
  title: 'Hello!',
  ops: {
    pos: {
      x: -1,
      y: -1
    },
    dir: -1
  },
  puyoObjs: [],
  nextPuyoPairs: [],
  turn: -1
}

function updateNext () {
  let na = []
  for (let i = 0; i < game.next.size(); i++) {
    let axis = game.next.get(i).axis
    let sub = game.next.get(i).sub
    na.push({
      axis: axis,
      sub: sub
    })
  }
  state.nextPuyoPairs = na
}

function updateField () {
  let objs = []
  for (let y = game.field.Height(); y > 0; y--) {
    for (let x = 1; x <= game.field.Width(); x++) {
      let kind = game.field.get(new Puyo.Pos(x, y))
      objs.push({
        pos: new Puyo.Pos(x, y),
        kind: kind
      })
    }
  }
  state.puyoObjs = objs
}

function updateOps () {
  state.ops = {
    pos: {
      x: game.ops.pos.x,
      y: game.ops.pos.y
    },
    dir: game.ops.dir,
    kind: game.ops
  }
}

function updateInfo () {
  state.turn = game.turn
}

updateNext()
updateField()
updateOps()
updateInfo()

console.log(state)

export default {
  state: state,
  setTitle (title) {
    this.state.title = title
  },
  turnLeft () {
    game.rotateLeft()
    updateOps()
  },
  turnRight () {
    game.rotateRight()
    updateOps()
  },
  moveLeft () {
    game.moveLeft()
    updateOps()
  },
  moveRight () {
    game.moveRight()
    updateOps()
  },
  setDown () {
    game.setDown()
    updateOps()
    updateField()
    updateInfo()
  }
}
