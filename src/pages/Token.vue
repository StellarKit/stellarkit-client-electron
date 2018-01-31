<template>
<div>
  <div class="info-area">
    Start with three accounts: Issuer, Distributor and Buyer<br>
    <v-btn small @click="createAccounts()">Create Accounts</v-btn>
    <br><br>
    <account-list :items="tokensUI" v-on:click-item="clickAccount" />
  </div>

  <div class='token-steps'>
    <ol>
      <li>
        Distributor needs to trust the Issuer:<br>
        <v-btn small @click="setDistributorTrust()">Set Distributor Trust</v-btn>
        <v-btn small @click="setDistributorTrustEth()">Set Distributor Trust Eth</v-btn>
      </li>
      <li>
        Create tokens by sending assets from Issuer to Distributor:<br>
        <v-btn small @click="createTokens()">Create Tokens</v-btn>
      </li>
      <li>
        Lock Issuer so more tokens can be created:<br>
        <v-btn small @click="lockIssuer()">Lock Issuer</v-btn>
      </li>
      <li>
        Post offer to exchange to sell tokens for XLM:<br>
        <v-btn small @click="manageOffer()">Manage Offer</v-btn>
      </li>
      <li>
        Post offer to exchange to sell tokens for Ethereum:<br>
        <v-btn small @click="manageOfferEth()">Manage Offer Eth</v-btn>
      </li>
      <li>
        Buyer needs to trust the Distributor:<br>
        <v-btn small @click="setBuyerTrust()">Set Buyer Trust</v-btn>
      </li>
      <li>
        Buy tokens:<br>
        <v-btn small @click="buyLamboTokens()">Buy Tokens</v-btn>
      </li>
    </ol>
  </div>

  <v-btn small @click="showOffers()">Show Token Offers</v-btn>
  <v-btn small @click="deleteOffers()">Delete Token Offers</v-btn>
  <v-btn small @click="paymentPaths()">Payment Paths</v-btn>
  <v-btn small @click="buyerInfo()">Buyer Info</v-btn>

</div>
</template>

<script>
import StellarCommonMixin from '../components/StellarCommonMixin.js'
import AccountList from '../components/AccountList.vue'
import StellarAccounts from '../js/StellarAccounts.js'

