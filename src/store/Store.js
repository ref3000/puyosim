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
    dir: -1,
    available: true
  },
  puyoObjs: [],
  nextPuyoPairs: [],
  nextDisplayNum: 4, // 廃止予定
  nextDisplay: [{axis: true, sub: true}, {axis: true, sub: true}, {axis: false, sub: false}, {axis: false, sub: false}],
  turn: -1,
  chain: 0,
  score: 0,
  sumScore: 0,
  history: [],
  hamburger: false
}

let lastTurnMs = 0

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
    available: game.ops.available
  }
}

function updateInfo () {
  state.turn = game.turn
  state.chain = game.chain
  state.score = game.score
  state.sumScore = game.sumScore
  let h = []
  for (let i = 0; i < game.chart.size; i++) {
    h.push(game.chart.get(i))
  }
  state.history = h
}

updateNext()
updateField()
updateOps()
updateInfo()

export default {
  state: state,
  setTitle (title) {
    this.state.title = title
  },
  init () {
    game = new Game()
    updateNext()
    updateField()
    updateOps()
    updateInfo()
  },
  turnLeft () {
    if (!game.rotateLeft()) {
      let nowMs = new Date().getTime()
      if (nowMs - lastTurnMs < 1000) {
        game.rotateLeftQuick()
        lastTurnMs = 0
      } else {
        lastTurnMs = nowMs
      }
    }
    updateOps()
  },
  turnRight () {
    if (!game.rotateRight()) {
      let nowMs = new Date().getTime()
      if (nowMs - lastTurnMs < 1000) {
        game.rotateRightQuick()
        lastTurnMs = 0
      } else {
        lastTurnMs = nowMs
      }
    }
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
    if (!game.ops.available) return
    game.setDown()
    if (game.existNextStep()) {
      setTimeout(function () {
        this.nextStep()
      }.bind(this), 500)
    }
    updateOps()
    updateField()
    updateInfo()
  },
  nextStep () {
    let cf = game.field.canFire()
    let before = game.field.copy()
    game.nextStep()
    let after = game.field.copy()
    if (game.existNextStep()) {
      setTimeout(function () {
        this.nextStep()
      }.bind(this), 500)
    } else {
      setTimeout(function () {
        updateField() // TODO: やばい…
      }, 500)
    }
    updateOps()
    updateField()
    updateInfo()
    if (cf) { // 消えたぷよの表示用処理
      for (let i = 0; i < state.puyoObjs.length; i++) {
        let pos = state.puyoObjs[i].pos
        if (!before.isBrank(pos) && after.isBrank(pos)) {
          state.puyoObjs[i].state = 'extinction' // TODO: 定義が散らかってやばいので修正
        }
      }
    }
  },
  moveTurn (turnNum) {
    game.moveTurn(turnNum, true)
    updateOps()
    updateField()
    updateInfo()
  },
  toggleNextDisplay (pos, isAxis) {
    console.log(pos, isAxis)
    if (isAxis) {
      state.nextDisplay[pos].axis = !state.nextDisplay[pos].axis
    } else {
      state.nextDisplay[pos].sub = !state.nextDisplay[pos].sub
    }
  },
  toggleHamburger () {
    state.hamburger = !state.hamburger
  }
}
