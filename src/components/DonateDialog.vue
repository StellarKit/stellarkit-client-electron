<template>
<v-dialog lazy v-model='visible' scrollable @keydown.esc="visible = false" max-width="600">
  <div class='main-container'>
    <div class='input-title'>
      Your XLM donation is appreciated.
    </div>
    <v-text-field label="XLM" v-model.trim="value1" @keyup.enter="enterKeyAction()" id='autofocusTextField' required></v-text-field>
    <v-text-field label="Secret Key" v-model.trim="value2" @keyup.enter="enterKeyAction()"></v-text-field>
    <v-btn @click='donate'>Sign in with Ledger Nano</v-btn>

    <div class='button-holder'>
      <v-btn round color='secondary' @click="visible = false">
        Cancel
      </v-btn>
      <v-btn round color='primary' @click="enterKeyAction()">
        Donate
      </v-btn>
    </div>
  </div>
</v-dialog>
</template>

<script>
// import $ from 'jquery'
// import Helper from '../js/helper.js'
// const StellarLedger = require('stellar-ledger-api')
// const bip32Path = "44'/148'/0'"
// const StellarSdk = require('stellar-sdk')
//
// export default {
//   props: ['ping'],
//   watch: {
//     ping: function () {
//       this.visible = true
//       this.$nextTick(() => {
//         $('#autofocusTextField').focus()
//       })
//     }
//   },
//   data() {
//     return {
//       visible: false,
//       ledgerStatus: '',
//       value1: '',
//       value2: '',
//       srcPublicKey: '',
//       destPublicKey: 'GCYQSB3UQDSISB5LKAL2OEVLAYJNIR7LFVYDNKRMLWQKDCBX4PU3Z6JP',
//       connected: true,
//       xlm: 0,
//       status: ''
//     }
//   },
//   methods: {
//     enterKeyAction() {
//       if (Helper.strlen(this.value1)) {
//         this.visible = false
//         this.$emit('close', true, this.value1, this.value2)
//       }
//     },
//     sendXLM() {
//       this.status = 'sending ' + this.xlm + ' XLM'
//       console.log('sending')
//
//       const stringAmount = this.xlm
//       this.xlm = 0
//
//       this.su.sendAsset(this.srcPublicKey, this.destPublicKey, stringAmount)
//         .then((response) => {
//           this.status = 'XML sent.  Thank You!'
//         })
//         .catch((error) => {
//           this.status = 'Error sending XLM'
//           console.log(error)
//         })
//     },
//     donate() {
//       new StellarLedger.Api(new StellarLedger.comm(Number.MAX_VALUE)).connect(
//         () => {
//           console.log('connected')
//           this.getPublicKey()
//         },
//         (err) => {
//           console.error(err)
//         }
//       )
//     },
//     getPublicKey() {
//       StellarLedger.comm.create_async().then((comm) => {
//         const api = new StellarLedger.Api(comm)
//
//         return api.getPublicKey_async(bip32Path)
//           .then((result) => {
//             this.srcPublicKey = result['publicKey']
//             console.log(this.srcPublicKey)
//
//             this.status = 'Connected'
//             this.connected = true
//           }).catch((err) => {
//             console.error(err)
//           })
//       })
//     },
//     sendAsset(sourceAcct, destKey, amount) {
//       const promise = new Promise((resolve, reject) => {
//         this.server().loadAccount(destKey)
//           .catch(StellarSdk.NotFoundError, (error) => {
//             reject(error)
//           })
//           .then(() => {
//             return this.server().loadAccount(sourceAcct.publicKey)
//           })
//           .then((sourceAccount) => {
//             const builder = new StellarSdk.TransactionBuilder(sourceAccount)
//               .addOperation(StellarSdk.Operation.payment({
//                 destination: destKey,
//                 asset: StellarSdk.Asset.native(),
//                 amount: amount
//               }))
//
//             const transaction = builder.build()
//
//             this.signTransaction(transaction)
//               .then(() => {
//                 this.status = 'Submitting transaction...'
//
//                 return this.server().submitTransaction(transaction)
//               })
//               .catch(() => {
//                 this.status = 'Error signing transaction'
//               })
//           })
//           .then((response) => {
//             resolve(response)
//           })
//           .catch((error) => {
//             reject(error)
//           })
//       })
//
//       return promise
//     },
//     signTransaction(transaction) {
//       StellarLedger.comm.create_async().then((comm) => {
//         const api = new StellarLedger.Api(comm)
//
//         return api.signTx_async(bip32Path, transaction).then((result) => {
//           const signature = result['signature']
//           this.addSignatureToTransaction(signature, transaction)
//         }).catch((err) => {
//           console.error(err)
//         })
//       })
//     },
//     addSignatureToTransaction(publicKey, signature, transaction) {
//       const keyPair = StellarSdk.Keypair.fromPublicKey(publicKey)
//       const hint = keyPair.signatureHint()
//       const decorated = new StellarSdk.xdr.DecoratedSignature({
//         hint: hint,
//         signature: signature
//       })
//       transaction.signatures.push(decorated)
//     }
//   }
// }
</script>

<style lang="scss" scoped>
@import '../scss/styles.scss';

.main-container {
    @include standard-dialog-contents();

    padding: 20px;

    .input-title {
        font-size: 1.2em;
    }

    .button-holder {
        display: flex;
        justify-content: flex-end;
    }
}
</style>
