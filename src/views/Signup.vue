<template>
  <v-container fluid>

      <v-col cols="12" class="text-center mt-5" >
        <h1>Sign Up</h1>
      </v-col>
      <v-col class="mt-3" cols="12" sm="6" offset-sm="3" >
        <form @submit.prevent="userSignUp">

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
              required>
            </v-text-field>

            <v-text-field
              name="password"
              label="Password"
              id="password"
              type="password"
              v-model="password"
              required>
            </v-text-field>
            
            <v-text-field
              name="confirmPassword"
              label="Confirm Password"
              id="confirmPassword"
              type="password"
              required
              v-model="passwordConfirm"
              :rules="[comparePasswords]"
              >
            </v-text-field>
            
            <v-text-field
              name="displayName"
              label="Display Name"
              id="displayName"
              type="text"
              v-model="name"
              required>
            </v-text-field>

            <v-btn color="cyan" type="submit">Sign Up</v-btn>
        </form>
      </v-col>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      email: '',
      password: '',
      passwordConfirm: '',
      alert: false,
      name: ''
    }
  },
  computed: {
    comparePasswords () {
      return this.password === this.passwordConfirm ? true : 'Passwords don\'t match'
    },
    error () {
      return this.$store.state.error
    },
    loading () {
      return this.$store.state.loading
    }
  },
  methods: {
    userSignUp () {
      if (this.comparePasswords !== true) {
        return
      }
      this.$store.dispatch('userSignUp', { email: this.email, password: this.password, name: this.name })
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
