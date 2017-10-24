import Puyo from './libs/puyo/Puyo'
// import Util from './libs/PuyoUtil'
import Game from './libs/puyo/Game'
let game = new Game()
import Gif from 'gif.js.optimized'
import FB from './libs/FB'
let fb = new FB()
import Util from './libs/Util'

fb.onLogin(function (user) {
  state.isLoginWait = false
  state.isLogin = true
  state.userName = user.displayName
})

fb.onLogout(function () {
  state.isLoginWait = false
  state.isLogin = false
})

let state = {
  title: '完成度70%くらい',
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
  hamburger: false,
  gifSrc: null,
  gifView: false,
  gifProcessing: false,
  hashStr: '',
  chartView: false,
  isLoginWait: true,
  isLogin: false,
  userName: '',
  tweetView: false,
  tweetText: '',
  tweetChecked: true,
  configView: false,
  chainSpeed: 50,
  revision: 'random',
  statusStr: '',
  editView: false,
  editKind: Puyo.Kind.RED
}

function init (hash) {
  game = new Game()
  if (hash != null) {
    if (hash.substring(0, 1) === '#') {
      hash = hash.slice(1)
    }
    let toks = hash.split('!')
    if (toks[0] != null && toks[0].length > 0) {
      game.setNextSeed(Util.base64stoNum(toks[0].slice(0, 4)))
    }
    if (toks[1] != null && toks[1].length > 0) {
      let cs = getChartFromHash(toks[1].slice(0, 1000))
      for (let i = 0; i < cs.length; i++) {
        game.chart.set(i, cs[i].x, cs[i].dir)
      }
    }
  }
  game.moveTurn(game.chart.size - 1, true)
  updateNext()
  updateField()
  updateOps()
  updateInfo()
}
init(window.location.hash)

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
  state.hashStr = getHashStr()
  window.location.hash = state.hashStr
}

function _getChartFromHash (c) {
  switch (Util.base64ctoNum(c)) {
    case 0: return {x: null, dir: null}
    case 1: return {x: 1, dir: 0}
    case 2: return {x: 1, dir: 1}
    case 3: return {x: 1, dir: 2}
    case 4: return {x: 1, dir: 3}
    case 5: return {x: 2, dir: 0}
    case 6: return {x: 2, dir: 1}
    case 7: return {x: 2, dir: 2}
    case 8: return {x: 2, dir: 3}
    case 9: return {x: 3, dir: 0}
    case 10: return {x: 3, dir: 1}
    case 11: return {x: 3, dir: 2}
    case 12: return {x: 3, dir: 3}
    case 13: return {x: 4, dir: 0}
    case 14: return {x: 4, dir: 1}
    case 15: return {x: 4, dir: 2}
    case 16: return {x: 4, dir: 3}
    case 17: return {x: 5, dir: 0}
    case 18: return {x: 5, dir: 1}
    case 19: return {x: 5, dir: 2}
    case 20: return {x: 5, dir: 3}
    case 21: return {x: 6, dir: 0}
    case 22: return {x: 6, dir: 1}
    case 23: return {x: 6, dir: 2}
    case 24: return {x: 6, dir: 3}
  }
  return {}
}
function getChartFromHash (hashStr) {
  let charts = []
  for (let i = 0; i < hashStr.length; i++) {
    let c = hashStr[i]
    charts.push(_getChartFromHash(c))
  }
  return charts
}
function _getHashFromChart (ch) {
  if (ch.x == null || ch.dir == null) return Util.numToBase64c(0)
  let n = 4 * (ch.x - 1) + ch.dir + 1
  return Util.numToBase64c(n)
}
function getHashStr () {
  let chart = game.chart
  let str = Util.numToBase64s(game.next.seed()) + '!'
  for (let i = 0; i < chart.size; i++) {
    str += _getHashFromChart(chart.get(i))
  }
  return str
}

