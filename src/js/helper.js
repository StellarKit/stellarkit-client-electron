 import Vue from 'vue'

 export default class Helper {
   static vue() {
     // class variable, seems to work, but not 100% sure it's good
     if (!this.vueInstance) {
       this.vueInstance = new Vue()
     }

     return this.vueInstance
   }

   static emit(event, ...message) {
     this.vue().$emit(event, ...message)
   }

   static strlen(inString) {
     if (!inString) {
       return 0
     }

     return inString.length
   }
 }
