<template>
<div class='main-container'>
  <div v-if='!showPurchase' class='start-choice'>
    <div>What would you like to use to purchase LMB tokens</div>
    <div class='button-holder'>
      <v-btn @click="buttonClick('bitcoin')">Bitcoin</v-btn>
      <v-btn @click="buttonClick('ethereum')">Ethereum</v-btn>
    </div>
  </div>

  <div v-if='showPurchase' class="container">
    <v-btn small @click="buttonClick('back')">Back</v-btn>
    <div v-html="sendMessage "></div>
    <div>Address = {{address}}</div>
    <p><strong>Do not send real coins!</strong></p>
    <p>Exchange rate: 1 ETH = 1 LMB token</p>
    <p><a href="https://github.com/stellar/go/pull/81 " target="_blank ">Instructions</a></p>
    <div class="progress ">
      <v-progress-linear v-model="progress "></v-progress-linear>
    </div>
    <div>Status = {{status}}</div>
    <div>Public Key = {{publicKey}}</div>
    <div>Secret Key = {{secretKey}}</div>
  </div>
</div>
</template>

<script>
import * as Bifrost from '../libs/bifrost.js'

export default {
  data() {
    return {
      showPurchase: false,
      purchaseCoin: '',
      progress: 0,
      session: null,
      status: '',
      address: 'loading...',
      publicKey: '',
      secretKey: ''
    }
  },
  computed: {
    sendMessage: function () {
      if (this.purchaseCoin === 'btc') {
        return '<div class="lead">Send Bitcoin <strong>testnet</strong> BTC to the following address:</div>'
      } else {
        return '<div class="lead">Send Ropsten <strong>testnet</strong> ETH to the following address:</div>'
      }
    }
  },
  methods: {
    initBifrost() {
      const params = {
        network: 'test',
        horizonURL: 'http://192.168.1.82:8000',
        bifrostURL: 'http://192.168.1.82:8800',
        assetCode: 'LMB',
        price: '1',
        issuingPublicKey: 'GBAI66I4B7IX7NGK2BUBUQK2WUH4SKXTGUNAHCZ6X35TA2ORD4SIPQ3D',
        preSaleMode: false
      }

      this.session = new Bifrost.Session(params)
    },
    startBitcoin() {
      this.showPurchase = true
      this.purchaseCoin = 'btc'
      this.initBifrost()

      this.session.startBitcoin(this.onEvent).then((result) => {
        this.setStatus('Waiting for a transaction...', 10)
        this.address = result.address
        this.publicKey = result.keypair.publicKey()
        this.secretKey = result.keypair.secret()
      })
    },
    startEthereum() {
      this.showPurchase = true
      this.purchaseCoin = 'eth'
      this.initBifrost()

      this.session.startEthereum(this.onEvent).then((result) => {
        this.setStatus('Waiting for a transaction...', 10)
        this.address = result.address
        this.publicKey = result.keypair.publicKey()
        this.secretKey = result.keypair.secret()
      })
    },
    setStatus(status, progress) {
      this.progress = progress
      this.status = status
    },
    onEvent(event, data) {
      switch (event) {
        case Bifrost.TransactionReceivedEvent:
          this.setStatus('Transaction received, creating account...', 20)
          break
        case Bifrost.AccountCreatedEvent:
          this.setStatus('Account created, creating trust lines...', 40)
          break
        case Bifrost.TrustLinesCreatedEvent:
          this.setStatus('Trust lines created, waiting for tokens...', 60)
          break
        case Bifrost.AccountCreditedEvent:
          this.setStatus('Account credited, exchanging...', 80)
          break
        case Bifrost.PurchasedEvent:
          this.setStatus('Congrats! TOKE purchased.', 100)
          break
        case Bifrost.ErrorEvent:
          this.setStatus('Error!', 0)
          console.log(JSON.stringify(data))
          break
        default:
          this.setStatus('default swtich reached!', 0)
          break
      }
    },
    buttonClick(id) {
      switch (id) {
        case 'test':
          this.test()
          break
        case 'bitcoin':
          this.startBitcoin()
          break
        case 'ethereum':
          this.startEthereum()
          break
        case 'back':
          this.showPurchase = false
          break
        default:
          console.log('no button with that name')
          break
      }
    }
  }
}
</script>

<style lang='scss'>
.main-container {
    display: flex;
    flex-direction: column;
    align-items:: center;

    .start-choice {
        font-size: 1.6em;
        flex-direction: column;
        align-items:: center;
        justify-content: center;

        .button-holder {
            padding: 10px;
            display: flex;
            justify-content: center;
        }
    }

    .container {
        background-color: #ffffff;
        width: 600px;
        text-align: center;
        padding: 50px;
        margin-top: 50px;
        box-shadow: 0 1px 3px rgba(0,0,0,.3);
        border-radius: 3px;
    }
}
</style>
