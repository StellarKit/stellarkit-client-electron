<template>
<div class='dialog-header'>
  <div class='dialog-header-text'>
    <p>{{title}}</p>
  </div>

  <v-tooltip open-delay='200' bottom>
    <v-btn v-if='showPrint' icon dark @click="buttonClick('print')" slot="activator">
      <v-icon>print</v-icon>
    </v-btn>
    <span>Print</span>
  </v-tooltip>

  <v-tooltip open-delay='200' bottom>
    <v-btn icon dark @click="buttonClick('close')" slot="activator">
      <v-icon>{{icon}}</v-icon>
    </v-btn>
    <span v-html='tooltip'></span>
  </v-tooltip>

</div>
</template>

<script>
export default {
  props: ['title', 'help', 'showPrint'],
  computed: {
    tooltip: function () {
      if (this.help) {
        return 'Help'
      }
      return 'Close'
    },
    icon: function () {
      return this.help ? 'help_outline' : 'close'
    }
  },
  methods: {
    buttonClick(buttonID) {
      this.$emit(buttonID)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../scss/styles.scss';
.dialog-header {
    width: 100%;
    display: flex;
    position: relative;
    justify-content: flex-end;
    align-items: center;
    background: $active-color;
    padding-right: 6px;
    box-shadow: 0 0 4px rgba(0, 0, 0, .5);
    flex: 0 0 40px;

    button {
        margin: 2px;
    }

    .dialog-header-text {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        pointer-events: none;
        text-align: center;

        display: flex;
        justify-content: center;
        flex-direction: column;

        p {
            color: $text-color;
            font-weight: $bold;
            font-size: 1.2em;
            margin: 0;
            user-select: none;
        }
    }
}
</style>
