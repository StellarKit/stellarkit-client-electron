const shell = require('electron').shell

// app contents are in this package
import {
  start,
  HelperImplementation
} from 'stellar-client-web'

const implementation = {
  openBrowser: function(url) {
    shell.openExternal(url)
  },
  nodeEnv: function() {
    return true
  },
  applicationName: function() {
    return 'Stellar Client'
  }
}

HelperImplementation.setImplementation(implementation)

start()
