<template>
<div>
  <div class='output-container' v-html='consoleOutput'></div>

  <v-snackbar :timeout="500" :multi-line=false :vertical=true v-model="snackbarModel">
    {{snackbarText}}
    <v-btn dark flat @click.native="snackbarModel = false">Close</v-btn>
  </v-snackbar>
</div>
</template>

<script>
export default {
  props: ['consoleOutput', 'snackbarText'],
  data() {
    return {
      snackbarModel: false
    }
  },
  watch: {
    snackbarPing: function () {
      this.snackbarModel = true
    }
  },
  methods: {
    // kkkkkkkkkkkk
  }
}
</script>

<style scoped lang='scss'>
.output-container {
    width: 100%;
    height: 100%;
    overflow: auto;
    color: rgb(0,256,150);
    background: rgb(75,75,75);
    padding: 10px;
    border: solid 2px black;
    min-height: 300px;
}
</style>
