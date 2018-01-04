<template>
<div>
  <div class='buttons'>
    <v-btn small @click="createAccount()">Create Account</v-btn>
    <v-btn small @click="refresh()">Refresh</v-btn>
    <v-btn small @click="horizonMetrics()">Horizon</v-btn>
    <v-btn small @click="clearLog()">Clear Log</v-btn>
  </div>

  <v-select :items="accountsUI" item-text='name' v-model="selectedSource" label="Source accout" autocomplete return-object max-height="600"></v-select>
  <v-select :items="accountsUI" item-text='name' v-model="selectedDest" label="Destination accout" autocomplete return-object max-height="600"></v-select>
  <v-btn @click='swapSourceDest()'>Swap Source/Dest</v-btn>
  <v-select :items="accountsUI" item-text='name' v-model="selectedSigner" label="Add signer to source" autocomplete return-object max-height="600"></v-select>
  <v-btn small @click="makeSelectedPayment()">Pay</v-btn>
  <v-btn small @click="deleteSelectedSource()">Delete</v-btn>
  <v-btn small @click="infoForSelectedSource()">Info</v-btn>
  <v-btn small @click="transactionsForSelectedSource()">Transactions</v-btn>
  <v-btn small @click="paymentsForSelectedSource()">Payments</v-btn>
  <v-btn small @click="operationsForSelectedSource()">Operations</v-btn>
  <v-btn small @click="setSignerForSelected()">Set Signer</v-btn>
  <v-btn small @click="payWithSigners()">Pay with Signers</v-btn>
  <v-btn small @click="mergeSelected()">Merge Selected</v-btn>

  <div class='balances'>
    <h2>Accounts</h2>
    <div v-for="item in accountsUI" :key='item.name'>
      Name: {{item.name}}<br> XLM: {{item.XLM}}<br>LMB: {{item.LMB}}<br><br>
    </div>
  </div>

  <stellar-common :consoleOutput='consoleOutput' :snackbarText='snackbarText' />
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
      selectedSource: null,
      selectedDest: null,
      selectedSigner: null
    }
  },
  mounted() {
    this.updateBalances()
    // this.listenForPayments()
  },
  methods: {
    horizonMetrics() {
      this.su.horizonMetrics()
        .then((response) => {
          this.debugLog(response, false, 'Success')
        })
        .catch((error) => {
          this.debugLog(error, false, 'Error')
        })
    },
    clearLog() {
      this.debugLog('', true)
    },
    swapSourceDest() {
      const tmp = this.selectedSource
      this.selectedSource = this.selectedDest
      this.selectedDest = tmp
    },
    mergeSelected() {
      this.su.mergeAccount(this.selectedSource, this.selectedDest.publicKey)
        .then((response) => {
          this.updateBalances()

          this.debugLog(response, false, 'Success')
        })
        .catch((error) => {
          this.debugLog(error, false, 'Error')
        })
    },
    payWithSigners() {
      this.su.sendAsset(this.selectedSource, this.selectedDest.publicKey, '122', null, null, [this.selectedSigner.masterKey])
        .then((response) => {
          this.updateBalances()

          this.debugLog(response, false, 'Success')
        })
        .catch((error) => {
          this.debugLog(error, false, 'Error')
        })
    },
    setSignerForSelected() {
      this.debugLog('set signer', true)

      this.su.makeMultiSig(this.selectedSource, this.selectedSigner.publicKey)
        .then((result) => {
          this.debugLog('signed!')
        })
        .catch((error) => {
          this.debugLog(error)
        })
    },
    operationsForSelectedSource() {
      this.su.server().operations()
        .forAccount(this.selectedSource.publicKey)
        .call()
        .then((response) => {
          this.debugLog(response, true)
        })
    },
    paymentsForSelectedSource() {
      this.su.server().payments()
        .forAccount(this.selectedSource.publicKey)
        .call()
        .then((response) => {
          this.debugLog(response, true)
        })
    },
    transactionsForSelectedSource() {
      this.su.server().transactions()
        .forAccount(this.selectedSource.publicKey)
        .stream({
          onmessage: (txResponse) => {
            this.debugLog(txResponse)
          },
          onerror: (error) => {
            this.debugLog(error)
          }
        })
    },
    infoForSelectedSource() {
      this.su.accountInfo(this.selectedSource.publicKey)
        .then((response) => {
          this.debugLog(response, true)
          this.debugLog(this.selectedSource.masterKey)
        })
        .catch((error) => {
          this.debugLog(error, true)
        })
    },
    deleteSelectedSource() {
      StellarAccounts.deleteAccount(this.selectedSource.publicKey)
    },
    makeSelectedPayment() {
      this.debugLog('paying', true)

      this.su.sendAsset(this.selectedSource, this.selectedDest.publicKey, '122')
        .then((response) => {
          this.updateBalances()

          this.debugLog(response, false, 'Success')
        })
        .catch((error) => {
          this.debugLog(error, false, 'Error')
        })
    },
    refresh() {
      this.debugLog('refresh', true)
      this.updateBalances()
    },
    listenForPayments() {
      for (let i = 0; i < StellarAccounts.accounts().length; i++) {
        this.listenForPayment(i)
      }
    },
    updateBalances() {
      for (let i = 0; i < StellarAccounts.accounts().length; i++) {
        this.updateBalance(i)
      }
    },
    updateBalance(index) {
      this.su.balances(StellarAccounts.publicKey(index))
        .then((balanceObject) => {
          for (const key in balanceObject) {
            StellarAccounts.updateBalance(index, key, balanceObject[key])
          }
        })
        .catch((err) => {
          StellarAccounts.updateBalance(index, 'XLM', 'ERROR')

          this.debugLog(err)
        })
    },
    createAccount() {
      this.debugLog('create account:', true)

      StellarAccounts.createAccount()
    },
    listenForPayment(index) {
      const accountID = StellarAccounts.publicKey(index)

      // Create an API call to query payments involving the account.
      const payments = this.su.server().payments()
        .forAccount(accountID)
        .cursor('now')

      // If some payments have already been handled, start the results from the
      // last seen payment. (See below in `handlePayment` where it gets saved.)
      // const lastToken = this.loadLastPagingToken()
      // if (lastToken) {
      //   payments.cursor(lastToken)
      // }

      payments.stream({
        onmessage: (payment) => {
          // this.savePagingToken(payment.paging_token)

          if (payment.to !== accountID) {
            return
          }

          let asset
          if (payment.asset_type === 'native') {
            asset = 'lumens'
          } else {
            asset = payment.asset_code + ':' + payment.asset_issuer
          }

          this.debugLog(payment.amount + ' ' + asset + ' from ' + payment.from)
        },
        onerror: (error) => {
          this.debugLog('listen err: ' + JSON.stringify(error))
        }
      })
    },
    savePagingToken(token) {
      // In most cases, you should save this to a local database or file so that
      // you can load it next time you stream new payments.
    },
    loadLastPagingToken() {
      // Get the last paging token from a local database or file
      return 0
    }
  }
}
</script>

<style scoped lang='scss'>
.output-container {
    width: 100%;
    height: 100%;
    overflow: auto;
    color: rgb(111,255,111);
    background: black;
}

.balances {
    padding: 20px;
    width: 100%;
    text-align: center;
    background: lightblue;
}

.buttons {
    display: flex;
}
</style>
