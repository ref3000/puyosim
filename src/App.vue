<template>
  <div id="app">
    <div id="left_content">
      <div id="keyboard-description">
        <div id="keyboar-description-title">キーボード操作</div>
        <table class="descriptionTable">
        <tr><td>[←][→]</td><td>左右移動</td></tr>
        <tr><td>[Z][X]</td><td>左右回転</td></tr>
        <tr><td>[↓]</td><td>設置</td></tr>
        <tr><td>[↑]</td><td>１手戻る</td></tr>
        <tr><td>[N]</td><td>１手進む</td></tr>
        <tr><td>[R]</td><td>初手に戻る</td></tr>
        <tr><td>[T]</td><td>ツモを変えてリセット</td></tr>
        <tr><td>[E]</td><td>編集モード</td></tr>
        <tr><td>[1-8]</td><td>ぷよ種選択（編集モード）</td></tr>
        </table>
      </div>
    </div>
    <div id="main_content">
      <div id="top">
        <div id="login-wait" v-if="state.isLoginWait" v-on:touchstart="loginClick" v-on:mousedown="loginClick">確認中...</div>
        <div id="login" v-if="!state.isLogin && !state.isLoginWait" v-on:touchstart="loginClick" v-on:mousedown="loginClick">ログイン<br>していません</div>
        <div id="logout" v-if="state.isLogin && !state.isLoginWait" v-on:touchstart="loginClick" v-on:mousedown="loginClick">{{state.userName}}</div>
        <div class="loginTriangle" v-on:touchstart="loginClick" v-on:mousedown="loginClick"></div>
        <div id="status">{{state.statusStr}}</div>
        <img id="editIcon" :class="{editIconActive: state.editView}" src="./assets/edit.png" v-on:touchstart="pushEditIcon" v-on:mousedown="pushEditIcon"></img>
        <img id="hun" :class="{openHamburger: state.hamburger}" src="./assets/hun02.png" v-on:touchstart="hamburger" v-on:mousedown="hamburger"></img>
      </div>
      <div id="mid">
        <img id="puyo-field" src="./assets/puyo_field_back.png">
          <img class="puyo" :src="require('./assets/peke.png')" style='top:32px; left:64px;'></img>
          <img class="puyo" :src='opsAxisSrc' :style='opsAxisStyle' v-if="!state.editView"></img>
          <img class="puyo" :src='opsSubSrc' :style='opsSubStyle' v-if="!state.editView"></img>
        </img>
        <img class="puyo" v-for="obj in state.puyoObjs" :src='puyoSrc(obj)' :style='puyoStyle(obj)'></img>
        <div v-for="obj in puyoFieldTouchObjs" @touchstart="puyoFieldTouch($event, obj)" @mousedown="puyoFieldTouch($event, obj)" :style="puyoFieldTouchStyle(obj)"></div>
        <div id="sub-field">
          <div id="next-area">
            <img class="puyo" v-for="(obj, index) in nextPuyos" :src='puyoSrc(obj)' :style='nextPuyoStyle(obj)' v-on:touchstart="toggleNext($event, index)" v-on:mousedown="toggleNext($event, index)">
          </div>
          <div id="ojama-image-area">
          </div>
          <div v-if="state.editView" style="position:absolute; top:0px; left:0px; width:128px; height:64px; background-color:#ffffff">
            <img class="puyo" v-for="(obj, index) in editPuyos" :src='puyoSrc(obj)' :style='nextPuyoStyle(obj)'>
            <div v-for="obj in editPuyos" @touchstart="editPuyoTouch($event, obj)" @mousedown="editPuyoTouch($event, obj)" :style="editPuyoTouchStyle(obj)"></div>
          </div>
          <div id="info-area">
            <div id="turn-view">{{state.turn + 1}}手目</div>
            <div id="chain-view">{{state.chain}}連鎖 {{state.score}}点</div>
            <div id="score-view">合計 {{state.sumScore}}点</div>
            <img src='./assets/arrow_l.png' style='position: absolute; top: 5px; left: 10px' v-on:touchstart="b_prev" v-on:mousedown="b_prev"></img>
            <img src='./assets/arrow_r.png' style='position: absolute; top: 5px; left: 96px' v-on:touchstart="b_next" v-on:mousedown="b_next"></img>
          </div>
          <div id="chart-area">
            <div v-for="(obj, index) in state.history" class="chart-tile" :class="{activeTile: index===state.turn}" v-on:touchstart="b_chart($event, index)" v-on:mousedown="b_chart($event, index)">
              <div class="chart-num" :style="obj.isEdit?'color:#ff0000; font-weight:bold;':''">{{index + 1}}</div>
              <img class="puyo" :src='puyoHistoryAxisSrc(obj, index)' style="left: 28px">
              <img class="puyo" :src='puyoHistorySubSrc(obj, index)' style='left: 60px'>
              <div class="chart-pos">{{(obj.x>0&&obj.x<7)?obj.x:''}}</div>
              <div class="chart-dir">{{(obj.dir===0)?'↑':(obj.dir===1)?'→':(obj.dir===2)?'↓':(obj.dir===3)?'←':''}}</div>
              <div class="leftEditChart" v-on:touchstart="editChartLeft($event, index)" v-on:mousedown="editChartLeft($event, index)"></div>
              <div class="rightEditChart" v-on:touchstart="editChartRight($event, index)" v-on:mousedown="editChartRight($event, index)"></div>
            </div>
          </div>
        </div>
      </div>
      <div id="bottom">
        <div class="bt" v-on:touchstart="b_left" v-on:mousedown="b_left" v-on:touchend="b_untouch" v-on:mouseup="b_untouch" v-on:mouseout="b_untouch">←</div>
        <div class="bt" v-on:touchstart="b_down" v-on:mousedown="b_down" v-on:touchend="b_untouch" v-on:mouseup="b_untouch" v-on:mouseout="b_untouch">↓</div>
        <div class="bt" v-on:touchstart="b_right" v-on:mousedown="b_right" v-on:touchend="b_untouch" v-on:mouseup="b_untouch" v-on:mouseout="b_untouch">→</div>
        <div class="bt" v-on:touchstart="b_turnLeft" v-on:mousedown="b_turnLeft" v-on:touchend="b_untouch" v-on:mouseup="b_untouch" v-on:mouseout="b_untouch">L</div>
        <div class="bt" v-on:touchstart="b_turnRight" v-on:mousedown="b_turnRight" v-on:touchend="b_untouch" v-on:mouseup="b_untouch" v-on:mouseout="b_untouch">R</div>
      </div>
      <div class="loginView" v-if="state.loginView">
        <div class="loginTile" v-on:touchstart="login" v-on:mousedown="login">ログイン</div>
        <div class="loginTile" v-on:touchstart="logout" v-on:mousedown="logout">ログアウト</div>
      </div>
      <div id="menu" v-if="state.hamburger">
        <div id="menu_back"></div>
        <div id="menu_area_back"></div>
        <div id="menu_area">
          <div class="menu_tile" v-on:touchstart="tReset" v-on:mousedown="tReset">初手に戻す</div>
          <div class="menu_tile" v-on:touchstart="tInit" v-on:mousedown="tInit">ツモを変えてリセット</div>
          <div class="menu_tile" v-on:touchstart="tCreateGif" v-on:mousedown="tCreateGif">現在手までのGIF画像を作成</div>
          <div class="menu_tile" v-on:touchstart="tTweet" v-on:mousedown="tTweet">ぷよ譜をツイートする</div>
          <div class="menu_tile" v-on:touchstart="tConfig" v-on:mousedown="tConfig">詳細設定</div>
          <div id="chartDescription">現在のぷよ譜↓</div>
          <textarea readonly id="chartArea" v-model="chartURL"></textarea>
          <div id="gifView" v-if="state.gifView">
            <img :src="state.gifSrc" style="margin-top: 10px"></img>
            <div v-if="state.gifSrc==null" style="position: absolute; top: 150px; left: 75px">画像生成中...</div>
            <a id="dl" v-if="state.gifSrc!=null" :href="state.gifSrc" download="chart.gif" style="margin-top: 5px">download</a>
          </div>
        </div>
        <div id="menu_area_tweet" v-if="state.tweetView">
          <div id="menu_area_tweet_desc">リンクをあなたの<br>フォロワーに共有する</div>
          <textarea id="menu_area_tweet_text" v-model="state.tweetText"></textarea>
          <div id="menu_area_tweet_checkarea">
            <input type="checkbox" id="menu_area_tweet_check" v-model="state.tweetChecked" v-on:touchstart="clickTweetCheck">
            現在手までのGIF画像を添付
          </div>
          <button type=button class="menu_area_tweet_button" :class="{tweetProcessing: state.gifProcessing}" v-on:touchstart="bTweet" v-on:mousedown="bTweet">{{(state.gifProcessing)?'画像生成中':'ツイート'}}</button>
        </div>
        <div id="menu_area_config" v-if="state.configView">
          <div id="configCaptionSpeed">連鎖スピード</div>
          <input id="configSpeedBar" type="range" min="1" max="100" step="1" v-model="state.chainSpeed">
          <div id="configSpeedStr">{{state.chainSpeed}}</div>
          <div id="configCaptionRevision">ツモ補正（未実装）</div>
          <div id="configRevision">
            <input type="radio" name="configRevision" v-model="state.revision" value="random" disabled='disabled'>完全ランダム<br>
            <input type="radio" name="configRevision" v-model="state.revision" value="tu" disabled='disabled'>通仕様（128手均等）<br>
            <input type="radio" name="configRevision" v-model="state.revision" value="classic" disabled='disabled'>クラシック仕様（16手均等）
          </div>
          <div id="configSpeedStr">{{state.chainSpeed}}</div>
        </div>
      </div>
    </div>
    <div id="right_content">
      <div class="statisticsArea">
        <div>統計</div>
        <div>最大連鎖：{{state.statisticsMaxChain}}連鎖</div>
        <div>最大同時消し：{{state.statisticsMaxConcurrent}}個</div>
        <div>最大得点：{{state.statisticsMaxScore}}点</div>
      </div>
    </div>
  </div>
