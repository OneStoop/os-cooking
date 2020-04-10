import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'
import axios from 'axios'
import firebase from 'firebase/app'
import 'firebase/auth'
import router from '@/router'

Vue.use(Vuex)

// var qs = require('qs')

const vuexLocalStorage = new VuexPersist({
  key: 'onestoop', // The key to store the state on in the storage provider.
  storage: window.localStorage // or window.sessionStorage or localForage
})

Vue.use(Vuex)

const store = new Vuex.Store({
  plugins: [vuexLocalStorage.plugin],
  state: {
    baseurl: 'http://localhost:8081',
    loading: false,
    profile: null,
    token: null,
    user: null
  },
  mutations: {
    setBaseurl (state, payload) {
      state.baseurl = payload
    },
    setLoading (state, payload) {
      state.loading = payload
    },
    setUser (state, payload) {
      state.user = payload
    },
    setProfile (state, payload) {
      state.profile = payload
    },
    setToken (state, payload) {
      state.token = payload
    },
    setError (state, payload) {
      state.error = payload
    }
  },
  actions: {
    autoSignIn ({ commit }, payload) {
      commit('setUser', { email: payload.email })
    },
    refreshToken ({ commit }) {
      console.log("refreshToken")
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          firebase.auth().currentUser.getIdToken(/* forceRefresh */ false).then(function (idToken) {
            commit('setToken', idToken)
          }).catch(function () {
          })
        } else { router.push('/signout') }
      })
    },
    userSignIn ({ commit }, payload) {
      commit('setLoading', true)
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(function () {
          return firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
            .then(firebaseUser => {
              console.log(firebaseUser)
              commit('setUser', { email: firebaseUser.user.email, uid: firebaseUser.user.uid })
              commit('setToken', firebaseUser.user._lat)
              commit('setLoading', false)
              commit('setError', null)
              console.log('logged in, redirecting to feed')
              router.push('/')
            })
            .catch(error => {
              commit('setError', error.message)
              commit('setLoading', false)
              firebase.auth().signOut()
              commit('setUser', null)
            })
        }).then(function () {
          var auth = {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': store.state.token }
          }
          console.log(auth)
          axios.get(process.env.VUE_APP_API_SERVER + 'users?email=' + store.state.user.email, auth)
            .then(function (response) {
              commit('setProfile', response.data)
            })
            .catch(function () {
              firebase.auth().signOut()
              commit('setUser', null)
            })
        })
        .catch(function () {
          // Handle Errors here.
          commit('setUser', null)
        })
    },
    userSignOut ({ commit }) {
      firebase.auth().signOut()
      commit('setUser', null)
      commit('setProfile', null)
      commit('clearPosts', null)
      commit('setToken', null)
      router.push('/')
    }
  },
  getters: {
    baseurl: state => {
      return state.baseurl
    },
    isAuthenticated: state => {
      return state.user !== null && state.user !== undefined
    },
    isNotAuthenticated: state => {
        if (state.user !== null && state.user !== undefined) {
          return false
        }
        else {
          return true
        }
    },
    profile: state => {
      return state.profile
    },
    token: state => {
      if (state.user !== null && state.user !== undefined && state.user !== null && state.token !== undefined) {
        return state.token
      } else {
        return null
      }
    },
    user: state => {
      return state.user
    }
  }
})
export default store