export default {
  mixins: [StellarCommonMixin],
  data() {
    return {
      issuerAcct: null,
      distributorAcct: null,
      tokenBuyerAcct: null
    }
  },
  components: {
    'account-list': AccountList
  },
  mounted() {
    this.createAccounts()
  },
  methods: {
    clickAccount(item) {
      console.log(item)
      this.infoForPublicKey(item.publicKey)
      this.debugLog(item.masterKey)
      this.debugLog(item.name)
    },
    infoForPublicKey(publicKey) {
      this.su.accountInfo(publicKey)
        .then((response) => {
          this.debugLog(response)
        })
        .catch((error) => {
          this.debugLog(error)
        })
    },
    buyLamboTokens() {
      this.debugLog('Buying tokens')

      this.su.buyTokens(this.tokenBuyerAcct.masterKey, this.su.lumins(), StellarAccounts.lamboTokenAsset(), '1000', '2.233')
        .then((response) => {
          this.debugLog(response)

          this.su.updateBalances()
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
          this.debugLog(err, 'ERROR')
        })
    },
    paymentPaths() {
      this.debugLog('Source: ' + this.tokenBuyerAcct.publicKey + '<br>Destination: ' + this.tokenBuyerAcct.publicKey + '<br>Issuer: ' + this.issuerAcct.publicKey + '<br>Distributor: ' + this.distributorAcct.publicKey)
      this.su.server().paths(this.tokenBuyerAcct.publicKey, this.tokenBuyerAcct.publicKey, StellarAccounts.lamboTokenAsset(), '3')
        .call()
        .then((response) => {
          this.debugLog(response)
        })
    },
    manageOffer() {
      this.debugLog('Managing Offer')

      const price = {
        n: 225,
        d: 1
      }

      this.su.manageOffer(this.distributorAcct.masterKey, this.su.lumins(), StellarAccounts.lamboTokenAsset(), '5000', price)
        .then((result) => {
          this.debugLog(result, 'Success')
          // this.debugLog(result)
        })
        .catch((error) => {
          this.debugLog(error, 'Error')
        })
    },
    manageOfferEth() {
      this.debugLog('Managing offer Ethereum:')

      const price = {
        n: 1,
        d: 10
      }

      this.su.manageOffer(this.distributorAcct.masterKey, StellarAccounts.ethereumAsset(), StellarAccounts.lamboTokenAsset(), '5000', price)
        .then((result) => {
          this.debugLog(result, 'Success')
          // this.debugLog(result)
        })
        .catch((error) => {
          this.debugLog(error, 'Error')
        })
    },
    lockIssuer() {
      this.debugLog('Locking issuer:')

      this.su.lockAccount(this.issuerAcct.masterKey)
        .then((result) => {
          this.debugLog('locked!')
          // this.debugLog(result)
        })
        .catch((error) => {
          this.debugLog(error)
        })
    },
    createTokens() {
      this.debugLog('Creating tokens:')

      this.su.sendAsset(this.issuerAcct.masterKey, this.distributorAcct.publicKey, '10000', StellarAccounts.lamboTokenAsset(), 'Created Tokens')
        .then((response) => {
          this.debugLog(response, 'Success')
        })
        .catch((error) => {
          this.debugLog(error, 'Error')
        })
    },
    setDistributorTrust() {
      this.debugLog('Setting distributor trust:')

      this.su.setTrustForAsset(this.distributorAcct.masterKey, StellarAccounts.lamboTokenAsset(), '10000')
        .then((result) => {
          this.debugLog(result)
        })
        .catch((error) => {
          this.debugLog(error)
        })
    },
    setDistributorTrustEth() {
      this.debugLog('Setting distributor trust eth:')
      this.su.setTrustForAsset(this.distributorAcct.masterKey, StellarAccounts.ethereumAsset(), '10000')
        .then((result) => {
          this.debugLog(result)
        })
        .catch((error) => {
          this.debugLog(error)
        })
    },
    setBuyerTrust() {
      this.debugLog('Setting buyer trust:')

      // buyer must trust the distributor
      this.su.setTrustForAsset(this.tokenBuyerAcct.masterKey, StellarAccounts.lamboTokenAsset(), '10000')
        .then((result) => {
          this.debugLog(result)
        })
        .catch((error) => {
          this.debugLog(error)
        })
    },
    showOffers() {
      this.debugLog('Offers:')

      this.su.server().offers('accounts', this.distributorAcct.publicKey)
        .call()
        .then((response) => {
          response.records.forEach((offer) => {
            this.debugLog(offer)
          })
        })
    },
    deleteOffersFromArray(offers) {
      const offer = offers.pop()
      if (offer) {
        const buying = this.su.assetFromObject(offer.buying)
        const selling = this.su.assetFromObject(offer.selling)

        this.su.manageOffer(this.distributorAcct.masterKey, buying, selling, '0', offer.price_r, offer.id)
          .then((result) => {
            this.debugLog(result, 'Success')
            // this.debugLog(result)

            this.deleteOffersFromArray(offers)
          })
          .catch((error) => {
            this.debugLog(error, 'Error')
          })
      }
    },
    deleteOffers() {
      this.debugLog('Deleting Offers')

      this.su.server().offers('accounts', this.distributorAcct.publicKey)
        .call()
        .then((response) => {
          // this.debugLog(response)
          this.deleteOffersFromArray(response.records)
          return true
        })
        .catch((error) => {
          this.debugLog(error, 'Error')
          return false
        })
    },
    createAccounts() {
      this.debugLog('Create Accounts')

      this.issuerAcct = StellarAccounts.accountWithName('Issuer')
      if (!this.issuerAcct) {
        this.su.createTestAccount('Issuer')
          .then((result) => {
            this.issuerAcct = result
          })
          .catch((error) => {
            this.debugLog(error)
          })
      }

      this.distributorAcct = StellarAccounts.accountWithName('Distributor')
      if (!this.distributorAcct) {
        this.su.createTestAccount('Distributor')
          .then((result) => {
            this.distributorAcct = result
          })
          .catch((error) => {
            this.debugLog(error)
          })
      }

      this.tokenBuyerAcct = StellarAccounts.accountWithName('Token buyer')
      if (!this.tokenBuyerAcct) {
        this.su.createTestAccount('Token buyer')
          .then((result) => {
            this.tokenBuyerAcct = result
          })
          .catch((error) => {
            this.debugLog(error)
          })
      }
    },
    titleHTML(title, acct) {
      let result = '<span>'
      result += '<strong>' + title + '</strong>' + ':  '

      if (acct) {
        result += acct.publicKey + '  --  XML: ' + acct.XLM
        result += '  --  LMB: ' + acct.LMB
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

.token-steps {
    padding: 20px 40px;
    background: rgba(0,0,0,.04);
}
</style>
