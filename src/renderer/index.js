import {
  shell
} from 'electron'

// app contents are in this package
import {
  start,
  HelperImplementation,
  LedgerAPITransport
} from 'stellar-client-web'

const StellarTransportNode = require('@ledgerhq/hw-transport-node-hid').default

const implementation = {
  openBrowser: function(url) {
    shell.openExternal(url)
  },
  applicationName: function() {
    return 'Stellar Client'
  }
}

HelperImplementation.setImplementation(implementation)
LedgerAPITransport.setupForNode(StellarTransportNode)

start()
