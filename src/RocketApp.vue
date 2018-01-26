<template>
<v-app>
  <div class='window-wrapper'>
    <xlm-rocket />
  </div>
</v-app>
</template>

<script>
import XLMRocket from './components/XLMRocket.vue'

export default {
  components: {
    'xlm-rocket': XLMRocket
  },
  data() {
    return {}
  },
  methods: {}
}
</script>

<style>
@import url(https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons);
@import url(https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css);

@import '../node_modules/vuetify/dist/vuetify.min.css'
</style>

<style lang='scss'>
// gets rid of scrollbars on desktop
body,
html {
    overflow: hidden;
    height: 100%;
    width: 100%;

    background: transparent;
}

#app {
    height: 100%;
    background: transparent;
}
</style>

<style scoped lang='scss'>
.window-wrapper {
    position: relative;
    margin: 30px;
    box-shadow: 0 0 30px rgba(0,0,0,.2), 0 22px 20px -19px rgba(0,0,0,.4);
    border-radius: 8px;
    overflow: hidden;
    border: solid 2px rgb(255,255,255);
}
</style>
