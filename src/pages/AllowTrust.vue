<template>
<div>
  <div class='top-controls'>
    <v-btn small @click="createAccount()">Create Account</v-btn>

    <div class='address-box'>
      <v-select :items="accountsUI" item-text='name' v-model="selectedSource" label="Source accout" autocomplete return-object max-height="600"></v-select>
    </div>

    <div>1. First setup a Token on the previous tab</div>
    <div>2. Set Source account to Issuer, then set or clear flags to test AuthRequiredFlag</div>
    <v-btn small @click="setAuthRequiredFlag()">Set AuthRequiredFlag</v-btn>
    <v-btn small @click="setAuthRevocableFlag()">Set AuthRevocableFlag</v-btn>
    <v-btn small @click="clearFlags()">Clear Flags</v-btn>

    <div>Set Source account to any account, Click Set Trust, and try to buy Token. It will fail if AuthRequiredFlag set unless you allow trust.</div>
    <v-btn small @click="allowTrust()">Allow Trust</v-btn>
    <v-btn small @click="setTrust()">Set Trust</v-btn>
    <v-btn small @click="makeSelectedPayment()">Buy Token</v-btn>
  </div>

  <div class='balances'>
    <h2>Accounts</h2>
    <account-list :items="accountsUI" v-on:click-item="clickAccount" />
  </div>
</div>
</template>

<script>
import StellarCommonMixin from '../components/StellarCommonMixin.js'
import AccountList from '../components/AccountList.vue'
const StellarSdk = require('stellar-sdk')
import Helper from '../js/helper.js'

export default {
  mixins: [StellarCommonMixin],
  components: {
    'account-list': AccountList
  },
  data() {
    return {
      selectedSource: null
    }
  },
  mounted() {
    this.su.updateBalances()
  },
  methods: {
    sourcePrivateKey() {
      const result = this.selectedSource ? this.selectedSource.secret : null

      if (Helper.strlen(result) > 0) {
        return result
      }
      return null
    },
    setAuthRequiredFlag() {
      this.debugLog('setAuthRequiredFlag...')

      const sourceSecret = this.sourcePrivateKey()

      if (sourceSecret) {
        this.su.setFlags(sourceSecret, StellarSdk.AuthRequiredFlag)
          .then((response) => {
            this.debugLog(response, 'Success')
          })
          .catch((error) => {
            this.debugLog(error, 'Error')
          })
      } else {
        this.debugLog('Error: no source account selected')
      }
    },
    setAuthRevocableFlag() {
      this.debugLog('setAuthRevocableFlag...')

      const sourceSecret = this.sourcePrivateKey()

      if (sourceSecret) {
        this.su.setFlags(sourceSecret, StellarSdk.AuthRevocableFlag)
          .then((response) => {
            this.debugLog(response, 'Success')
          })
          .catch((error) => {
            this.debugLog(error, 'Error')
          })
      } else {
        this.debugLog('Error: no source account selected')
      }
    },
    clearFlags() {
      this.debugLog('clearing flags...')

      const sourceSecret = this.sourcePrivateKey()

      if (sourceSecret) {
        this.su.clearFlags(sourceSecret, StellarSdk.AuthRequiredFlag | StellarSdk.AuthRevocableFlag)
          .then((response) => {
            this.debugLog(response, 'Success')
          })
          .catch((error) => {
            this.debugLog(error, 'Error')
          })
      } else {
        this.debugLog('Error: no source account selected')
      }
    },
    infoForSelectedSource() {
      this.infoForPublicKey(this.selectedSource.publicKey)
    },
    makeSelectedPayment() {
      this.debugLog('paying')

      this.su.sendAsset(this.selectedSource.secret, this.selectedDest.publicKey, '122')
        .then((response) => {
          this.su.updateBalances()

          this.debugLog(response, 'Success')
        })
        .catch((error) => {
          this.debugLog(error, 'Error')
        })
    }
  }
}
</script>

<style scoped lang='scss'>
.top-controls {
    padding: 20px;
}

.address-box {
    display: flex;
    align-items: center;
    div.input-group {
        margin-right: 16px;
    }
}

.balances {
    padding: 10px;
    background: steelblue;
    box-shadow: 0 7px 12px -7px rgba(0,0,0,.7);
    color: white;
    text-align: center;
}
</style>
