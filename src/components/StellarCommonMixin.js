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

       this.consoleOutput += '<pre>'
       if (tag) {
         this.consoleOutput += tag + ': '
       }

       this.consoleOutput += this.su.toStr(result) + '<br></pre>'
     },
     // private
     updateAccountsUI() {
       this.accountsUI = StellarAccounts.accounts()
     }
   }
 }
