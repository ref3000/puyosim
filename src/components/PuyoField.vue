<template>
  <div class="puyoField">
    <div>{{ state }}</div>
  </div>
</template>

<script>
import store from '../store/Store'

export default {
  name: 'puyo-field',
  data: function () {
    return {
      state: store.state
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.puyoField {
  width: 192px;
  height: 416px;
  background-image: url("../assets/puyo_field_back.png")
}
</style>
