<template>
<div v-if='valid' class='ticker-box'>
  <div><span class="dim-title">XLM</span> ${{price}}</div>
  <div :class="[ goingUp ? 'percent-up' : 'percent-down' ]">{{percentChange}}%</div>
</div>
</template>

<script>
// const request = require('request-promise-native')
const $ = require('jquery')

export default {
  data() {
    return {
      valid: false,
      goingUp: false,
      price: '',
      percentChange: ''
    }
  },
  mounted() {
    this.fetch()
    setInterval(() => {
      this.fetch()
    }, 10000)
  },
  methods: {
    fetch() {
      $.get('https://api.coinmarketcap.com/v1/ticker/stellar/', {
        json: true
      }, (data) => {
        const item = data[0]
        this.price = parseFloat(item.price_usd).toFixed(4)

        const percentage = parseFloat(item.percent_change_24h)
        this.goingUp = true
        if (percentage < 0) {
          this.goingUp = false
        }
        this.percentChange = percentage

        this.valid = true
      }, 'json').fail(() => {
        console.log('failed')
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.ticker-box {
    justify-content: center;
    flex-direction: column;
    display: flex;
    text-align: center;
    color: rgba(255,255,255,.8);
    font-size: 1em;
    user-select: none;
    pointer-events: none;

    div {
        margin: 0 8px;
        font-weight: bold;

        &.percent-up {
            color: rgb(100,255,100);
        }
        &.percent-down {
            color: red;
        }

        span.dim-title {
            color: rgba(255,255,255,.4);
        }
    }
}
</style>
