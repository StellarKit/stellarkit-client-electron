const StellarSdk = require('stellar-sdk')
const generateName = require('sillyname')
import Helper from '../js/helper.js'

class StellarAccounts {
  constructor() {
    this._accounts = []

    this.loadAccounts()
  }

  addAccount(keyPair, balances, name = null) {
    const acct = {
      name: name !== null ? name : generateName(),
      XLM: balances.XLM,
      LMB: balances.LMB,
      masterKey: keyPair.secret(),
      publicKey: keyPair.publicKey()
    }

    this._accounts.push(acct)
    this.saveAccounts()

    return acct
  }

  ethereumAsset() {
    return new StellarSdk.Asset('ETH', this.accountWithName('Issuer').publicKey)
  }

  btcAsset() {
    return new StellarSdk.Asset('BTC', this.accountWithName('Issuer').publicKey)
  }

  lamboTokenAsset() {
    return new StellarSdk.Asset('LMB', this.accountWithName('Issuer').publicKey)
  }

  accounts() {
    return this._accounts.slice()
  }

  deleteAccount(publicKey) {
    const index = this.accountIndexWithPublicKey(publicKey)

    if (index !== -1) {
      this._accounts.splice(index, 1)

      this.saveAccounts()
    } else {
      console.log('index not found')
    }
  }

  accountWithName(name) {
    for (const val of this._accounts) {
      if (name === val.name) {
        return val
      }
    }
    return null
  }

  accountIndexWithPublicKey(publicKey) {
    for (const [index, val] of this._accounts.entries()) {
      if (publicKey === val.publicKey) {
        return index
      }
    }
    return -1
  }

  updateBalance(index, symbol, balance) {
    const acct = this._accounts[index]

    acct[symbol] = balance

    this.saveAccounts()
  }

  masterKey(index) {
    const acct = this._accounts[index]

    return acct.masterKey
  }

  publicKey(index) {
    const acct = this._accounts[index]

    return acct.publicKey
  }

  keyPair(index) {
    const acct = this._accounts[index]
    return StellarSdk.Keypair.fromSecret(acct.masterKey)
  }

  loadAccounts() {
    const accounts = Helper.get('accounts')

    if (accounts && accounts.length > 0) {
      this._accounts = accounts
    } else {
      console.log('no accounts')
    }
  }

  saveAccounts() {
    Helper.set('accounts', this._accounts)

    Helper.emit('stellar-accounts-updated')
  }

  logResult(result, sucess = true) {
    console.log((sucess ? 'Success: ' : 'Error: ') + JSON.stringify(result))
  }
}

const singleton = new StellarAccounts()

export default singleton