</template>

<script>
import store from './store/Store'
import util from './store/libs/puyo/Util'
import Puyo from './store/libs/puyo/Puyo'

// let isPC = navigator.userAgent.indexOf('iPhone') === -1 && navigator.userAgent.indexOf('iPod') === -1 && navigator.userAgent.indexOf('Android') === -1
// console.log('isPC', isPC)

function isClickDownEvent (e) {
  let tapEventType = window.ontouchstart === null ? 'touchstart' : 'mousedown'
  return e.type === tapEventType
}
// function isClickUpEvent (e) {
//   let tapEventType = window.ontouchstart === null ? 'touchend' : 'mouseup'
//   return e.type === tapEventType
// }

// TODO:mvvmに反してるので使わないように修正する
function setTouchStyle (e) {
  e.target.classList.add('b_touched')
}
function setUntouchStyle (e) {
  e.target.classList.remove('b_touched')
}

function puyoXpx (posX) {
  return 32 * (posX - 1)
}
function puyoYpx (posY) {
  return 32 * (13 - posY)
}

function keydown (e) {
  var code = e.keyCode
  switch (code) {
    case 37: // ←キー
      store.moveLeft()
      e.preventDefault()
      return
    case 39: // →キー
      store.moveRight()
      e.preventDefault()
      return
    case 38: // ↑キー
      store.moveTurnPrev()
      e.preventDefault()
      return
    case 40: // ↓キー
      store.setDown()
      e.preventDefault()
      // goBottom()
      return
    case 49: // 1
      store.setEditKind(Puyo.Kind.RED)
      return
    case 50: // 2
      store.setEditKind(Puyo.Kind.GREEN)
      return
    case 51: // 3
      store.setEditKind(Puyo.Kind.BLUE)
      return
    case 52: // 4
      store.setEditKind(Puyo.Kind.YELLOW)
      return
    case 53: // 5
      store.setEditKind(Puyo.Kind.PEKE)
      return
    case 54: // 6
      store.setEditKind(Puyo.Kind.OJAMA)
      return
    case 55: // 7
      store.setEditKind(Puyo.Kind.IRON)
      return
    case 56: // 8
      store.setEditKind(Puyo.Kind.WALL)
      return
    case 88: // x
      store.turnRight()
      return
    case 90: // z
      store.turnLeft()
      return
    case 67: // c
      return
    case 68: // d
      store.debug()
      return
    case 69: // e
      store.pushEditIcon()
      return
    case 78: // n
      store.moveTurnNext()
      return
    case 82: // r
      store.moveTurn(0)
      return
    case 84: // t
      store.init()
      return
  }
}

