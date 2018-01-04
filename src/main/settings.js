const nconf = require('nconf')
const app = require('electron').app

class Settings {
  constructor(filename) {
    const dir = app.getPath('appData')

    // uncomment to see where the pref is stored
    // console.log(dir + '/' + filename);

    nconf.file({
      file: dir + '/' + filename,
      secure: {
        secret: '-=-nevermind-=-',
        alg: 'aes-256-ctr'
      }
    })
  }

  set(settingKey, settingValue) {
    nconf.set(settingKey, settingValue)
    nconf.save()

    return true
  }

  get(settingKey) {
    nconf.load()
    let result = nconf.get(settingKey)

    if (result === undefined) {
      result = null
    }

    return result
  }
}

module.exports = Settings
