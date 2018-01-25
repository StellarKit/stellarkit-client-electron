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

        <div class='own-wallet'>
          Or use your favorite wallet:<br>To: <span class='xlm-address'>GCYQSB3UQDSISB5LKAL2OEVLAYJNIR7LFVYDNKRMLWQKDCBX4PU3Z6JP</span>
        </div>
      </div>

      <div v-else-if="dialogMode === 'useNano'" class='donate-nano'>
        <v-text-field label="Lumens" type='number' v-model.trim="xlm" @keyup.enter="buttonClick('sendWithNano')" autofocus></v-text-field>

        <div class='sign-button-area'>
          <v-btn @click="buttonClick('sendWithNano')" :disabled="!connected">Send with Ledger Nano</v-btn>
          <div v-if="!connected">Make sure 'Browser Support' is disabled</div>
          <div>{{status}}</div>
        </div>
      </div>
      <div v-else-if="dialogMode === 'useKey'" class='donate-secret'>
        <div class='sign-button-area'>
          <v-text-field label="Amount" type='number' v-model.trim="xlm" autofocus></v-text-field>
          <v-text-field label="Secret Key" v-model.trim="secretKey" @keyup.enter="buttonClick('sendWithSecret')" hint="Starts with an 'S'" :append-icon="showSecret ? 'visibility_off' : 'visibility'" :append-icon-cb="() => (showSecret = !showSecret)" :type="showSecret ? 'text' : 'password'"></v-text-field>

          <v-btn @click="buttonClick('sendWithSecret')" :disabled="disableSendLumens">Send Lumens</v-btn>
          <div>{{status}}</div>
        </div>
      </div>

      <div>
        <div class='button-holder'>
          <v-btn round color='primary' @click="visible = false">
            Close
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

export default {
  props: ['ping'],
  watch: {
    ping: function () {
      this.visible = true

      // reset if reopened
      this.dialogMode = 'start'
      this.status = ''
      this.secretKey = ''
      this.connected = false
      this.xlm = 40
      this.showSecret = false
    }
  },
  data() {
    return {
      visible: false,
      dialogMode: 'start',
      status: '',
      secretKey: '',
      connected: true,
      xlm: 40,
      showSecret: false,
      server: null,
      destinationKey: 'GCYQSB3UQDSISB5LKAL2OEVLAYJNIR7LFVYDNKRMLWQKDCBX4PU3Z6JP' // desktop
      // destinationKey: 'GBJC6AF4I5FUTYMG4CXC3V2NYMIQANBRB4UQYY3M2RRZCXCNLFR7TN7J' // nano
    }
  },
  computed: {
    disableSendLumens: function () {
      return Helper.strlen(this.secretKey) < 10 || this.xlm < 1
    }
  },
  created() {
    StellarSdk.Network.usePublicNetwork()
    this.server = new StellarSdk.Server('https://horizon.stellar.org')
  },
  methods: {
    buttonClick(id) {
      switch (id) {
        case 'useNano':
          this.dialogMode = 'useNano'
          this.status = ''

          this.connectLedger()
          break
        case 'useKey':
          this.dialogMode = 'useKey'
          this.status = ''
          break
        case 'sendWithNano':
          this.sendWithNano()
          break
        case 'sendWithSecret':
          this.sendWithSecret()
          break
        default:
          console.log('not handled: ' + id)
          break
      }
    },
    connectLedger() {
      this.connected = false

      // Number.MAX_VALUE
      StellarLedger.comm_node.create_async()
        .then((comm) => {
          new StellarLedger.Api(comm).connect(() => {
            this.connected = true
          }, (error) => {
            this.status = 'Error: ' + JSON.stringify(error)
          })
        })
    },
    getPublicKeyFromNano() {
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
    loadAccount(signWithNano) {
      const promise = new Promise((resolve, reject) => {
        this.server.loadAccount(this.destinationKey)
          .catch((error) => {
            this.status = 'Failed to load destination account: ' + error
            reject(error)
          })
          .then((destAccount) => {
            if (signWithNano) {
              this.getPublicKeyFromNano()
                .catch((error) => {
                  this.status = 'Failed to get source public key: ' + error
                  reject(error)
                })
                .then((sourcePublicKey) => {
                  this.server.loadAccount(sourcePublicKey)
                    .then((sourceAccount) => {
                      resolve(sourceAccount)
                    })
                    .catch((error) => {
                      this.status = 'Failed to load source account: ' + error
                      reject(error)
                    })
                })
            } else {
              const keyPair = StellarSdk.Keypair.fromSecret(this.secretKey)

              this.server.loadAccount(keyPair.publicKey())
                .then((sourceAccount) => {
                  resolve(sourceAccount)
                })
                .catch((error) => {
                  this.status = 'Failed to load source account: ' + error
                  reject(error)
                })
            }
          })
      })

      return promise
    },
    sendWithNano() {
      this.sendPayment(true)
    },
    sendWithSecret() {
      this.sendPayment(false)
    },
    sendPayment(signWithNano) {
      if (this.xlm < 1) {
        this.status = 'Lumens must be greater than 0'
        return
      }
      if (!signWithNano && Helper.strlen(this.secretKey) < 1) {
        this.status = 'Please enter your secret key'
        return
      }

      this.loadAccount(signWithNano)
        .catch((error) => {
          this.status = 'Error loading account: ' + error
        })
        .then((sourceAccount) => {
          const builder = new StellarSdk.TransactionBuilder(sourceAccount)
            .addOperation(StellarSdk.Operation.payment({
              destination: this.destinationKey,
              asset: StellarSdk.Asset.native(),
              amount: String(this.xlm)
            }))

          const transaction = builder.build()

          this.signTransaction(sourceAccount.accountId(), transaction, signWithNano)
            .then((signedTransaction) => {
              this.status = 'Submitting transaction...'

              return this.server.submitTransaction(signedTransaction)
            })
            .then((response) => {
              console.log(response)
              this.status = 'Payment Successful! Thank you!'

              // clear secret key
              this.secretKey = ''
            })
            .catch((error) => {
              this.status = 'Error signing transaction: ' + error
            })
        })
    },
    signTransaction(sourceKey, transaction, signWithNano) {
      const promise = new Promise((resolve, reject) => {
        if (signWithNano) {
          StellarLedger.comm_node.create_async().then((comm) => {
            this.status = 'Confirm transaction on Nano...'

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
        } else {
          const sourceKeys = StellarSdk.Keypair.fromSecret(this.secretKey)

          transaction.sign(sourceKeys)
          resolve(transaction)
        }
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

        .own-wallet {
            margin-top: 20px;
            text-align: center;

            .xlm-address {
                font-size: 0.9em;
                font-weight: bold;
            }
        }

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
        .donate-secret {
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