// TODO: つらい vueらしい方法に変更
function goBottom () {
  setTimeout(function () {
    let el = document.getElementById('chart-area')
    el.scrollTop = el.scrollHeight
  }, 20)
}
goBottom()

// let touchFlag = false
export default {
  name: 'app',
  components: {
    // PuyoField
  },
  mounted: function () {
    this.$ga.page('/')
    document.title = store.state.title
    window.addEventListener('keydown', keydown, false)
    window.addEventListener('touchend', event => {
      if (event.target.type === 'checkbox') return
      if (event.target.type === 'textarea') return
      // console.log(event)
      event.preventDefault()
      // if (touchFlag) {
      //   event.preventDefault()
      // } else {
      //   touchFlag = true
      //   setTimeout(() => {
      //     touchFlag = false
      //   }, 5000)
      // }
      // event.stopPropagation()
      // if (touchFlag) {
      //   event.stopPropagation()
      // } else {
      //   touchFlag = true
      //   setTimeout(() => {
      //     touchFlag = false
      //   }, 300)
      // }
    }, false)
  },
  data: function () {
    return {
      state: store.state
    }
  },
  computed: {
    opsAxisSrc: function () {
      let pp = this.state.nextPuyoPairs[this.state.turn]
      return this.puyoSrc({kind: pp.axis})
    },
    opsSubSrc: function () {
      let pp = this.state.nextPuyoPairs[this.state.turn]
      return this.puyoSrc({kind: pp.sub})
    },
    opsAxisStyle: function () {
      let opsX = this.state.ops.pos.x
      let opsY = this.state.ops.pos.y
      let vi = this.state.ops.available ? 'visible' : 'hidden'
      return 'left:' + puyoXpx(opsX) + 'px; top:' + puyoYpx(opsY) + 'px; visibility:' + vi
    },
    opsSubStyle: function () {
      let subPos = util.subPos(this.state.ops.pos, this.state.ops.dir)
      let vi = this.state.ops.available ? 'visible' : 'hidden'
      return 'left:' + puyoXpx(subPos.x) + 'px; top:' + puyoYpx(subPos.y) + 'px; visibility:' + vi
    },
    nextPuyos: function () {
      let objs = []
      for (let i = 0; i < this.state.nextDisplay.length; i++) {
        let nextLen = this.state.nextPuyoPairs.length
        let nextPos = (this.state.turn + i + 1) % nextLen
        let puyoPair = this.state.nextPuyoPairs[nextPos]
        let axisKind = puyoPair.axis
        let subKind = puyoPair.sub
        if (!this.state.nextDisplay[i].axis) axisKind = Puyo.Kind.WALL
        if (!this.state.nextDisplay[i].sub) subKind = Puyo.Kind.WALL
        objs.push({
          kind: subKind,
          x: 32 * i,
          y: 0
        })
        objs.push({
          kind: axisKind,
          x: 32 * i,
          y: 32
        })
      }
      return objs
    },
    editPuyos: function () {
      let kinds0 = [Puyo.Kind.RED, Puyo.Kind.GREEN, Puyo.Kind.BLUE, Puyo.Kind.YELLOW]
      let kinds1 = [Puyo.Kind.PEKE, Puyo.Kind.OJAMA, Puyo.Kind.IRON, Puyo.Kind.WALL]
      let objs = []
      for (let i = 0; i < this.state.nextDisplay.length; i++) {
        objs.push({
          kind: kinds0[i],
          x: 32 * i,
          y: 0
        })
        objs.push({
          kind: kinds1[i],
          x: 32 * i,
          y: 32
        })
      }
      return objs
    },
    chartURL: function () {
      return 'https://sim.refpuyo.net/#' + this.state.hashStr
    },
    puyoFieldTouchObjs: function () {
      let a = []
      for (let x = 1; x <= 6; x++) {
        for (let y = 1; y <= 13; y++) {
          a.push({
            x: x,
            y: y
          })
        }
      }
      return a
    }
  },
  watch: {
    state: {
      handler: function (obj) {
        // console.log('watch: state changed.')
        document.title = obj.title
      },
      deep: true
    },
    'state.turn': function (turn) {
      let turnTopMin = 32 * (turn)
      let turnTopMax = 32 * (turn + 1)
      let el = document.getElementById('chart-area')
      let elTopMin = el.scrollTop
      let elTopMax = el.scrollTop + 32 * 8
      if (elTopMin > turnTopMin) {
        el.scrollTop = turnTopMin
      }
      setTimeout(function () {
        if (turnTopMax > elTopMax) {
          el.scrollTop = turnTopMax - 32 * 8
        }
      }, 20) // この時点ではまだ生成されてないから苦肉の策
    },
    'state.tweetChecked': function (checked) {
      if (checked) {
        store.createGif()
      }
    }
  },
  methods: {
    b_left: function (e) {
      if (!isClickDownEvent(e)) return
      setTouchStyle(e)
      store.moveLeft()
      // e.stopPropagation()
    },
    b_right: function (e) {
      if (!isClickDownEvent(e)) return
      setTouchStyle(e)
      store.moveRight()
      // e.stopPropagation()
    },
    b_down: function (e) {
      if (!isClickDownEvent(e)) return
      setTouchStyle(e)
      store.setDown()
      // e.stopPropagation()
    },
    b_turnLeft: function (e) {
      if (!isClickDownEvent(e)) return
      setTouchStyle(e)
      store.turnLeft()
      // e.stopPropagation()
    },
    b_turnRight: function (e) {
      if (!isClickDownEvent(e)) return
      setTouchStyle(e)
      store.turnRight()
      // e.stopPropagation()
    },
    b_untouch: function (e) {
      setUntouchStyle(e)
    },
    b_chart: function (e, i) {
      if (!isClickDownEvent(e)) return
      store.moveTurn(i)
    },
    b_prev: function (e) {
      if (!isClickDownEvent(e)) return
      store.moveTurnPrev()
      // e.stopPropagation()
    },
    b_next: function (e) {
      if (!isClickDownEvent(e)) return
      store.moveTurnNext()
      // e.stopPropagation()
    },
    b_debug: function (e) {
      if (!isClickDownEvent(e)) return
    },
    bTweet: function (e) {
      if (!isClickDownEvent(e)) return
      store.tweet()
      // e.stopPropagation()
    },
    puyoSrc: function (obj) {
      if (obj.state === 'extinction') return require('./assets/puyo_c.png')
      switch (obj.kind) {
        case Puyo.Kind.RED:
          return require('./assets/puyo_r.png')
        case Puyo.Kind.GREEN:
          return require('./assets/puyo_g.png')
        case Puyo.Kind.BLUE:
          return require('./assets/puyo_b.png')
        case Puyo.Kind.YELLOW:
          return require('./assets/puyo_y.png')
        case Puyo.Kind.OJAMA:
          return require('./assets/puyo_o.png')
        case Puyo.Kind.IRON:
          return require('./assets/puyo_i.png')
        case Puyo.Kind.WALL:
          return require('./assets/wall01.png')
        case Puyo.Kind.PEKE:
          return require('./assets/peke.png')
      }
      return require('./assets/puyo_c.png')
    },
    puyoHistoryAxisSrc: function (obj, index) {
      let pp = this.state.nextPuyoPairs[index]
      return this.puyoSrc({kind: pp.axis})
    },
    puyoHistorySubSrc: function (obj, index) {
      let pp = this.state.nextPuyoPairs[index]
      return this.puyoSrc({kind: pp.sub})
    },
    puyoStyle: function (obj) {
      let vi = (obj.kind === Puyo.Kind.BRANK && obj.state !== 'extinction') ? 'hidden' : 'visible'
      return 'left:' + puyoXpx(obj.pos.x) + 'px; top:' + puyoYpx(obj.pos.y) + 'px; visibility:' + vi
    },
    nextPuyoStyle: function (obj) {
      let vi = (obj.kind === Puyo.Kind.BRANK && obj.state !== 'extinction') ? 'hidden' : 'visible'
      return 'left:' + obj.x + 'px; top:' + obj.y + 'px; visibility:' + vi
    },
    toggleNext: function (e, index) { // TODO: index を使うのは妥協なので、良い方法を考える
      if (!isClickDownEvent(e)) return
      store.toggleNextDisplay(Math.floor(index / 2), (index % 2) === 1)
    },
    hamburger: function (e) {
      if (!isClickDownEvent(e)) return
      store.toggleHamburger()
    },
    tInit: function (e) {
      if (!isClickDownEvent(e)) return
      store.init()
      store.toggleHamburger()
    },
    tReset: function (e) {
      if (!isClickDownEvent(e)) return
      store.moveTurn(0)
      store.toggleHamburger()
    },
    tCreateGif: function (e) {
      if (!isClickDownEvent(e)) return
      store.openGifView()
      store.createGif()
    },
    tTweet: function (e) {
      if (!isClickDownEvent(e)) return
      // e.preventDefault()
      store.openTweetView()
    },
    tConfig: function (e) {
      if (!isClickDownEvent(e)) return
      store.openConfigView()
    },
    login: function (e) {
      if (!isClickDownEvent(e)) return
      store.login()
    },
    logout: function (e) {
      if (!isClickDownEvent(e)) return
      store.logout()
      store.toggleLoginView()
    },
    clickTweetCheck: function (e) {
      if (!isClickDownEvent(e)) return
      e.toElement.checked = !e.toElement.checked
    },
    pushEditIcon: function (e) {
      if (!isClickDownEvent(e)) return
      store.pushEditIcon()
    },
    puyoFieldTouch: function (e, obj) {
      if (!isClickDownEvent(e)) return
      store.fieldClick(obj.x, obj.y)
    },
    puyoFieldTouchStyle: function (obj) {
      let s = 'position: absolute;'
      s += ' top: ' + (13 - obj.y) * 32 + 'px;'
      s += ' left: ' + (obj.x - 1) * 32 + 'px;'
      s += ' width: 32px;'
      s += ' height: 32px;'
      return s
    },
    editPuyoTouch: function (e, obj) {
      if (!isClickDownEvent(e)) return
      store.setEditKind(obj.kind)
    },
    editPuyoTouchStyle: function (obj) {
      let s = 'position: absolute;'
      s += ' top: ' + (obj.y) + 'px;'
      s += ' left: ' + (obj.x) + 'px;'
      s += ' width: 28px;'
      s += ' height: 28px;'
      if (obj.kind === this.state.editKind) s += ' border: solid 2px #ff0000;'
      return s
    },
    editChartLeft: function (e, index) {
      if (!isClickDownEvent(e)) return
      store.editNextAxis(index)
    },
    editChartRight: function (e, index) {
      if (!isClickDownEvent(e)) return
      store.editNextSub(index)
    },
    loginClick: function (e) {
      if (!isClickDownEvent(e)) return
      store.toggleLoginView()
    }
  }
}
</script>

