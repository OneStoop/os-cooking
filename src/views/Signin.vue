<template>
  <v-container fluid>

      <v-col cols="12" class="text-center mt-5" >
        <h1>Sign In</h1>
      </v-col>
      <v-col class="mt-3" cols="12" sm="6" offset-sm="3" >
        <form @submit.prevent="userSignIn">

            <v-col>
              <v-alert type="error" dismissible v-model="alert">
                {{ error }}
              </v-alert>
            </v-col>

              <v-text-field
                name="email"
                label="Email"
                id="email"
                type="email"
                v-model="email"
                required></v-text-field>

              <v-text-field
                name="password"
                label="Password"
                id="password"
                type="password"
                v-model="password"
                required></v-text-field>

              <v-btn color="cyan" type="submit">Sign In</v-btn>
        </form>
      </v-col>
      
      <v-col cols="12" class="text-center">
        <router-link :to="'/signup'" style="text-decoration: none;" class="mr-4">
          Don't have an account?  Sign up here
        </router-link>
      </v-col>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      email: '',
      password: '',
      alert: false
    }
  },
  methods: {
    userSignIn () {
      this.$store.dispatch('userSignIn', { email: this.email, password: this.password })
    }
  },
  computed: {
    error () {
      return this.$store.state.error
    },
    loading () {
      return this.$store.state.loading
    }
  },
  watch: {
    error (value) {
      if (value) {
        this.alert = true
      }
    },
    alert (value) {
      if (!value) {
        this.$store.commit('setError', null)
      }
    }
  }
}
</script>
