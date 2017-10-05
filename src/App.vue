<template>
  <div id="app">
    <div id="top">
    </div>
    <div id="left">
      <puyo-field></puyo-field>
    </div>
    <div id="right">
      <div id="dummy">{{state.title}}</div>
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
import PuyoField from './components/PuyoField'

function isClickDownEvent (e) {
  let tapEventType = window.ontouchstart === null ? 'touchstart' : 'mousedown'
  return e.type === tapEventType
}
// function isClickUpEvent (e) {
//   let tapEventType = window.ontouchstart === null ? 'touchend' : 'mouseup'
//   return e.type === tapEventType
// }

function setTouchStyle (e) {
  e.target.classList.add('b_touched')
}
function setUntouchStyle (e) {
  e.target.classList.remove('b_touched')
}

export default {
  name: 'app',
  components: {
    PuyoField
  },
  data: function () {
    return {
      state: store.state
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
      store.setTitle('left')
    },
    b_right: function (e) {
      if (!isClickDownEvent(e)) return
      setTouchStyle(e)
      store.setTitle('right')
    },
    b_down: function (e) {
      if (!isClickDownEvent(e)) return
      setTouchStyle(e)
      store.setTitle('down')
    },
    b_turnLeft: function (e) {
      if (!isClickDownEvent(e)) return
      setTouchStyle(e)
      store.setTitle('tl')
    },
    b_turnRight: function (e) {
      if (!isClickDownEvent(e)) return
      setTouchStyle(e)
      store.setTitle('tr')
    },
    b_untouch: function (e) {
      setUntouchStyle(e)
    }
    // b_touchend: function (e) {
    //   console.log(e.target)
    //   console.log('touch end!')
    //   if (!isClickUpEvent(e)) return
    //   clickUp(e)
    // },
    // b_mousedown: function (e) {
    //   console.log(e.target)
    //   console.log('mouse down!')
    //   if (!isClickDownEvent(e)) return
    //   clickDown(e)
    // },
    // b_mouseup: function (e) {
    //   console.log(e.target)
    //   console.log('mouse up!')
    //   if (!isClickUpEvent(e)) return
    //   clickUp(e)
    // },
    // b_mouseout: function (e) {
    //   // console.log(e.target)
    //   // console.log('mouse out!')
    // }
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

#left {
  margin: 0;
  position: absolute;
  width: 192px;
  height: 416px;
  left: 0;
  background-color:burlywood;
}

#right {
  margin: 0;
  position: absolute;
  width: 128px;
  height: 416px;
  left: 192px;
  background-color:aliceblue;
}

#bottom {
  margin: 0;
  position: absolute;
  width: 320px;
  height: auto;
  top: 446px;
  background-color:aliceblue;
}

#dummy {
  margin: 0;
  position: relative;
  width: 128px;
  height: 100px;
  background-color:cadetblue;
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
