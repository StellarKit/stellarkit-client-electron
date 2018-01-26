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
    <v-btn small round @click.native='buttonClick("donate")'>
      <v-icon>account_balance</v-icon>Donate
    </v-btn>
    <v-btn small round @click.native='buttonClick("coin-market")'>
      <v-icon>account_balance</v-icon>Coin Market
    </v-btn>
    <v-btn small round @click.native='buttonClick("quit")'>
      <v-icon>account_balance</v-icon> Quit
    </v-btn>
  </div>

</div>
</template>

<script>
import Helper from '../js/helper.js'
import PriceTicker from './PriceTicker.vue'
const shell = require('electron').shell

export default {
  components: {
    'ticker-component': PriceTicker
  },
  data() {
    return {
      showMenu: false,
      dialogMode: 'ticker',
      status: '',
      accounts: [{
          name: 'Wallet',
          key: 'GCYQSB3UQDSISB5LKAL2OEVLAYJNIR7LFVYDNKRMLWQKDCBX4PU3Z6JP'
        },
        {
          name: 'Nano',
          key: 'GBJC6AF4I5FUTYMG4CXC3V2NYMIQANBRB4UQYY3M2RRZCXCNLFR7TN7J'
        }
      ],
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
          Helper.setWindowSize(160, 80, false)
          this.dialogMode = 'ticker'
          break
        case 'balances':
          Helper.setWindowSize(400, 200, false)
          this.dialogMode = 'main'
          break
        case 'donate':
          shell.openExternal('https://stellarkit.io/#/donate')
          break
        case 'coin-market':
          shell.openExternal('https://coinmarketcap.com/')
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

$alpha: 0.8;

.rocket-main {
    flex: 1;
    display: flex;
    -webkit-app-region: drag;

    .rocket-sidebar {
        display: flex;

        flex: 0 0 auto;
        flex-direction: column;
        background: rgba(55,55,55, $alpha);

        button {
            margin: 0;
            -webkit-app-region: no-drag;
        }
    }
    .rocket-content {
        flex: 1 1 auto;
        background: rgba(0,0,0, $alpha);
        color: rgb(80,255, 80);
        display: flex;
        flex-direction: column;
        justify-content: center;

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
