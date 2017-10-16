<template>
  <div id="app">
    <div id="left_content">
      <div id="keyboard-description">
        <div id="keyboar-description-title">キーボード操作</div>
        <ul>
          <li>[←][→]：左右移動</li>
          <li>[Z][X]：左右回転</li>
          <li>[↓]：設置</li>
          <li>[↑]：１手戻る</li>
          <li>[N]：１手進む</li>
          <li>[R]：初手に戻る</li>
          <li>[T]：ツモを変えてリセット</li>
        </ul>
      </div>
    </div>
    <div id="main_content">
      <div id="top">
        <div id="login-wait" v-if="state.isLoginWait">確認中...</div>
        <div id="login" @click="login" v-if="!state.isLogin && !state.isLoginWait">ログイン</div>
        <div id="logout" @click="logout" v-if="state.isLogin && !state.isLoginWait">{{state.userName}}</div>
        <img id="hun" :class="{openHamburger: state.hamburger}" src="./assets/hun02.png" v-on:touchstart="hamburger" v-on:mousedown="hamburger"></img>
      </div>
      <div id="mid">
        <img id="puyo-field" src="./assets/puyo_field_back.png">
          <img class="puyo" :src='opsAxisSrc' :style='opsAxisStyle'></img>
          <img class="puyo" :src='opsSubSrc' :style='opsSubStyle'></img>
        </img>
        <img class="puyo" v-for="obj in state.puyoObjs" :src='puyoSrc(obj)' :style='puyoStyle(obj)'>
        </img>
        <div id="sub-field">
          <div id="next-area">
            <img class="puyo" v-for="(obj, index) in nextPuyos" :src='puyoSrc(obj)' :style='nextPuyoStyle(obj)' v-on:touchstart="toggleNext($event, index)" v-on:mousedown="toggleNext($event, index)">
          </div>
          <div id="ojama-image-area">
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
              <div class="chart-num">{{index + 1}}</div>
              <img class="puyo" :src='puyoHistoryAxisSrc(obj, index)' style="left: 28px">
              <img class="puyo" :src='puyoHistorySubSrc(obj, index)' style='left: 60px'>
              <div class="chart-pos">{{(obj.x>0&&obj.x<7)?obj.x:''}}</div>
              <div class="chart-dir">{{(obj.dir===0)?'↑':(obj.dir===1)?'→':(obj.dir===2)?'↓':(obj.dir===3)?'←':''}}</div>
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
      <div id="menu" v-if="state.hamburger">
        <div id="menu_back"></div>
        <div id="menu_area_back"></div>
        <div id="menu_area">
          <div class="menu_tile" v-on:touchstart="tReset" v-on:mousedown="tReset">初手に戻す</div>
          <div class="menu_tile" v-on:touchstart="tInit" v-on:mousedown="tInit">ツモを変えてリセット</div>
          <div class="menu_tile" v-on:touchstart="tCreateGif" v-on:mousedown="tCreateGif">現在手までのGIF画像を作成</div>
          <div class="menu_tile" v-on:touchstart="tTweet" v-on:mousedown="tTweet">ぷよ譜をツイートする</div>
          <div class="menu_tile" v-on:touchstart="tAbout" v-on:mousedown="tAbout">About</div>
          <div id="chartDescription">現在のぷよ譜↓</div>
          <textarea readonly id="chartArea" v-model="chartURL"></textarea>
          <div id="gifView" v-if="state.gifView">
            <img :src="state.gifSrc" style="margin-top: 10px"></img>
            <div v-if="state.gifSrc==null" style="position: absolute; top: 150px; left: 75px">画像生成中...</div>
            <a id="dl" v-if="state.gifSrc!=null" :href="state.gifSrc" download="chart.gif" style="margin-top: 5px">download</a>
          </div>
        </div>
      </div>
    </div>
    <div id="right_content">
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
      goBottom()
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
      // store.debug()
      return
    case 69: // e
      // console.log(store.state)
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

export default {
  name: 'app',
  components: {
    // PuyoField
  },
  mounted: function () {
    document.title = store.state.title
    window.addEventListener('keydown', keydown, true)
    // window.addEventListener('touchend', event => {
    //   event.preventDefault()
    // }, false)
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
    chartURL: function () {
      return 'https://sim.refpuyo.net/#' + this.state.hashStr
    }
  },
  watch: {
    state: {
      handler: function (obj) {
        console.log('watch: state changed.')
        document.title = obj.title
      },
      deep: true
    }
  },
  methods: {
    b_left: function (e) {
      if (!isClickDownEvent(e)) return
      setTouchStyle(e)
      store.moveLeft()
    },
    b_right: function (e) {
      if (!isClickDownEvent(e)) return
      setTouchStyle(e)
      store.moveRight()
    },
    b_down: function (e) {
      if (!isClickDownEvent(e)) return
      setTouchStyle(e)
      store.setDown()
      goBottom()
    },
    b_turnLeft: function (e) {
      if (!isClickDownEvent(e)) return
      setTouchStyle(e)
      store.turnLeft()
    },
    b_turnRight: function (e) {
      if (!isClickDownEvent(e)) return
      setTouchStyle(e)
      store.turnRight()
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
    },
    b_next: function (e) {
      if (!isClickDownEvent(e)) return
      store.moveTurnNext()
    },
    b_debug: function (e) {
      if (!isClickDownEvent(e)) return
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
        case Puyo.Kind.WALL:
          return require('./assets/wall01.png')
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
      store.closeGifView()
      store.closeChartView()
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
      store.tweet('てすと\n' + this.chartURL, false)
    },
    tAbout: function (e) {
      if (!isClickDownEvent(e)) return
    },
    tDownload: function (e) {
      let content = 'あいうえお'
      let blob = new Blob([content], {'type': 'text/plain'})
      console.log(blob)
      console.log(window.navigator.msSaveBlob)
      console.log(window.URL)
      console.log(window.URL.createObjectURL(blob))
      if (window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(blob, 'test.txt')
        window.navigator.msSaveOrOpenBlob(blob, 'test.txt')
      } else {
        document.getElementById('download').href = window.URL.createObjectURL(blob)
      }
    },
    login: function () {
      store.login()
    },
    logout: function () {
      store.logout()
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
  margin-left: 100px;
  width: 200px;
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
  left: 5px;
  color: #0a3bff;
  font-weight: bold;
  font-size: 14px;
}

#login-wait {
  position: absolute;
  top: 3px;
  left: 5px;
  color: #aaaaaa;
  font-weight: bold;
  font-size: 14px;
}

#logout {
  position: absolute;
  top: 3px;
  left: 5px;
  color: #0a3bff;
  font-weight: bold;
  font-size: 14px;
}

#hun {
  position: absolute;
  top: 0px;
  left: 288px;
}

.openHamburger {
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

</style>
