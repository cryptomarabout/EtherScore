<template>
  <v-app id="main" style="
                background: rgb(168,144,254);
                background: linear-gradient(90deg, rgba(168,144,254,1) 0%, rgba(198,143,202,1) 35%, rgba(234,141,141,1) 100%);">
    <app-bar/>

    <v-main>
      <router-view/>
    </v-main>
    <app-footer/>
  </v-app>
</template>

<script>

import AppFooter from '@/components/AppFooter.vue'
import AppBar from '@/components/AppBar.vue'

export default {
  name: 'App',
  components: {
    AppFooter,
    AppBar
  },
  computed:{
    theme(){
      return (this.$vuetify.theme.dark) ? 'dark' : 'light'
    }
  }
};
</script>
