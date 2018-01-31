<template>
<div class='main-container'>
  <v-btn small @click="showDialogPing = !showDialogPing">Buy Token</v-btn>

  <buy-token-dialog :ping='showDialogPing' :params='params' />
</div>
</template>

<script>
import {
  BuyTokenDialog
} from 'stellar-js-utils'
import StellarAccounts from '../js/StellarAccounts.js'

export default {
  data() {
    return {
      showDialogPing: false
    }
  },
  components: {
    'buy-token-dialog': BuyTokenDialog
  },
  computed: {
    params: function () {
      const issuerAcct = StellarAccounts.accountWithName('Issuer')

      const params = {
        network: 'test',
        horizonURL: 'http://192.168.1.82:8000',
        bifrostURL: 'http://192.168.1.82:8800',
        assetCode: 'LMB',
        price: '1',
        issuingPublicKey: issuerAcct.publicKey,
        preSaleMode: false
      }

      return params
    }
  },
  methods: {
    hello() {
      // nothing
    }
  }
}
</script>

<style lang='scss' scoped>
.main-container {
    display: flex;
    flex-direction: column;
    align-items:: center;
}
</style>
