<template>
  <div id="app">
    <div id="top">
    </div>
    <div id="mid">
      <img id="puyo-field" src="./assets/puyo_field_back.png">
        <img class="puyo" :src='opsAxisSrc' :style='opsAxisStyle'></img>
        <img class="puyo" :src='opsSubSrc' :style='opsSubStyle'></img>
      </img>
      <img class="puyo" v-for="obj in state.puyoObjs" :src='puyoSrc(obj)' :style='puyoStyle(obj)'>
      </img>
      <div id="sub-field">
        <div id="dummy">{{state.title}}</div>
      </div>
    </div>
    <div id="bottom">
      <div class="bt" v-on:touchstart="b_left" v-on:mousedown="b_left" v-on:touchend="b_untouch" v-on:mouseup="b_untouch" v-on:mouseout="b_untouch">←</div>
      <div class="bt" v-on:touchstart="b_down" v-on:mousedown="b_down" v-on:touchend="b_untouch" v-on:mouseup="b_untouch" v-on:mouseout="b_untouch">↓</div>
      <div class="bt" v-on:touchstart="b_right" v-on:mousedown="b_right" v-on:touchend="b_untouch" v-on:mouseup="b_untouch" v-on:mouseout="b_untouch">→</div>
      <div class="bt" v-on:touchstart="b_turnLeft" v-on:mousedown="b_turnLeft" v-on:touchend="b_untouch" v-on:mouseup="b_untouch" v-on:mouseout="b_untouch">L</div>
      <div class="bt" v-on:touchstart="b_turnRight" v-on:mousedown="b_turnRight" v-on:touchend="b_untouch" v-on:mouseup="b_untouch" v-on:mouseout="b_untouch">R</div>
    </div>
  </div>
</template>

<script>
import store from './store/Store'
import util from './store/libs/puyo/Util'
import Puyo from './store/libs/puyo/Puyo'

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
      e.preventDefault()
      return
    case 40: // ↓キー
      store.setDown()
      e.preventDefault()
      return
    case 88: // x
      store.turnRight()
      e.preventDefault()
      return
    case 90: // z
      store.turnLeft()
      e.preventDefault()
      return
    case 67: // c
      return
    case 68: // d
      return
  }
}
export default {
  name: 'app',
  components: {
    // PuyoField
  },
  mounted: function () {
    window.addEventListener('keydown', keydown, true)
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
      return 'left:' + puyoXpx(opsX) + 'px; top:' + puyoYpx(opsY) + 'px'
    },
    opsSubStyle: function () {
      let subPos = util.subPos(this.state.ops.pos, this.state.ops.dir)
      return 'left:' + puyoXpx(subPos.x) + 'px; top:' + puyoYpx(subPos.y) + 'px'
    }
  },
  watch: {
    state: {
      handler: function (obj) {
        console.log('watch: state changed.')
        document.title = obj.title
      },
      deep: true
    },
    title: function (v) {
      console.log(v)
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
    puyoSrc: function (obj) {
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
          return require('./assets/puyo_c.png') // TODO: 画像作成
      }
      return require('./assets/puyo_c.png')
    },
    puyoStyle: function (obj) {
      let vi = (obj.kind === Puyo.Kind.BRANK) ? 'hidden' : 'visible'
      return 'left:' + puyoXpx(obj.pos.x) + 'px; top:' + puyoYpx(obj.pos.y) + 'px; visibility:' + vi
    }
  }
}
</script>

<style>
#app {
  margin: 0;
  position: relative;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #eeeeee;
}

#top {
  margin: 0;
  position: relative;
  width: 320px;
  height: 30px;
  background-color:azure;
}

#mid {
  margin: 0;
  position: relative;
  display: flex;
  width: 320px;
  height: 416px;
  background-color:azure;
}

#bottom {
  margin: 0;
  position: relative;
  width: 320px;
  height: 200px;
  background-color:aliceblue;
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
  height: 40px;
  background: #e4e3e2;
  border-radius: 10px;
  box-shadow: 1px 1px 1px rgba(0,0,0,0.2);
}

.b_touched {
  background: #88e3e2;
}

@media screen and (min-width:480px){
  #app {
    background-color: #aa0000
  }
}
@media screen and (min-width:768px){
  #app {
    background-color: #00aa00
  }
}
@media screen and (min-width:1024px){
  #app {
    background-color: #0000aa
  }
}
</style>
