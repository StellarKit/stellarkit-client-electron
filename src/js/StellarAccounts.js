const StellarSdk = require('stellar-sdk')
import {
  ipcRenderer
} from 'electron'
const generateName = require('sillyname')
const $ = require('jquery')
import Helper from '../js/helper.js'
import StellarUtils from '../js/StellarUtils.js'

class StellarAccounts {
  constructor() {
    this._accounts = []

    this.su = new StellarUtils()

    this.loadAccounts()
  }

  ethereumAsset() {
    return new StellarSdk.Asset('ETH', 'GBAI66I4B7IX7NGK2BUBUQK2WUH4SKXTGUNAHCZ6X35TA2ORD4SIPQ3D')
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
    ipcRenderer.send('get', 'accounts', this._accounts)
    const accounts = ipcRenderer.sendSync('get', 'accounts')

    if (accounts.length > 0) {
      this._accounts = accounts
    } else {
      console.log('no accounts')
    }
  }

  saveAccounts() {
    ipcRenderer.send('set', 'accounts', this._accounts)

    Helper.emit('stellar-accounts-updated')
  }

  logResult(result, sucess = true) {
    console.log((sucess ? 'Success: ' : 'Error: ') + JSON.stringify(result))
  }

  createAccount(name = null) {
    const newPair = StellarSdk.Keypair.random()

    const acct = {
      name: name !== null ? name : generateName(),
      XLM: '',
      LMB: '',
      masterKey: newPair.secret(),
      publicKey: newPair.publicKey()
    }

    this._accounts.push(acct)
    this.saveAccounts()

    $.get('https://horizon-testnet.stellar.org/friendbot' + '?addr=' + newPair.publicKey(), (data) => {
      this.su.server().loadAccount(newPair.publicKey())
        .then((account) => {
          account.balances.forEach((balance) => {
            if (balance.asset_type === 'native') {
              acct.XLM = balance.balance
            } else {
              acct[balance.asset_code] = balance.balance
            }
          })
          this.saveAccounts()
        })
        .catch((error) => {
          this.su.log(error)
        })
    }, 'json').fail((err) => {
      this.logResult(err, false)
    })

    return acct
  }
}

const singleton = new StellarAccounts()

export default singleton
