<template>
<div>
  <v-btn @click="setDistributorTrust()">Set Distributor Trust</v-btn>
  <v-btn @click="createTokens()">Create Tokens</v-btn>
  <v-btn @click="lockIssuer()">Lock Issuer</v-btn>
  <v-btn @click="manageOffer()">Manage Offer</v-btn>
  <v-btn @click="manageOfferEth()">Manage Offer Eth</v-btn>
  <v-btn @click="paymentPaths()">Payment Paths</v-btn>
  <v-btn @click="buyerInfo()">Buyer Info</v-btn>
  <v-btn @click="setBuyerTrust()">Set Buyer Trust</v-btn>
  <v-btn @click="buyLamboTokens()">Buy Tokens</v-btn>

  <div class="info-area">
    <div v-html='issuerHTML'></div>
    <div v-html='distributorHTML'></div>
  </div>

  <stellar-common :consoleOutput='consoleOutput' />
</div>
</template>

<script>
import StellarComponent from '../components/StellarComponent.vue'
import StellarCommonMixin from '../components/StellarCommonMixin.js'
import StellarAccounts from '../js/StellarAccounts.js'
import Helper from '../js/helper.js'

export default {
  mixins: [StellarCommonMixin],
  components: {
    'stellar-common': StellarComponent
  },
  data() {
    return {
      issuerAcct: null,
      distributorAcct: null,
      tokenBuyerAcct: null
    }
  },
  computed: {
    issuerHTML: function () {
      return this.titleHTML('Issuer', this.issuerAcct)
    },
    distributorHTML: function () {
      return this.titleHTML('Distributor', this.distributorAcct)
    }
  },
  mounted() {
    this.updateAccounts()

    Helper.vue().$on('stellar-accounts-updated', this.updateAccounts)
  },
  methods: {
    buyLamboTokens() {
      this.su.buyTokens(this.tokenBuyerAcct, this.su.lumins(), StellarAccounts.lamboTokenAsset(), '1000', '2.233')
        .then((response) => {
          this.debugLog(response)
        })
        .catch((error) => {
          this.debugLog(error)
        })
    },
    buyerInfo() {
      this.su.accountInfo(this.tokenBuyerAcct.publicKey)
        .then((result) => {
          this.debugLog(result)
        })
        .catch((err) => {
          this.debugLog(err, false, 'ERROR')
        })
    },
    paymentPaths() {
      this.debugLog('Source: ' + this.tokenBuyerAcct.publicKey + '<br>Destination: ' + this.tokenBuyerAcct.publicKey + '<br>Issuer: ' + this.issuerAcct.publicKey + '<br>Distributor: ' + this.distributorAcct.publicKey, true)
      this.su.server().paths(this.tokenBuyerAcct.publicKey, this.tokenBuyerAcct.publicKey, StellarAccounts.lamboTokenAsset(), '3')
        .call()
        .then((response) => {
          this.debugLog(response)
        })
    },
    manageOffer() {
      this.debugLog('Manage Offer', true)

      const price = {
        n: 225,
        d: 1
      }

      this.su.manageOffer(this.distributorAcct, this.su.lumins(), StellarAccounts.lamboTokenAsset(), '5000', price)
        .then((result) => {
          this.debugLog(result, false, 'Success')
          // this.debugLog(result)
        })
        .catch((error) => {
          this.debugLog(error, false, 'Error')
        })
    },
    manageOfferEth() {
      this.debugLog('Manage Offer', true)

      const price = {
        n: 225,
        d: 1
      }

      this.su.manageOffer(this.distributorAcct, StellarAccounts.ethereumAsset(), StellarAccounts.lamboTokenAsset(), '5000', price)
        .then((result) => {
          this.debugLog(result, false, 'Success')
          // this.debugLog(result)
        })
        .catch((error) => {
          this.debugLog(error, false, 'Error')
        })
    },
    lockIssuer() {
      this.su.lockAccount(this.issuerAcct)
        .then((result) => {
          this.debugLog('locked!')
          // this.debugLog(result)
        })
        .catch((error) => {
          this.debugLog(error)
        })
    },
    createTokens() {
      this.su.sendAsset(this.issuerAcct, this.distributorAcct.publicKey, '10000', StellarAccounts.lamboTokenAsset(), 'Created Tokens')
        .then((response) => {
          this.debugLog(response, false, 'Success')
        })
        .catch((error) => {
          this.debugLog(error, false, 'Error')
        })
    },
    setDistributorTrust() {
      // distributor must trust the asset of issuerAcct
      // buyer must trust the distributor
      this.su.setTrustForAsset(this.distributorAcct, StellarAccounts.lamboTokenAsset(), '10000')
        .then((result) => {
          this.debugLog(result)
        })
        .catch((error) => {
          this.debugLog(error)
        })
    },
    setBuyerTrust() {
      // buyer must trust the distributor
      this.su.setTrustForAsset(this.tokenBuyerAcct, StellarAccounts.lamboTokenAsset(), '10000')
        .then((result) => {
          this.debugLog(result)
        })
        .catch((error) => {
          this.debugLog(error)
        })
    },
    updateAccounts() {
      this.issuerAcct = StellarAccounts.accountWithName('Issuer')
      if (!this.issuerAcct) {
        this.issuerAcct = StellarAccounts.createAccount('Issuer')
      }

      this.distributorAcct = StellarAccounts.accountWithName('Distributor')
      if (!this.distributorAcct) {
        this.distributorAcct = StellarAccounts.createAccount('Distributor')
      }

      this.tokenBuyerAcct = StellarAccounts.accountWithName('Token buyer')
      if (!this.tokenBuyerAcct) {
        this.tokenBuyerAcct = StellarAccounts.createAccount('Token buyer')
      }
    },
    titleHTML(title, acct) {
      let result = '<span>'
      result += '<strong>' + title + '</strong>' + ':  '

      if (acct) {
        result += acct.publicKey + '  (XML: ' + acct.xlm + ')'
      } else {
        result += '(none)'
      }
      result += '</span>'

      return result
    }
  }
}
</script>

<style scoped lang='scss'>
.info-area {
    width: 100%;
    height: 100%;
    padding: 20px;
    background: steelblue;
    color: white;
}
</style>