<style>
#app {
  margin: 0;
  position: relative;
  display: flex;
  justify-content: center;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#main_content {
  margin: 0;
  width: 320px;
  max-width: 320px;
  min-width: 320px;
}

#left_content {
  margin: 0;
  min-width: 0px;
  width: 320px;
}

#right_content {
  margin: 0;
  min-width: 0px;
  width: 320px;
}

#keyboard-description {
  margin-top: 30px;
  margin-left: 20px;
  width: 260px;
  background-color: #aaffaa;
}

#top {
  margin: 0;
  position: relative;
  width: 320px;
  height: 30px;
}

#login {
  position: absolute;
  top: 3px;
  left: 20px;
  color: #aaaaaa;
  font-weight: bold;
  font-size: 10px;
  line-height: 12px;
  text-align: left;
}

#login-wait {
  position: absolute;
  top: 3px;
  left: 20px;
  color: #aaaaaa;
  font-weight: bold;
  font-size: 14px;
}

#logout {
  position: absolute;
  top: 3px;
  left: 20px;
  color: #0a3bff;
  font-weight: bold;
  font-size: 14px;
}

.loginTriangle{
  position: absolute;
	width: 0;
	height: 0;
  top: 8px;
  left: 4px;
	border: 6px solid transparent;
	border-top: 14px solid #666666;
}

