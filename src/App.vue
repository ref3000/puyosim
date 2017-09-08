<template>
  <div id="app">
    <img src="./assets/logo.png">
    <hello></hello>
    <field></field>
  </div>
</template>

<script>
import Test from './assets/test.js'
import Field from './components/Field'

export default {
  name: 'app',
  components: {
    Field
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #ffff00;
  margin-top: 60px;
}
</style>
