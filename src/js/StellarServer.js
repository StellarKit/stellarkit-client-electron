const StellarSdk = require('stellar-sdk')
import Helper from '../js/helper.js'

export default class StellarServer {
  constructor() {
    // need to talk to stellar directly for friendbot createTestAccout
    this._friendBotServer = this._createServer('testnet')
  }

  server() {
    this._setupServer()
    return this._server
  }

  friendBotServer() {
    return this._friendBotServer
  }

  serverURL() {
    this._setupServer()

    return this._serverURL(this.serverKey)
  }

  _setupServer() {
    const serverKey = Helper.get('server')

    if (this.serverKey !== serverKey) {
      this._server = this._createServer(serverKey)
      this.serverKey = serverKey
    }
  }

  _createServer(network) {
    let result
    const url = this._serverURL(network)

    switch (network) {
      case 'testnet':
        StellarSdk.Network.useTestNetwork()
        result = new StellarSdk.Server(url)
        break
      case 'mainnet':
        StellarSdk.Network.usePublicNetwork()
        result = new StellarSdk.Server(url)
        break
      case 'local':
        StellarSdk.Network.useTestNetwork()

        result = new StellarSdk.Server(url, {
          allowHttp: true
        })
        break
      case 'stellarkit':
        StellarSdk.Network.useTestNetwork()
        result = new StellarSdk.Server(url)
        break
      default:
        console.log('ERROR: switch failed')
        break
    }

    return result
  }

  _serverURL(network) {
    let result
    const useGlobalIP = false

    switch (network) {
      case 'testnet':
        result = 'https://horizon-testnet.stellar.org'
        break
      case 'mainnet':
        result = 'https://horizon.stellar.org'
        break
      case 'local':
        if (useGlobalIP) {
          result = 'http://104.11.210.243:8000'
        } else {
          result = 'http://192.168.1.82:8000'
        }
        break
      case 'stellarkit':
        result = 'https://stellarkit.io:8000'
        break
      default:
        console.log('ERROR: switch failed')
        break
    }

    return result
  }
}
