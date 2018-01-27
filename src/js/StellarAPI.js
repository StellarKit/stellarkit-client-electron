const StellarSdk = require('stellar-sdk')
const $ = require('jquery')

export default class StellarAPI {
  constructor(serverAPIServer) {
    this._serverAPIServer = serverAPIServer
  }

  server() {
    return this._serverAPIServer.server()
  }

  serverURL() {
    return this._serverAPIServer.serverURL()
  }

  horizonMetrics() {
    const url = this.serverURL() + '/metrics'

    const promise = new Promise((resolve, reject) => {
      $.get(url, (response) => {
        resolve(response)
      }, 'json').fail((error) => {
        reject(error)
      })
    })
    return promise
  }

  accountInfo(publicKey) {
    const promise = new Promise((resolve, reject) => {
      this.server().loadAccount(publicKey)
        .then((response) => {
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
    return promise
  }

  balances(publicKey) {
    const promise = new Promise((resolve, reject) => {
      this.server().loadAccount(publicKey)
        .catch(StellarSdk.NotFoundError, (error) => {
          reject(error)
        })
        .then((account) => {
          const result = {}

          account.balances.forEach((balance) => {
            if (balance.asset_type === 'native') {
              result['XLM'] = balance.balance
            } else {
              result[balance.asset_code] = balance.balance
            }
          })

          return result
        })
        .then((result) => {
          resolve(result)
        })
        .catch((error) => {
          reject(error)
        })
    })

    return promise
  }

  mergeAccount(sourceAcct, destKey) {
    const promise = new Promise((resolve, reject) => {
      this.server().loadAccount(sourceAcct.publicKey)
        .catch(StellarSdk.NotFoundError, (error) => {
          reject(error)
        })
        .then((account) => {
          const transaction = new StellarSdk.TransactionBuilder(account)
            .addOperation(StellarSdk.Operation.accountMerge({
              destination: destKey
            }))
            .build()

          const sourceKeys = StellarSdk.Keypair.fromSecret(sourceAcct.masterKey)

          transaction.sign(sourceKeys)
          return this.server().submitTransaction(transaction)
        })
        .then((response) => {
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })

    return promise
  }

  manageOffer(sourceAcct, buying, selling, amount, price, offerID = 0) {
    const promise = new Promise((resolve, reject) => {
      this.server().loadAccount(sourceAcct.publicKey)
        .catch(StellarSdk.NotFoundError, (error) => {
          reject(error)
        })
        .then((account) => {
          const transaction = new StellarSdk.TransactionBuilder(account)
            .addOperation(StellarSdk.Operation.manageOffer({
              selling: selling,
              buying: buying,
              amount: amount,
              price: price,
              offerId: offerID
            }))
            .build()

          const sourceKeys = StellarSdk.Keypair.fromSecret(sourceAcct.masterKey)

          transaction.sign(sourceKeys)
          return this.server().submitTransaction(transaction)
        })
        .then((response) => {
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })

    return promise
  }

  setTrustForAsset(buyerAcct, asset, amount) {
    const promise = new Promise((resolve, reject) => {
      this.server().loadAccount(buyerAcct.publicKey)
        .catch(StellarSdk.NotFoundError, (error) => {
          reject(error)
        })
        .then((account) => {
          const transaction = new StellarSdk.TransactionBuilder(account)
            .addOperation(StellarSdk.Operation.changeTrust({
              asset: asset,
              limit: amount
            }))
            .build()

          const distKeys = StellarSdk.Keypair.fromSecret(buyerAcct.masterKey)

          transaction.sign(distKeys)

          return this.server().submitTransaction(transaction)
        })
        .then((response) => {
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })

    return promise
  }

  setDomain(acct, domain) {
    const promise = new Promise((resolve, reject) => {
      this.server().loadAccount(acct.publicKey)
        .then((issuer) => {
          const transaction = new StellarSdk.TransactionBuilder(issuer)
            .addOperation(StellarSdk.Operation.setOptions({
              homeDomain: domain
            }))
            .build()

          const issuingKeys = StellarSdk.Keypair.fromSecret(acct.masterKey)

          transaction.sign(issuingKeys)
          return this.server().submitTransaction(transaction)
        })
        .then((response) => {
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })

    return promise
  }

  makeMultiSig(sourceAcct, publicKey) {
    const promise = new Promise((resolve, reject) => {
      this.server().loadAccount(sourceAcct.publicKey)
        .catch(StellarSdk.NotFoundError, (error) => {
          reject(error)
        })
        .then((account) => {
          const transaction = new StellarSdk.TransactionBuilder(account)
            .addOperation(StellarSdk.Operation.setOptions({
              signer: {
                ed25519PublicKey: publicKey,
                weight: 1
              }
            }))
            .addOperation(StellarSdk.Operation.setOptions({
              masterWeight: 1, // set master key weight
              lowThreshold: 1,
              medThreshold: 2, // a payment is medium threshold
              highThreshold: 2 // make sure to have enough weight to add up to the high threshold!
            }))
            .build()

          const sourceKeys = StellarSdk.Keypair.fromSecret(sourceAcct.masterKey)

          transaction.sign(sourceKeys)

          return this.server().submitTransaction(transaction)
        })
        .then((response) => {
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })

    return promise
  }

  sendAsset(sourceAcct, destKey, amount, asset = null, memo = null, additionalSigners = null) {
    const promise = new Promise((resolve, reject) => {
      this.server().loadAccount(destKey)
        .catch(StellarSdk.NotFoundError, (error) => {
          reject(error)
        })
        .then(() => {
          return this.server().loadAccount(sourceAcct.publicKey)
        })
        .then((sourceAccount) => {
          let builder = new StellarSdk.TransactionBuilder(sourceAccount)
            .addOperation(StellarSdk.Operation.payment({
              destination: destKey,
              asset: asset === null ? StellarSdk.Asset.native() : asset,
              amount: amount
            }))

          if (memo) {
            builder = builder.addMemo(StellarSdk.Memo.text(memo))
          }

          const transaction = builder.build()

          const sourceKeys = StellarSdk.Keypair.fromSecret(sourceAcct.masterKey)
          transaction.sign(sourceKeys)

          if (additionalSigners) {
            for (const signerKey of additionalSigners) {
              transaction.sign(StellarSdk.Keypair.fromSecret(signerKey))
            }
          }

          return this.server().submitTransaction(transaction)
        })
        .then((response) => {
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })

    return promise
  }

  hasAssetTrustline(account, asset) {
    let trusted = false
    trusted = account.balances.some((balance) => {
      return balance.asset_code === asset.getCode() &&
        balance.asset_issuer === asset.getIssuer()
    })

    return trusted
  }

  buyTokens(buyerAcct, sendAsset, destAsset, sendMax, destAmount) {
    const promise = new Promise((resolve, reject) => {
      this.server().loadAccount(buyerAcct.publicKey)
        .catch(StellarSdk.NotFoundError, (error) => {
          reject(error)
        })
        .then((account) => {
          if (this.hasAssetTrustline(account, destAsset)) {
            const transaction = new StellarSdk.TransactionBuilder(account).addOperation(
                StellarSdk.Operation.pathPayment({
                  destination: buyerAcct.publicKey,
                  sendAsset: sendAsset,
                  sendMax: sendMax,
                  destAsset: destAsset,
                  destAmount: destAmount,
                  path: []
                })
              )
              .build()

            const sourceKeys = StellarSdk.Keypair.fromSecret(buyerAcct.masterKey)

            transaction.sign(sourceKeys)

            return this.server().submitTransaction(transaction)
          } else {
            reject('No trustline from buyer to asset')
          }
        }).then((response) => {
          resolve(response)
        }).catch((error) => {
          reject(error)
        })
    })

    return promise
  }

  lockAccount(account) {
    const promise = new Promise((resolve, reject) => {
      const options = {
        masterWeight: 0, // set master key weight to zero
        lowThreshold: 1,
        medThreshold: 1,
        highThreshold: 1
      }

      this.setOptions(account, options)
        .then((response) => {
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })

    return promise
  }

  setOptions(sourceAcct, options) {
    const promise = new Promise((resolve, reject) => {
      this.server().loadAccount(sourceAcct.publicKey)
        .catch(StellarSdk.NotFoundError, (error) => {
          reject(error)
        })
        .then((account) => {
          const transaction = new StellarSdk.TransactionBuilder(account)
            .addOperation(StellarSdk.Operation.setOptions(options))
            .build()

          const sourceKeys = StellarSdk.Keypair.fromSecret(sourceAcct.masterKey)
          transaction.sign(sourceKeys)

          return this.server().submitTransaction(transaction)
        })
        .then((response) => {
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })

    return promise
  }
}