#status {
  color: #666666;
  font-weight: bold;
  font-size: 14px;
  line-height: 28px;
}


#hun {
  position: absolute;
  top: 0px;
  left: 288px;
}

.openHamburger {
  background-color:#bbcccc;
}

#editIcon {
  position: absolute;
  top: 0px;
  left: 256px;
}

.editIconActive {
  background-color:#bbcccc;
}

#mid {
  margin: 0;
  position: relative;
  display: flex;
  width: 320px;
  height: 416px;
}

#bottom {
  margin: 0;
  position: relative;
  width: 320px;
  height: 200px;
}

#puyo-field {
  margin: 0;
  position: relative;
  width: 192px;
  height: 416px;
}

#sub-field {
  margin: 0;
  position: relative;
  width: 128px;
  height: auto;
  background-color:aliceblue;
}

#next-area {
  margin: 0;
  position: relative;
  width: 128px;
  height: 64px;
  background-color: #999999;
}

#ojama-image-area {
  margin: 0;
  position: relative;
  width: 128px;
  height: 32px;
  background-color: #666666;
}

#info-area {
  margin: 0;
  position: relative;
  width: 128px;
  height: 64px;
  background-color: #e0fcf9;
}

#turn-view {
  margin: 0;
  position: relative;
  width: 128px;
  height: 20px;
}

