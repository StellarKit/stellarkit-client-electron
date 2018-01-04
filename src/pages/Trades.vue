<template>
<div>
  <v-btn @click="orderbook()">order book</v-btn>
  <v-btn @click="offers()">offers</v-btn>
  <v-btn @click="setLowballerTrust()">Low Ball Trust</v-btn>
  <v-btn @click="makeLowballOffer()">Low Ball Offer</v-btn>
  <v-btn @click="clearOffers()">Clear Offers</v-btn>

  <div class="trades-content">

    <div>BIDS</div>
    <div class='bid-ask' v-for="item in orderBids">
      {{parseInt(item.price_r.n) / parseInt(item.price_r.d)}}
      <div>Price: {{item.price}}</div>
      <div>Amount: {{item.amount}}</div>
    </div>
    <div>ASKS</div>
    <div class='bid-ask' v-for="item in orderAsks">
      {{parseInt(item.price_r.n) / parseInt(item.price_r.d)}}
      <div>Price: {{item.price}}</div>
      <div>Amount: {{item.amount}}</div>
    </div>
  </div>
  <stellar-common v-on:clear="consoleOutput = ''" :consoleOutput='consoleOutput' />

</div>
</template>

<script>
import StellarComponent from '../components/StellarComponent.vue'
import StellarCommonMixin from '../components/StellarCommonMixin.js'
import StellarAccounts from '../js/StellarAccounts.js'

export default {
  mixins: [StellarCommonMixin],
  components: {
    'stellar-common': StellarComponent
  },
  data() {
    return {
      orderBids: {},
      orderAsks: {},
      lowballerAcct: null,
      distributorAcct: null
    }
  },
  mounted() {
    this.lowballerAcct = StellarAccounts.accountWithName('Low Baller')
    if (!this.lowballerAcct) {
      this.lowballerAcct = StellarAccounts.createAccount('Low Baller')
    }

    this.distributorAcct = StellarAccounts.accountWithName('Distributor')
  },
  methods: {
    setLowballerTrust() {
      // buyer must trust the distributor
      this.su.setTrustForAsset(this.lowballerAcct, StellarAccounts.lamboTokenAsset(), '10000')
        .then((result) => {
          this.debugLog(result)
        })
        .catch((error) => {
          this.debugLog(error)
        })
    },
    makeLowballOffer() {
      this.su.manageOffer(this.lowballerAcct, StellarAccounts.lamboTokenAsset(), this.su.lumins(), '2', {
          n: 44,
          d: 3
        })
        .then((response) => {
          this.debugLog(response, false, 'SUCCESS')
        })
        .catch((error) => {
          this.debugLog(error, false, 'ERROR')
        })
    },
    orderbook() {
      this.debugLog('Orderbook', true)

      const selling = this.su.lumins()
      const buying = StellarAccounts.lamboTokenAsset()

      // const selling = StellarAccounts.lamboTokenAsset()
      // const buying = this.su.lumins()

      this.su.server().orderbook(selling, buying)
        .call()
        .then((response) => {
          this.debugLog(response)
        })
      // let max = 12
      // const closeStream = this.su.server().orderbook(selling, buying)
      // .stream({
      //   onmessage: (response) => {
      //     if (max-- <= 0) {
      //       closeStream()
      //     } else {
      //       this.orderBids = response.bids
      //       this.orderAsks = response.asks
      //
      //       // this.debugLog(response)
      //     }
      //   },
      //   onerror: (error) => {
      //     this.debugLog('listen err: ' + JSON.stringify(error))
      //   }
      // })
    },
    offers() {
      this.su.server().offers('accounts', this.distributorAcct.publicKey)
        .call()
        .then((response) => {
          response.records.forEach((offer) => {
            this.debugLog(offer)
          })
        })
    },
    clearOffers() {
      this.su.server().offers('accounts', this.distributorAcct.publicKey)
        .call()
        .then((response) => {
          // this.debugLog(response)

          response.records.forEach((offer) => {
            const buying = this.su.assetFromObject(offer.buying)
            const selling = this.su.assetFromObject(offer.selling)

            this.su.manageOffer(this.distributorAcct, buying, selling, '0', offer.price_r, offer.id)
              .then((result) => {
                this.debugLog(result, false, 'Success')
                // this.debugLog(result)
              })
              .catch((error) => {
                this.debugLog(error, false, 'Error')
              })
          })
        })
    },
    toolbarClick(id) {
      switch (id) {
        case 'test':
          this.test()
          break
        default:
          break
      }
    }
  }
}
</script>

<style scoped lang='scss'>
.bid-ask {
    display: inline-block;
    padding: 5px;
    margin: 5px;
    color: white;
    background: rgb(55,55,55);
}
</style>
