<template>
<div class='rocket-main'>
  <div class='rocket-sidebar'>
    <v-btn @click.native='buttonClick("menu")' icon dark>
      <v-icon small>menu</v-icon>
    </v-btn>
  </div>

  <div class='rocket-content'>
    <div v-if="dialogMode === 'main'">
      Main
      <div class='rocket-list' v-for="item in balances" :key="item.title" @click="buttonClick(item.cmd)">
        <div>{{ item.title }}</div>
      </div>
    </div>

    <div v-else-if="dialogMode === 'balances'">
      Balances
    </div>
    <div v-else-if="dialogMode === 'ticker'">
      <ticker-component />
    </div>
  </div>

  <div v-if='showMenu' class='overlay-menu' @click='showMenu = false'>
    <v-btn small round @click.native='buttonClick("ticker")'>
      <v-icon>monetization_on</v-icon>Ticker
    </v-btn>
    <v-btn small round @click.native='buttonClick("balances")'>
      <v-icon>account_balance</v-icon> Send
    </v-btn>
    <v-btn small round @click.native='buttonClick("quit")'>
      <v-icon>account_balance</v-icon> Quit
    </v-btn>
  </div>

</div>
</template>

<script>
import Helper from '../js/helper.js'
import TickerComponent from './TickerComponent.vue'

export default {
  components: {
    'ticker-component': TickerComponent
  },
  data() {
    return {
      showMenu: false,
      dialogMode: 'main',
      status: '',
      balances: [{
        title: '4221.98332',
        cmd: 'balance'
      }, {
        title: '4221.98382',
        cmd: 'balance'
      }, {
        title: '221.98332',
        cmd: 'balance'
      }],
      menuItems: [{
        title: 'About',
        cmd: 'about'
      }, {
        title: 'Donate',
        cmd: 'donate'
      }, {
        title: 'Send',
        cmd: 'send'
      }, {
        title: 'Message',
        cmd: 'message'
      }]
    }
  },
  methods: {
    buttonClick(id) {
      switch (id) {
        case 'menu':
          Helper.setWindowSize(400, 300)
          this.showMenu = true
          break
        case 'quit':
          Helper.quitApp()
          break
        case 'send':
          Helper.setWindowSize(400, 400, false)
          this.dialogMode = 'balances'
          break
        case 'ticker':
          Helper.setWindowSize(400, 60, false)
          this.dialogMode = 'ticker'
          break
        case 'balances':
          Helper.setWindowSize(400, 200, false)
          this.dialogMode = 'main'
          break
        case 'coin-market':
          break
        default:
          console.log('buttonClick not handled: ' + id)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../scss/styles.scss';

.rocket-main {
    flex: 1;
    display: flex;
    -webkit-app-region: drag;
    background: yellow;

    .rocket-sidebar {
        display: flex;

        flex: 0 0 auto;
        flex-direction: column;
        background: rgb(55,55,55);
        padding: 5px;

        button {
            margin: 0;
            -webkit-app-region: no-drag;
        }
    }
    .rocket-content {
        flex: 1 1 auto;
        background: linear-gradient(to bottom, rgb(40,40,40), rgb(0,0,0), rgb(40,40,40));
        color: rgb(80,255, 80);
        padding: 12px 8px;

        .rocket-list {
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
    }
    .overlay-menu {
        position: absolute;
        z-index: 1;
        background: rgba(0,0,0,.8);
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        -webkit-app-region: no-drag;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 0 20px;

        button {
            min-width: 200px;
            i {
                margin-right: 6px;
            }
        }
    }
}
</style>
