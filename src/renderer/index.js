const shell = require('electron').shell

window.electronAccess = {
  openBrowser: function(url) {
    shell.openExternal(url)
  },
  nodeEnv: function() {
    return true
  }
}

// app contents are in this package
import {
  start
} from 'stellar-client-web'

start()