#chain-view {
  margin: 0;
  position: relative;
  width: 128px;
  height: 20px;
}

#score-view {
  margin: 0;
  position: relative;
  width: 128px;
  height: 20px;
}

#chart-area {
  margin: 0;
  position: relative;
  overflow: auto;
  width: 128px;
  height: 256px;
  background-color: #aabbcc;
  -ms-overflow-style: none;
}
#chart-area::-webkit-scrollbar {
  display: none;
}

.chart-tile {
  margin: 0;
  position: relative;
  width: 126px;
  height: 30px;
  border: inset 1px;
  background-color: #ddeedd;
}

.activeTile {
  background-color: #ffdc5e;
  border-color: #ffd400;
}

.chart-num {
  margin: 0;
  position: absolute;
  left: 2px;
  top: 4px;
}

.chart-pos {
  margin: 0;
  position: absolute;
  left: 95px;
  top: 4px;
}

.chart-dir {
  margin: 0;
  position: absolute;
  left: 110px;
  top: 4px;
}

#ops-axis {
  margin: 0;
  position: absolute;
  width: 32px;
  height: 32px;
}

#ops-sub {
  margin: 0;
  position: absolute;
  width: 32px;
  height: 32px;
}

.puyo {
  margin: 0;
  position: absolute;
  width: 32px;
  height: 32px;
}

