<template>
<v-app>
  <div class='main-container'>
    <v-tabs id="mobile-tabs-5" fixed light centered>
      <ticker-component />

      <v-toolbar color="grey lighten-4" light>
        <v-toolbar-side-icon></v-toolbar-side-icon>
        <v-toolbar-title>{{pageTitle()}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon>search</v-icon>
        </v-btn>
        <v-btn icon>
          <v-icon>more_vert</v-icon>
        </v-btn>
        <v-tabs-bar class="grey lighten-4" slot="extension">
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tabs-item to='/' class="primary--text">
            <v-icon>home</v-icon>
          </v-tabs-item>
          <v-tabs-item to='/buytoken' class="primary--text">
            <v-icon>account_box</v-icon>
          </v-tabs-item>
          <v-tabs-item to='/trades' class="primary--text">
            <v-icon>shop</v-icon>
          </v-tabs-item>
          <v-tabs-item to='/token' class="primary--text">
            <v-icon>monetization_on</v-icon>
          </v-tabs-item>
        </v-tabs-bar>
      </v-toolbar>
    </v-tabs>

    <div class='router-container '>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>

    <footer-component publicKey='GBRKGAEJ7NLGCSF66Q5HZIG7OCKUOKF3N2POSDDGS2VPIWZQCA5HGP3V' />
    <!-- <footer-component publicKey='GCYQSB3UQDSISB5LKAL2OEVLAYJNIR7LFVYDNKRMLWQKDCBX4PU3Z6JP' /> -->
  </div>
</v-app>
</template>

<script>
import TickerComponent from './components/TickerComponent.vue'
import FooterComponent from './components/FooterComponent.vue'

export default {
  components: {
    'ticker-component': TickerComponent,
    'footer-component': FooterComponent
  },
  data() {
    return {}
  },
  methods: {
    pageTitle() {
      return this.$router.currentRoute.name
    }
  }
}
</script>

<style>
@import url(https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons);

@import '../node_modules/vuetify/dist/vuetify.min.css'
</style>

<style lang='scss'>
// gets rid of scrollbars on desktop
body,
html {
    overflow: hidden;
    height: 100%;
    width: 100%;
}

#app {
    height: 100%;
}
</style>

<style scoped lang='scss'>
.main-container {
    display: flex;
    flex: 1;
    flex-direction: column;

    .router-container {
        width: 100%;
        flex: 1;
        overflow-y: auto;

        padding: 20px;
    }
}
</style>
