const StellarSdk = require('stellar-sdk')

export default class StellarAPIServer {
  constructor(serverURL, testnet, serverOptions) {
    this._serverURL = serverURL
    this._testnet = testnet
    this._server = new StellarSdk.Server(serverURL, serverOptions)
  }

  server() {
    // this is global, so I set it everytime to be safe
    if (this._testnet) {
      StellarSdk.Network.useTestNetwork()
    } else {
      StellarSdk.Network.usePublicNetwork()
    }

    return this._server
  }

  testnet() {
    return this._testnet
  }

  serverURL() {
    return this._serverURL
  }
}
