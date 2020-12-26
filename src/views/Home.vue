<template>
  <v-container fluid>
  Home
  </v-container>
</template>

<script>
export default {
  name: 'Home',
  metaInfo: {
      title: 'Recipes - One Stoop',
      // override the parent template and just use the above title only
      titleTemplate: null
    },
  data () {
    return {
      breadcrumbs: [
        {
          text: 'Dashboard',
          disabled: false,
          href: '/',
        }
      ]
    }
  },
  methods: {
    autoRefreshToken () {
      this.$store.dispatch('refreshToken')
    }
  },
  mounted () {
    document.title = "Recipes - One Stoop"
    let vm = this
    this.autoRefreshToken()
    setTimeout(function () { vm.$store.dispatch('refreshToken') }, 3300000)
  },
  beforeDestroy: function () {
  }
}
</script>
