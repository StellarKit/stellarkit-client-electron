const StellarSdk = require('stellar-sdk')
const $ = require('jquery')
import StellarAccounts from './StellarAccounts.js'
import StellarServer from './StellarServer.js'

export default class StellarUtils {
  constructor() {
    this.s = new StellarServer()
  }

  server() {
    return this.s.server()
  }

  friendBotServer() {
    return this.s.friendBotServer()
  }

  lumins() {
    return StellarSdk.Asset.native()
  }

  assetFromObject(object) {
    if (!object.asset_issuer) {
      return StellarSdk.Asset.native()
    }

    return new StellarSdk.Asset(object.asset_code, object.asset_issuer)
  }

  toStr(object) {
    if (object instanceof Error) {
      const json = JSON.stringify(object, null, '  ')

      // seems to return {} when it fails?
      const obj = JSON.parse(json)
      if (Object.keys(obj).length > 0) {
        return json
      }

      return object.toString()
    } else if (typeof object === 'string') {
      return object
    } else if (typeof object === 'object') {
      return JSON.stringify(object, null, '  ')
    }

    return typeof object
  }

  log(object) {
    console.log(this.toStr(object))
  }

  api() {
    return this.s.serverAPI()
  }

  horizonMetrics() {
    return this.api().horizonMetrics()
  }

  accountInfo(publicKey) {
    return this.api().accountInfo(publicKey)
  }

  balances(publicKey) {
    return this.api().balances(publicKey)
  }

  mergeAccount(sourceAcct, destKey) {
    return this.api().mergeAccount(sourceAcct, destKey)
  }

  manageOffer(sourceAcct, buying, selling, amount, price, offerID = 0) {
    return this.api().manageOffer(sourceAcct, buying, selling, amount, price, offerID)
  }

  setTrustForAsset(buyerAcct, asset, amount) {
    return this.api().setTrustForAsset(buyerAcct, asset, amount)
  }

  setDomain(acct, domain) {
    return this.api().setDomain(acct, domain)
  }

  makeMultiSig(sourceAcct, publicKey) {
    return this.api().makeMultiSig(sourceAcct, publicKey)
  }

  sendAsset(sourceAcct, destKey, amount, asset = null, memo = null, additionalSigners = null) {
    return this.api().sendAsset(sourceAcct, destKey, amount, asset, memo, additionalSigners)
  }

  hasAssetTrustline(account, asset) {
    return this.api().hasAssetTrustline(account, asset)
  }

  buyTokens(buyerAcct, sendAsset, destAsset, sendMax, destAmount) {
    return this.api().buyTokens(buyerAcct, sendAsset, destAsset, sendMax, destAmount)
  }

  lockAccount(account) {
    return this.api().lockAccount(account)
  }

  setOptions(sourceAcct, options) {
    return this.api().setOptions(sourceAcct, options)
  }

  createTestAccount(name = null) {
    const promise = new Promise((resolve, reject) => {
      const keyPair = StellarSdk.Keypair.random()

      const url = 'https://horizon-testnet.stellar.org/friendbot' + '?addr=' + keyPair.publicKey()

      $.get(url, (data) => {
        // user setup by friendbot won't be on our server until it syncs, so just use stellars testnet
        this.friendBotServer().loadAccount(keyPair.publicKey())
          .then((account) => {
            const balances = {}

            account.balances.forEach((balance) => {
              if (balance.asset_type === 'native') {
                balances.XLM = balance.balance
              } else {
                balances[balance.asset_code] = balance.balance
              }
            })

            resolve(StellarAccounts.addAccount(keyPair, balances, name))
          })
          .catch((error) => {
            this.log(data)
            reject(error)
          })
      }, 'json').fail((err) => {
        reject(err)
      })
    })
    return promise
  }

  updateBalances() {
    for (let i = 0; i < StellarAccounts.accounts().length; i++) {
      this.updateBalance(i)
    }
  }

  updateBalance(index) {
    this.balances(StellarAccounts.publicKey(index))
      .then((balanceObject) => {
        for (const key in balanceObject) {
          StellarAccounts.updateBalance(index, key, balanceObject[key])
        }
      })
      .catch((err) => {
        StellarAccounts.updateBalance(index, 'XLM', 'ERROR')

        this.log(err)
      })
  }
}
