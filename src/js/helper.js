 import Vue from 'vue'
 import {
   ipcRenderer
 } from 'electron'

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

   static keyForKey(key) {
     return 'pref-' + key
   }

   static get(key) {
     let result = ipcRenderer.sendSync('get', this.keyForKey(key))

     // some defaults
     if (!result) {
       switch (key) {
         case 'server':
           result = 'testnet'
           break
         default:
           break
       }
     }

     return result
   }

   static set(key, value) {
     ipcRenderer.send('set', this.keyForKey(key), value)
   }

   static setWindowSize(width, height, center = false) {
     ipcRenderer.send('resizeWindow', width, height, center)
   }

   static quitApp() {
     ipcRenderer.send('quit')
   }
 }
