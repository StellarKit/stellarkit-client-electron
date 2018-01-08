<template>
<v-navigation-drawer absolute clipped temporary v-model="drawer" light>
  <v-toolbar flat>
    <v-list>
      <v-list-tile>
        <v-list-tile-title class="title">
          StellarKit
        </v-list-tile-title>
      </v-list-tile>
    </v-list>
  </v-toolbar>
  <v-divider></v-divider>
  <v-list dense class="pt-0">
    <v-list-tile v-for="item in items" :key="item.title" @click="clickItem(item)">
      <v-list-tile-action>
        <v-icon>{{ item.icon }}</v-icon>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title>{{ item.title }}</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
  </v-list>
</v-navigation-drawer>
</template>

<script>
export default {
  props: ['ping'],
  watch: {
    ping: function () {
      this.drawer = true
      console.log('ping')
    }
  },
  data() {
    return {
      drawer: false,
      items: [{
          title: 'Donate',
          icon: 'dashboard'
        },
        {
          title: 'About',
          icon: 'question_answer'
        },
        {
          title: 'Settings',
          icon: 'question_answer'
        }
      ]
    }
  },
  methods: {
    clickItem(item) {
      this.drawer = false
    }
  }
}
</script>
