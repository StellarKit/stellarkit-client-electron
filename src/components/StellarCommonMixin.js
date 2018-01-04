 import StellarAccounts from '../js/StellarAccounts.js'
 import StellarUtils from '../js/StellarUtils.js'
 import Helper from '../js/helper.js'

 export default {
   data() {
     return {
       consoleOutput: '',
       su: null,
       accountsUI: [],
       snackbarPing: false,
       snackbarText: ''
     }
   },
   created() {
     this.su = new StellarUtils()
   },
   mounted() {
     this.updateAccountsUI()
     Helper.vue().$on('stellar-accounts-updated', this.updateAccountsUI)
   },
   methods: {
     toast(message) {
       this.snackbarText = message
       this.snackbarPing = !this.snackbarPing
     },
     debugLog(result, clear = false, tag = null) {
       if (clear) {
         this.consoleOutput = ''
       }

       let newText = ''

       if (tag) {
         newText += tag + ': '
       }

       newText += '<br>=========================================<br>'

       newText += '<pre>' + this.su.toStr(result) + '<br></pre>'
       this.consoleOutput = newText + this.consoleOutput
     },
     // private
     updateAccountsUI() {
       this.accountsUI = StellarAccounts.accounts()
     }
   }
 }
