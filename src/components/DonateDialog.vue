<template>
<v-dialog lazy v-model='visible' scrollable @keydown.esc="visible = false" max-width="600">
  <div class='main-container'>
    <div class='input-title'>
      Your XLM donation is appreciated.
    </div>
    <v-text-field label="XLM" v-model.trim="value1" @keyup.enter="enterKeyAction()" id='autofocusTextField' required></v-text-field>
    <v-text-field label="Secret Key" v-model.trim="value2" @keyup.enter="enterKeyAction()"></v-text-field>

    <div class='button-holder'>
      <v-btn round color='secondary' @click="visible = false">
        Cancel
      </v-btn>
      <v-btn round color='primary' @click="enterKeyAction()">
        Donate
      </v-btn>
    </div>
  </div>
</v-dialog>
</template>

<script>
import $ from 'jquery'
import Helper from '../js/helper.js'

export default {
  props: ['ping'],
  watch: {
    ping: function () {
      this.visible = true
      this.$nextTick(() => {
        $('#autofocusTextField').focus()
      })
    }
  },
  data() {
    return {
      visible: false,
      ledgerStatus: '',
      value1: '',
      value2: ''
    }
  },
  methods: {
    enterKeyAction() {
      if (Helper.strlen(this.value1)) {
        this.visible = false
        this.$emit('close', true, this.value1, this.value2)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../scss/styles.scss';

.main-container {
    @include standard-dialog-contents();

    padding: 20px;

    .input-title {
        font-size: 1.2em;
    }

    .button-holder {
        display: flex;
        justify-content: flex-end;
    }
}
</style>
