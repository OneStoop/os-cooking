<template>
  <v-container fluid>
  Home
  </v-container>
</template>

<script>
export default {
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