.bt {
  margin: 0;
  display: inline-block;
  -webkit-tap-highlight-color:rgba(0,0,0,0);
  width: 60px;
  height: 50px;
  line-height: 50px;
  background: #ffe5ce;
  border-radius: 10px;
  box-shadow: 1px 1px 1px rgba(0,0,0,0.2);
}

.b_touched {
  background: #88e3e2;
}

#menu {
  margin: 0 auto;
  position: absolute;
  top: 30px;
  width: 320px;
  height: 416px;
}

#menu_back {
  margin: 0;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 320px;
  height: 416px;
  background-color:#000000;
  opacity: 0.5
}

#menu_area_back {
  margin: 0;
  position: absolute;
  top: 30px;
  left: 30px;
  width: 260px;
  height: 356px;
  background-color:#ffffff;
  opacity: 0.8
}

#menu_area_tweet {
  margin: 0;
  position: absolute;
  top: 30px;
  left: 30px;
  width: 260px;
  height: 356px;
  background-color:#eeeeee;
}

#menu_area_tweet_desc {
  margin: 20px;
  margin-top: 50px;
  position: relative;
  width: auto;
  font-size: 20px;
  font-weight: bold;
  text-align: left;
}

#menu_area_tweet_text {
  position: relative;
  width: 200px;
  height: 80px;
  border:2px solid #6ea5c8;
  border-radius: 4px;
}

