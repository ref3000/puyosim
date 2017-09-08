<template>
  <div class="field">
    {{ msg }}
  </div>
</template>

<script>
export default {
  name: 'field',
  data () {
    return {
      msg: 'Welcome to ゆあー Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.field {
  background-color: #ff0000
}
</style>
