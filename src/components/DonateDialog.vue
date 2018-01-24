<template>
<v-dialog lazy v-model='visible' scrollable @keydown.esc="visible = false" max-width="600">
  <div class='main-container'>
    <div class='input-title'>
      <v-icon dark large class='back-button' @click="dialogMode = 'start'" v-if="dialogMode !== 'start'">chevron_left</v-icon>
      Your XLM donation is appreciated.
    </div>

    <div class='donate-content'>
      <div v-if="dialogMode === 'start'" class='donate-start'>
        <div class='title-start'>Choose Method</div>
        <div>
          <v-btn @click="buttonClick('useNano')">Use Ledger Nano</v-btn>
        </div>
        <div>

          <v-btn @click="buttonClick('useKey')">Use secret key</v-btn>
        </div>
      </div>

      <div v-else-if="dialogMode === 'useNano'" class='donate-nano'>
        <v-text-field label="Amount" type='number' v-model.trim="xlm" @keyup.enter="buttonClick('sendAsset')" autofocus></v-text-field>

        <div class='sign-button-area'>
          <v-btn @click="buttonClick('sendAsset')" :disabled="!connected">Sign using Ledger Nano</v-btn>
          <div v-if="!connected">Make sure 'Browser Support' is disabled</div>
          <div>{{status}}</div>
        </div>
      </div>
      <div v-else-if="dialogMode === 'useKey'" class='donate-nano'>
        <v-text-field label="Amount" v-model.trim="value1" @keyup.enter="buttonClick('sendAssetSecretKey')" autofocus></v-text-field>
        <v-text-field label="Secret Key" v-model.trim="value2" @keyup.enter="buttonClick('sendAssetSecretKey')"></v-text-field>

        <v-btn @click="buttonClick('sendAssetSecretKey')">Send XLM</v-btn>
      </div>

      <div v-if="dialogMode !== 'start'">
        <div class='button-holder'>
          <v-btn round color='secondary' @click="visible = false">
            Cancel
          </v-btn>
          <v-btn round color='primary' @click="enterKeyAction()">
            Send XLM
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</v-dialog>
</template>

<script>
import Helper from '../js/helper.js'
const StellarLedger = require('stellar-ledger-api')
const bip32Path = "44'/148'/0'"
const StellarSdk = require('stellar-sdk')
import StellarCommonMixin from './StellarCommonMixin.js'

export default {
  props: ['ping'],
  mixins: [StellarCommonMixin],
  watch: {
    ping: function () {
      this.visible = true
    }
  },
  data() {
    return {
      visible: false,
      dialogMode: 'start',
      status: '',
      value1: '',
      value2: '',
      connected: true,
      xlm: 1
    }
  },
  methods: {
    buttonClick(id) {
      switch (id) {
        case 'useNano':
          this.dialogMode = 'useNano'

          this.connectLedger()
          break
        case 'useKey':
          this.dialogMode = 'useKey'
          break
        case 'sendAsset':
          {
            const stringAmount = String(this.xlm)

            this.sendAsset('GCYQSB3UQDSISB5LKAL2OEVLAYJNIR7LFVYDNKRMLWQKDCBX4PU3Z6JP', stringAmount)
          }
          break
        case 'sendAssetSecretKey':
          break
        default:
          console.log('not handled: ' + id)
          break
      }
    },
    enterKeyAction() {
      if (Helper.strlen(this.value1)) {
        this.visible = false
        this.$emit('close', true, this.value1, this.value2)
      }
    },
    connectLedger() {
      this.connected = false
      StellarLedger.comm_node.create_async().then((comm) => {
        new StellarLedger.Api(comm).connect(() => {
          this.connected = true
        }, (error) => {
          this.status = 'Error: ' + error
        })
      })
    },
    getPublicKey() {
      const promise = new Promise((resolve, reject) => {
        StellarLedger.comm_node.create_async().then((comm) => {
          new StellarLedger.Api(comm).getPublicKey_async(bip32Path)
            .then((result) => {
              resolve(result['publicKey'])
            })
            .catch((error) => {
              reject(error)
            })
        })
      })

      return promise
    },
    loadAccount(destKey) {
      const promise = new Promise((resolve, reject) => {
        this.su.server().loadAccount(destKey)
          .then((destAccount) => {
            this.getPublicKey()
              .then((sourcePublicKey) => {
                this.su.server().loadAccount(sourcePublicKey)
                  .then((sourceAccount) => {
                    resolve(sourceAccount)
                  })
                  .catch((error) => {
                    console.log('load failed')

                    this.status = 'Failed to load source account: ' + error
                    reject(error)
                  })
              })
              .catch((error) => {
                this.status = 'Failed to get source public key: ' + error
                reject(error)
              })
          })
          .catch((error) => {
            this.status = 'Failed to load destination account: ' + error
            reject(error)
          })
      })

      return promise
    },
    sendAsset(destKey, amount) {
      this.loadAccount(destKey)
        .then((sourceAccount) => {
          const builder = new StellarSdk.TransactionBuilder(sourceAccount)
            .addOperation(StellarSdk.Operation.payment({
              destination: destKey,
              asset: StellarSdk.Asset.native(),
              amount: amount
            }))

          const transaction = builder.build()

          this.status = 'Confirm on Nano...'

          this.signTransaction(sourceAccount.accountId(), transaction)
            .then((signed) => {
              this.status = 'Submitting transaction...'

              return this.su.server().submitTransaction(signed)
            })
            .then((response) => {
              console.log(response)
              this.status = 'Send successful!'
            })
            .catch((error) => {
              this.status = 'Error signing transaction: ' + error
            })
        })
        .catch((error) => {
          this.status = 'Error loading account: ' + error
        })
    },
    signTransaction(sourceKey, transaction) {
      const promise = new Promise((resolve, reject) => {
        StellarLedger.comm_node.create_async().then((comm) => {
          new StellarLedger.Api(comm).signTx_async(bip32Path, transaction)
            .then((result) => {
              const signature = result['signature']

              const keyPair = StellarSdk.Keypair.fromPublicKey(sourceKey)
              const hint = keyPair.signatureHint()
              const decorated = new StellarSdk.xdr.DecoratedSignature({
                hint: hint,
                signature: signature
              })

              transaction.signatures.push(decorated)

              resolve(transaction)
            })
            .catch((err) => {
              console.log(err)
              reject(err)
            })
        })
      })
      return promise
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../scss/styles.scss';

.main-container {
    @include standard-dialog-contents();

    padding: 20px;

    .input-title {
        position: relative;
        background: steelblue;
        color: white;
        text-align: center;
        padding: 10px;
        font-size: 1.2em;

        .back-button {
            position: absolute;
            top: 5px;
            left: 0;
        }
    }

    .donate-content {
        margin-top: 20px;

        .donate-start {
            .title-start {
                font-size: 1.2em;
                margin-bottom: 8px;
            }

            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .donate-nano {
            .sign-button-area {
                display: flex;
                flex-direction: column;
                align-items: center;
            }
        }
    }

    .button-holder {
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
    }
}
</style>
