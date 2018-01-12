<template>
<v-app>
  <navivation-drawer :ping='showNavigation' />
  <div class='main-container'>
    <div class="top-bar">
      <v-tabs centered>
        <ticker-component />

        <v-toolbar dark class='top-toolbar'>
          <v-toolbar-side-icon @click='showDrawer'></v-toolbar-side-icon>
          <v-toolbar-title>{{pageTitle()}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="showGitHub">
            <v-icon>fa-github</v-icon>
          </v-btn>
          <v-tabs-bar slot="extension">
            <v-tabs-slider color="white"></v-tabs-slider>
            <v-tabs-item to='/' class="white--text">
              <v-icon>&#xE88A;</v-icon>
            </v-tabs-item>
            <v-tabs-item to='/buytoken' class=" white--text ">
              <v-icon>&#xE851;</v-icon>
            </v-tabs-item>
            <v-tabs-item to='/trades' class="white--text ">
              <v-icon>&#xE8C9;</v-icon>
            </v-tabs-item>
            <v-tabs-item to='/token' class="white--text ">
              <v-icon>&#xE263;</v-icon>
            </v-tabs-item>
          </v-tabs-bar>
        </v-toolbar>
      </v-tabs>
    </div>

    <div class='app-content'>
      <div class='router-container '>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </div>
      <div class='app-console'>
        <div class='console-bar'>
          <v-btn small @click='clearLog()'>Clear</v-btn>
        </div>
        <div class='output-container' v-html='consoleOutput'></div>
      </div>
    </div>

    <!-- <footer-component publicKey='GBRKGAEJ7NLGCSF66Q5HZIG7OCKUOKF3N2POSDDGS2VPIWZQCA5HGP3V' /> -->
    <!-- <footer-component publicKey='GCYQSB3UQDSISB5LKAL2OEVLAYJNIR7LFVYDNKRMLWQKDCBX4PU3Z6JP' /> -->
  </div>

  <v-snackbar :timeout="500" :multi-line=false :vertical=true v-model="snackbarModel">
    {{snackbarText}}
    <v-btn small dark flat @click.native="snackbarModel=false">Close</v-btn>
  </v-snackbar>
</v-app>
</template>

<script>
import NavigationDrawer from './components/NavigationDrawer.vue'
import TickerComponent from './components/TickerComponent.vue'
import FooterComponent from './components/FooterComponent.vue'
import Helper from './js/helper.js'
import $ from 'jquery'
const shell = require('electron').shell

export default {
  components: {
    'ticker-component': TickerComponent,
    'footer-component': FooterComponent,
    'navivation-drawer': NavigationDrawer
  },
  data() {
    return {
      showNavigation: false,
      consoleOutput: '',
      snackbarText: '',
      snackbarModel: false
    }
  },
  mounted() {
    Helper.vue().$on('console', this.log)
  },
  methods: {
    showGitHub() {
      shell.openExternal('https://github.com/StellarKit')
    },
    showDrawer() {
      this.showNavigation = !this.showNavigation
    },
    log(output) {
      this.consoleOutput += output + '<br>'

      this.scrollToEnd()
    },
    scrollToEnd(delay = 250) {
      this.$nextTick(() => {
        $('.output-container').animate({
          scrollTop: $('.output-container')[0].scrollHeight
        }, delay)
      })
    },
    clearLog() {
      this.consoleOutput = ''
    },
    toast(message) {
      this.snackbarText = message
      this.snackbarModel = !this.snackbarModel
    },
    pageTitle() {
      return this.$router.currentRoute.name
    }
  }
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
}

#app {
    height: 100%;
}
</style>

<style scoped lang='scss'>
.main-container {
    display: flex;
    flex: 1;
    flex-direction: column;

    .top-bar {
        width: 100%;
        box-shadow: 0 1px 12px rgba(0,0,0,.5);

        .top-toolbar {
            background: linear-gradient(to bottom, rgb(55,55,55) , rgb(22,22,22));
        }
    }

    .app-content {
        display: flex;
        width: 100%;
        flex: 1;

        flex-direction: column;

        .router-container {
            width: 100%;
            overflow-y: auto;
        }

        .app-console {
            position: relative;
            display: flex;
            flex: 1 1 300px;
            background: red;
            border-top: solid 2px black;

            .console-bar {
                display: flex;
                justify-content: flex-end;
                position: absolute;
                top: 0;
                left: 0;
                right: 20px;
            }

            .output-container {
                width: 100%;
                font-size: 0.8em;
                background: rgb(0,20,0);
                overflow-y: auto;
                color: rgb(0,256,150);
                padding: 10px;
            }
        }
    }
}
</style>
