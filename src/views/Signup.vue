<template>
  <v-container fluid>

    <v-row>
      <v-col cols="4"></v-col>
      <v-col cols="" class="">
        <p class="">Sign up with</p>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="4"></v-col>
      <v-col cols="4" class="text-center">
        <v-btn @click="googleSignUP()" icon class="ml-20">
          <v-img src="https://storage.googleapis.com/onestoopimages01/btn_google_signin_light_normal_web.png"></v-img>
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="4"></v-col>
      <v-col cols="" class="">
        <p class="">Sign up email</p>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="4"></v-col>
      <v-col cols="4">
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
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'
import firebase from 'firebase/app'
import 'firebase/auth'
import router from '@/router'
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
    },
    googleSignUP () {
      var provider = new firebase.auth.GoogleAuthProvider()
      var vm = this

      firebase.auth().signInWithPopup(provider)
        .then(function(result) {
          var token = result.user._lat
          var user = result.user
          console.log(result)

          vm.$store.commit('setUser', { email: user.email })
          vm.$store.commit('setLoading', false)
          vm.$store.commit('setToken', token)
          axios.post(process.env.VUE_APP_API_SERVER + `users?token=` + token, {
            body: ''
          })
          .then(function() {
            var auth = {
              headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': vm.$store.state.token }
            }
            axios.get(process.env.VUE_APP_API_SERVER + 'users?email=' + vm.$store.state.user.email, auth)
            .then(function (response) {
              vm.$store.commit('setProfile', response.data)
            })
            .catch(function () {
              firebase.auth().signOut()
              vm.$store.commit('setUser', null)
            })
          })
          .catch(function() {
            var user = firebase.auth().currentUser
            user.delete().then(function () {
            // User deleted.
            }).catch(function () {})
            vm.$store.commit('setUser', null)
            router.push('/signin')
          })
          router.push('/')
        })
        .catch(function(error) {
          this.$store.commit('setError', error.message)
          this.$store.commit('setLoading', false)
        })
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
