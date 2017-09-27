<template>
  <div id="app">
    <div id="left">
      <puyo-field></puyo-field>
    </div>
    <div id="right">
      <div id="dummy">{{state.message}}</div>
      <div class="bt" v-on:touchstart="greet" v-on:click="greet">Greet</div>
      <div class="bt" v-on:touchstart="greet" v-on:click="greet">Greet</div>
      <div class="bt" v-on:touchstart="greet" v-on:click="greet">Greet</div>
      <div class="bt" v-on:touchstart="greet" v-on:click="greet">Greet</div>
      <div class="bt" v-on:touchstart="greet" v-on:click="greet">Greet</div>
      <div class="bt" v-on:touchstart="greet" v-on:click="greet">Greet</div>
    </div>
    <div id="bottom">
      <div class="bt" v-on:touchstart="greet" v-on:click="greet">Greet</div>
      <div class="bt" v-on:touchstart="greet" v-on:click="greet">Greet</div>
      <div class="bt" v-on:touchstart="greet" v-on:click="greet">Greet</div>
      <div class="bt" v-on:touchstart="greet" v-on:click="greet">Greet</div>
      <div class="bt" v-on:touchstart="greet" v-on:click="greet">Greet</div>
      <div class="bt" v-on:touchstart="greet" v-on:click="greet">Greet</div>
    </div>
  </div>
</template>

<script>
import store from './store/Store'
import PuyoField from './components/PuyoField'

function isTouchEvent (e) {
  let tapEventType = window.ontouchstart === null ? 'touchstart' : 'click'
  return e.type === tapEventType
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
  methods: {
    greet: function (e) {
      if (!isTouchEvent(e)) return
      store.setMessage('wa-i')
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
  width: 128px;
  height: auto;
  top: 416px;
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
  border-radius: 10px 10px 10px 10px / 10px 10px 10px 10px;
  width: 95px;
  height: 40px;
  background-color: #ff0000
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
