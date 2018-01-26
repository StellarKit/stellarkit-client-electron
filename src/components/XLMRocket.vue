<template>
<div class='rocket-main'>
  <div class='rocket-sidebar'>
    <v-menu bottom offset-y>
      <v-btn @click.native='buttonClick("menu")' icon dark slot="activator">
        <v-icon small>menu</v-icon>
      </v-btn>
      <v-list>
        <v-list-tile v-for="item in menuItems" :key="item.title" @click="buttonClick(item.cmd)">
          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
    <v-btn @click.native='buttonClick("send")' icon dark>
      <v-icon small>monetization_on</v-icon>
    </v-btn>
    <v-btn @click.native='buttonClick("balances")' icon dark>
      <v-icon small>account_balance</v-icon>
    </v-btn>
  </div>

  <div class='rocket-content'>
    <div v-if="dialogMode === 'main'">
      <div class='rocket-list' v-for="item in balances" :key="item.title" @click="buttonClick(item.cmd)">
        <div>{{ item.title }}</div>
      </div>
    </div>

    <div v-else-if="dialogMode === 'balances'">
      here
    </div>
  </div>

</div>
</template>

<script>
// import Helper from '../js/helper.js'

export default {
  data() {
    return {
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
        case 'close':
          break
        case 'send':
          break
        case 'balances':
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
    display: flex;
    -webkit-app-region: drag;

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
}
</style>