export default {
  state: state,
  setTitle (title) {
    this.state.title = title
  },
  init: init,
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
      }.bind(this), 1000 - (state.chainSpeed * 10))
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
      }.bind(this), 1000 - (state.chainSpeed * 10))
    } else {
      setTimeout(function () {
        updateField() // TODO: やばい…
      }, 1000 - (state.chainSpeed * 10))
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
  moveTurnPrev () {
    game.moveTurn(game.turn - 1, true)
    updateOps()
    updateField()
    updateInfo()
  },
  moveTurnNext () {
    game.moveTurn(game.turn + 1, true)
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
    if (state.hamburger) {
      this.closeHamburger()
    } else {
      this.openHamburger()
    }
  },
  closeHamburger () {
    state.hamburger = false
    this.closeGifView()
    this.closeChartView()
    this.closeTweetView()
    this.closeConfigView()
  },
  openHamburger () {
    state.hamburger = true
  },
  createGif () {
    console.log('createGif!')
    if (state.gifProcessing === true) return
    state.gifProcessing = true
    console.log('start')

    let gif = new Gif({
      repeat: -1,
      width: 192,
      height: 416
    })

    let cv = document.createElement('canvas')
    cv.width = 192
    cv.height = 416
    let ctx = cv.getContext('2d')

    let back = new Image()
    back.src = require('../assets/puyo_field_back.png')
    let pr = new Image()
    pr.src = require('../assets/puyo_r.png')
    let pg = new Image()
    pg.src = require('../assets/puyo_g.png')
    let pb = new Image()
    pb.src = require('../assets/puyo_b.png')
    let py = new Image()
    py.src = require('../assets/puyo_y.png')
    let pp = new Image()
    pp.src = require('../assets/puyo_p.png')
    let po = new Image()
    po.src = require('../assets/puyo_o.png')

    let turn = game.turn
    for (let i = 0; i <= turn; i++) {
      ctx.drawImage(back, 0, 0)
      game.moveTurn(i)
      for (let y = 1; y <= game.field.height; y++) {
        for (let x = 1; x <= game.field.width; x++) {
          let k = game.field.get(new Puyo.Pos(x, y))
          let xx = (x - 1) * 32
          let yy = (13 - y) * 32
          switch (k) { // TODO: 定義の集約
            case Puyo.Kind.RED:
              ctx.drawImage(pr, xx, yy)
              break
            case Puyo.Kind.BLUE:
              ctx.drawImage(pb, xx, yy)
              break
            case Puyo.Kind.GREEN:
              ctx.drawImage(pg, xx, yy)
              break
            case Puyo.Kind.YELLOW:
              ctx.drawImage(py, xx, yy)
              break
            case Puyo.Kind.PURPLE:
              ctx.drawImage(pp, xx, yy)
              break
            case Puyo.Kind.OJAMA:
              ctx.drawImage(po, xx, yy)
              break
          }
        }
      }
      gif.addFrame(cv, {copy: true, delay: 500})
    }

    gif.on('finished', function (blob) {
      let reader = new window.FileReader()
      reader.readAsDataURL(blob)
      reader.onloadend = function () {
        let base64data = reader.result
        console.log(base64data)
        state.gifSrc = base64data
        state.gifProcessing = false
      }
      // let url = URL.createObjectURL(blob)
      // console.log(url)
      // state.gifSrc = url
    })
    gif.render()
  },
  openGifView () {
    state.gifView = true
  },
  closeGifView () {
    state.gifView = false
  },
  openChartView () {
    state.chartView = true
  },
  closeChartView () {
    state.chartView = false
  },
  openTweetView () {
    state.tweetText = state.chain + '連鎖' + state.score + '点（' + (state.turn + 1) + '手）\n'
    state.tweetText += 'https://sim.refpuyo.net/#' + state.hashStr
    state.tweetView = true
    if (state.tweetChecked) this.createGif()
  },
  closeTweetView () {
    state.tweetView = false
  },
  debug () {
    game.setDown()
    updateField()
  },
  login () {
    fb.login()
  },
  logout () {
    fb.logout()
  },
  tweet () {
    if (state.gifProcessing === true) return
    state.statusStr = 'ツイート処理中...'
    if (state.tweetChecked === true) {
      let toks = state.gifSrc.split(',')
      fb.tweet(state.tweetText, toks[1], function (isSuccess) {
        if (isSuccess) {
          state.statusStr = '投稿完了！'
        } else {
          state.statusStr = '投稿失敗...'
        }
        setTimeout(function () {
          state.statusStr = ''
        }, 1000)
      })
    } else {
      fb.tweet(state.tweetText, null, function (isSuccess) {
        if (isSuccess) {
          state.statusStr = '投稿完了！'
        } else {
          state.statusStr = '投稿失敗...'
        }
        setTimeout(function () {
          state.statusStr = ''
        }, 1000)
      })
    }
    this.closeHamburger()
  },
  openConfigView () {
    state.configView = true
  },
  closeConfigView () {
    state.configView = false
    game.setNextMode(state.revision)
  },
  pushEditIcon () {
    state.editView = !state.editView
  },
  fieldClick (x, y) {
    if (!state.editView) return
    game.editField(x, y, state.editKind)
    updateField()
  },
  setEditKind (kind) {
    state.editKind = kind
  }
}
