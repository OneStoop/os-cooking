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
    addrecipesLoading: false,
    authorName: null,
    baseurl: 'http://localhost:8081',
    loading: false,
    myRecipes: [],
    profile: null,
    recipe: null,
    recipeTypes: {types:
      [
        "Appetizers",
        "Breads",
        "Desserts",
        "Drinks",
        "Main dishes",
        "Salads",
        "Sauces",
        "Side dishes",
        "Soups"
      ]
    },
    recipes: [],
    recipesLoading: false,
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
    setmyRecipes (state, payload) {
      state.myRecipes = payload
    },
    setProfile (state, payload) {
      state.profile = payload
    },
    setRecipe (state, payload) {
      state.recipe = payload
      state.authorName = null
    },
    setRecipes (state, payload) {
      state.recipes = payload
    },
    setRecipeAuthor (state, payload) {
      state.authorName = payload
    },
    setaddrecipesLoading (state, payload) {
      state.addrecipesLoading = payload
    },
    setrecipesLoading (state, payload) {
      state.recipesLoading = payload
    },
    setToken (state, payload) {
      state.token = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    setmyRecipesAdd (state, payload) {
      console.log(payload)
      state.myRecipes.moreResults = payload.moreResults
      state.myRecipes.nextOffset = payload.nextOffset
      for (var i=0; i < payload.recipes.length; i++) {
        state.myRecipes.recipes.splice(state.myRecipes.recipes.length, 0, payload.recipes[i])
      }
    },
    setRecipesAdd (state, payload) {
      console.log(payload)
      state.recipes.moreResults = payload.moreResults
      state.recipes.nextOffset = payload.nextOffset
      for (var i=0; i < payload.recipes.length; i++) {
        state.recipes.recipes.splice(state.recipes.recipes.length, 0, payload.recipes[i])
      }
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
        }
      })
    },
    getRecipe ({ commit }, recipeId) {
      function doGet (recipeId, count) {
        var auth = {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': store.state.token }
        }
        axios.get(process.env.VUE_APP_API_SERVER + 'recipes?recipeId=' + recipeId, auth)
          .then(function (response) {
            commit('setRecipe', response.data.recipes[0])
            
            axios.get(process.env.VUE_APP_API_SERVER + 'users?displayName=true&userId=' + response.data.recipes[0].authorId, auth)
            .then(function (response2) {
              commit('setRecipeAuthor', response2.data.user.displayName)
            })
          })
          .catch(function (error) {
            if (error.response.data.status === 'expired' && count < 3) {
              count++
              store.dispatch('refreshToken')
              setTimeout(doGet(recipeId, count), 1000)
            }
            commit('setRecipe', null)
          })
      }
      var count = 0
      doGet(recipeId, count)
    },
    addRecipes ({ commit }, query) {
      
      commit('setaddrecipesLoading', true)
      var parmsObj = Object.entries(query)
      var parms = "?"

      for (var i=0; i < parmsObj.length; i++) {
        if (i > 0) {
          parms += "&"
        }
        parms += parmsObj[i][0] + "=" + parmsObj[i][1]
      }
      
      var auth = {
        headers: { 'Content-Type': 'application/json', 'Authorization': store.state.token }
      }
      
      axios.get(process.env.VUE_APP_API_SERVER + 'recipes' + parms, auth)
        .then(response => {
          commit('setRecipesAdd', response.data)
          commit('setaddrecipesLoading', false)
        })
        .catch(function () {
          commit('setaddrecipesLoading', false)
        })
    },
    addmyRecipes ({ commit }, query) {
      if (store.state.addrecipesLoading) {
        return
      }
      commit('setaddrecipesLoading', true)
      var parmsObj = Object.entries(query)
      var parms = "?"

      for (var i=0; i < parmsObj.length; i++) {
        if (i > 0) {
          parms += "&"
        }
        parms += parmsObj[i][0] + "=" + parmsObj[i][1]
      }
      
      var auth = {
        headers: { 'Content-Type': 'application/json', 'Authorization': store.state.token }
      }

      axios.get(process.env.VUE_APP_API_SERVER + 'recipes' + parms, auth)
        .then(response => {
          commit('setmyRecipesAdd', response.data)
          commit('setaddrecipesLoading', false)
        })
        .catch(function () {
          commit('setaddrecipesLoading', false)
        })
    },
    getRecipes ({ commit }, query) {
      
      commit('setrecipesLoading', true)
      var parmsObj = Object.entries(query)
      var parms = "?"

      for (var i=0; i < parmsObj.length; i++) {
        if (i > 0) {
          parms += "&"
        }
        parms += parmsObj[i][0] + "=" + parmsObj[i][1]
      }
      
      var auth = {
        headers: { 'Content-Type': 'application/json', 'Authorization': store.state.token }
      }
      
      axios.get(process.env.VUE_APP_API_SERVER + 'recipes' + parms, auth)
        .then(response => {
          commit('setRecipes', response.data)
          commit('setrecipesLoading', false)
        })
        .catch(function () {
          commit('setrecipesLoading', false)
        })
    },
    getMyRecipes ({ commit }) {
      function doGet (vm, count) {
        var auth = {
          headers: { 'Content-Type': 'application/json', 'Authorization': store.state.token }
        }
      
        axios.get(process.env.VUE_APP_API_SERVER + 'recipes?authorEmail=' + store.state.user.email, auth)
          .then(response => {
            console.log(response)
            if (response.data.status === "expired") {
              if (count < 3) {
                count++
                store.dispatch('refreshToken')
                setTimeout(doGet(count), 1000)
              }
              else {
                commit('setmyRecipes', response.data)
                commit('setrecipesLoading', false)
              }
            }
            else {
              commit('setmyRecipes', response.data)
              commit('setrecipesLoading', false)  
            }
          })
      }
    
      commit('setrecipesLoading', true)
      var count = 0
      doGet(this, count)
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
              console.log('logged in, redirecting')
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
    },
    getrecipesLoading: state => {
      return state.recipesLoading
    }
  }
})
export default store
