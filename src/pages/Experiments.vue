<template>
<div>
  <v-btn @click="toolbarClick('test')">test</v-btn>
</div>
</template>

<script>
import $ from 'jquery'
import md5 from 'md5'

export default {
  data() {
    return {}
  },
  methods: {
    test() {
      // const url = 'http://localhost:3000/api/gen'
      const url = 'https://pf7bundle.mybluemix.net/api/gen'

      const name = 'Steve Gehrman'
      const email = 'steve@distantfutu.re'

      const salt = '!$alty!'
      const santizedName = name.trim().replace(/[^a-zA-Z0-9 .]/, '')
      const hash = md5(santizedName + salt)

      $.get(url, {
        name: name,
        email: email,
        hash: hash
      }, (serverResult) => {
        console.log(serverResult)
      }).fail(() => {
        console.log('failure')
      })
    },
    toolbarClick(id) {
      switch (id) {
        case 'test':
          this.test()
          break
        default:
          console.log('no button with that name')
          break
      }
    }
  }
}
</script>
 
