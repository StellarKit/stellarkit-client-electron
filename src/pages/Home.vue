<template>
<div>
  <div class='top-controls'>
    <v-btn small @click="createAccount()">Create Account</v-btn>
    <v-btn small @click="refresh()">Refresh</v-btn>
    <v-btn small @click="horizonMetrics()">Horizon</v-btn>

    <v-select :items="accountsUI" item-text='name' v-model="selectedSource" label="Source accout" autocomplete return-object max-height="600"></v-select>
    <v-select :items="accountsUI" item-text='name' v-model="selectedDest" label="Destination accout" autocomplete return-object max-height="600"></v-select>
    <v-btn small @click='swapSourceDest()'>Swap Source/Dest</v-btn>
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
  </div>

  <div class='balances'>
    <h2>Accounts</h2>
    <div class='accounts'>
      <div class='account-item' v-for="item in accountsUI" @click='clickAccount(item)' :key='item.name'>
        {{item.name}}<br> XLM: {{item.XLM}}<br>LMB: {{item.LMB}}<br>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import StellarCommonMixin from '../components/StellarCommonMixin.js'
import StellarAccounts from '../js/StellarAccounts.js'

export default {
  mixins: [StellarCommonMixin],
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
          this.debugLog(response, 'Success')
        })
        .catch((error) => {
          this.debugLog(error, 'Error')
        })
    },
    clickAccount(item) {
      this.infoForPublicKey(item.publicKey)
      this.debugLog(item.masterKey)
      this.debugLog(item.name)
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

          this.debugLog(response, 'Success')
        })
        .catch((error) => {
          this.debugLog(error, 'Error')
        })
    },
    payWithSigners() {
      this.su.sendAsset(this.selectedSource, this.selectedDest.publicKey, '122', null, null, [this.selectedSigner.masterKey])
        .then((response) => {
          this.updateBalances()

          this.debugLog(response, 'Success')
        })
        .catch((error) => {
          this.debugLog(error, 'Error')
        })
    },
    setSignerForSelected() {
      this.debugLog('set signer')

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
          this.debugLog(response)
        })
    },
    paymentsForSelectedSource() {
      this.su.server().payments()
        .forAccount(this.selectedSource.publicKey)
        .call()
        .then((response) => {
          this.debugLog(response)
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
      this.infoForPublicKey(this.selectedSource.publicKey)
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
    deleteSelectedSource() {
      StellarAccounts.deleteAccount(this.selectedSource.publicKey)
    },
    makeSelectedPayment() {
      this.debugLog('paying')

      this.su.sendAsset(this.selectedSource, this.selectedDest.publicKey, '122')
        .then((response) => {
          this.updateBalances()

          this.debugLog(response, 'Success')
        })
        .catch((error) => {
          this.debugLog(error, 'Error')
        })
    },
    refresh() {
      this.debugLog('refresh')
      this.updateBalances()
    },
    listenForPayments() {
      for (let i = 0; i < StellarAccounts.accounts().length; i++) {
        this.listenForPayment(i)
      }
    },
    updateBalances() {
      this.su.updateBalances()
    },
    createAccount() {
      this.debugLog('create account:')

      this.su.createTestAccount()
        .then((result) => {
          this.lowballerAcct = result
        })
        .catch((error) => {
          this.debugLog(error)
        })
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
.top-controls {
    padding: 20px;
}

.balances {
    padding: 10px;
    background: steelblue;
    box-shadow: 0 7px 12px -7px rgba(0,0,0,.7);
    color: white;
    text-align: center;

    .accounts {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        text-align: center;

        .account-item {
            color: black;
            font-weight: bold;
            font-size: 0.85em;
            margin: 5px;
            padding: 15px;
            border: solid 1px rgba(0,0,0,.4);
            border-radius: 8px;
            background: white;
            box-shadow: 0 7px 12px -7px rgba(0,0,0,.7);
        }
    }
}
</style>