#menu_area_tweet_checkarea {
  position: relative;
  margin-top: 5px;
  font-size: 16px;
}

.menu_area_tweet_button {
  position: absolute;
  left: 130px;
  top: 270px;
  width: 100px;
  height: 40px;
  border-radius: 20px;
  background-color: #4999f0;
  color: #fff;
  border-style: none;
  font-size: 14px;
  font-weight: bold;
}

.tweetProcessing {
  background-color: #888888;
}

#menu_area_config {
  margin: 0;
  position: absolute;
  top: 30px;
  left: 30px;
  width: 260px;
  height: 356px;
  background-color:#eeeeee;
}

#configCaptionSpeed {
  margin: 0;
  position: absolute;
  font-size: 14px;
  top: 10px;
  left: 20px;
}

#configSpeedBar {
  margin: 0;
  position: absolute;
  top: 30px;
  left: 60px;
}

#configSpeedStr {
  margin: 0;
  position: absolute;
  top: 30px;
  left: 210px;
}

#configCaptionRevision {
  margin: 0;
  position: absolute;
  font-size: 14px;
  top: 60px;
  left: 20px;
}

#configRevision {
  margin: 0;
  position: absolute;
  font-size: 14px;
  top: 85px;
  left: 40px;
  text-align: left;
}

#menu_area {
  margin: 0;
  position: absolute;
  top: 30px;
  left: 30px;
  width: 260px;
  height: 356px;
}

.menu_tile {
  margin: 20px;
  position: relative;
  width: 220px;
  height: 30px;
  line-height: 30px;
  background-color:#ef9564;
}

#gifView {
  margin: 0;
  position: absolute;
  top: -55px;
  left: 10px;
  width: 240px;
  height: 460px;
  background-color:#ffffff;
}

#chartArea {
  position: absolute;
  resize: none;
  top: 300px;
  left: 20px;
  width: 220px;
  height: 30px;
}

#chartDescription {
  position: absolute;
  top: 270px;
  left: 20px;
}

.leftEditChart {
  position: absolute;
  height: 32px;
  width: 32px;
  left: 28px;
}

.rightEditChart {
  position: absolute;
  height: 32px;
  width: 32px;
  left: 60px;
}

.loginView {
  position: absolute;
  margin: 0 auto;
  top: 30px;
  width: 100px;
  height: 75px;
  background-color: #b5d1ff;
  opacity: 0.92;
}

.loginTile {
  position: relative;
  margin: 5px;
  width: 90px;
  height: 30px;
  background-color: #ffffff;
  line-height: 30px;
  font-size: 16px;
  font-weight: bold;
  opacity: 0.92;
}

.statisticsArea {
  position: relative;
  margin-top: 30px;
  margin-left: 20px;
  width: 180px;
  height: 200px;
  background-color: #ccdfff;
}
</style>
