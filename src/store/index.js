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
    actionRecipeLoading: false,
    addrecipesLoading: false,
    authorName: null,
    editRecipeDialog: false,
    editRecipeType: "",
    editRecipeLoading: false,
    error: null,
    loading: false,
    myRecipes: [],
    snackbar: false,
    snackbarMessage: "",
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
    recipes: null,
    recipesLoading: false,
    reviews: null,
    reviewDialog: false,
    reviewsLoading: false,
    searchModel: null,
    submitReviewLoading: false,
    token: null,
    user: null
  },
  mutations: {
    setActionRecipeLoading (state, payload) {
      state.actionRecipeLoading = payload
    },
    setreviewsLoading (state, payload) {
      state.reviewsLoading = payload
    },
    setsnackbar (state, payload) {
      state.snackbar = payload
    },
    setsnackbarMessage (state, payload) {
      state.snackbarMessage = payload
    },
    setsubmitReviewLoading (state, payload) {
      state.submitReviewLoading = payload
    },
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
    setreviewDialog (state, payload) {
      state.reviewDialog = payload
    },
    seteditRecipeDialog (state, payload) {
      state.editRecipeDialog = payload
    },
    seteditRecipeType (state, payload) {
      state.editRecipeType = payload
    },
    reSetRecipe (state) {
      var recipe = {
          authorId: "",
          bookmarked: 0,
          cookTime: 0,
          created_date: 0,
          cusine: "",
          description: "",
          directions: "",
          images: [],
          ingredients: [],
          mealTime: "",
          noates: "",
          prepTime: 0,
          rating: 0,
          ratingCount: 0,
          recipeSubType: "",
          recipeType: "",
          servings: 0,
          source: "",
          title: "",
          visibility: ""
        }
      state.recipe = recipe
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
    setsearchModel (state, payload) {
      state.searchModel = payload
    },
    setToken (state, payload) {
      state.token = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    setReviews (state, payload) {
      state.reviews = payload
    },
    setReviewsAdd (state, payload) {
      if (state.reviews === null) {
        state.reviews = {"reviews": []}
      }
      state.reviews.moreResults = payload.moreResults
      state.reviews.nextOffset = payload.nextOffset
      for (var i=0; i < payload.reviews.length; i++) {
        state.reviews.reviews.splice(state.reviews.reviews.length, 0, payload.reviews[i])
      }
    },
    setmyRecipesAdd (state, payload) {
      console.log(payload)
      state.myRecipes.moreResults = payload.moreResults
//       state.myRecipes.nextOffset = payload.nextOffset
      state.myRecipes.nextId = payload.nextId
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
      commit('setUser', { email: payload.email, uid: payload.uid })
    },
    refreshToken ({ commit }) {
      console.log("refreshToken")
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          user.getIdToken(true).then(function(accessToken) {
            commit('setToken', accessToken)
          })
          //console.log(user)
          //firebase.auth().currentUser.getIdToken(/* forceRefresh */ false).then(function (idToken) {
          //  commit('setToken', idToken)
          //}).catch(function () {
          //  console.log('some refresh error')
          //})
        }
      })
    },
    getRecipe ({ commit }, recipeId) {
      function doGet (recipeId, count) {
        var auth = {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': store.state.token }
        }
        axios.get(process.env.VUE_APP_API_SERVER + 'recipes/' + recipeId, auth)
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
            } else {
              router.push({ name: 'home'})
            }
            commit('setRecipe', null)
          })
      }
      var count = 0
      doGet(recipeId, count)
    },
    getReviews ({ commit }, data) {
      function doGet (recipeId, offset, limit, count) {
        var auth = {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': store.state.token }
        }

        var args = "?recipeId=" + recipeId + "&offset=" + offset + "&limit=" + limit
        console.log(args)
        axios.get(process.env.VUE_APP_API_SERVER + 'recipes/' + recipeId + "/reviews" + args, auth)
          .then(function (response) {
            var data = response.data
            for (var i=0; i < data.reviews.length; i++) {
              var a = data.reviews[i].created_date
              var date = new Date(a * 1000)
              data.reviews[i].date = (date.getMonth() + 1).toString() + "/" + (date.getDate()).toString() + "/" + (date.getFullYear()).toString()
            }
            if (store.state.reviews === null) {
              commit('setReviews', data)
              commit('setreviewsLoading', false)
            }
            else {
              commit('setReviewsAdd', data)
              commit('setreviewsLoading', false)
            }
          })
          .catch(function (error) {
            if (error.response.data.status === 'expired' && count < 3) {
              count++
              store.dispatch('refreshToken')
              setTimeout(doGet(recipeId, offset, limit, count), 1000)
            }
            commit('setRecipe', null)
            commit('setreviewsLoading', false)
          })
      }
      var count = 0
      doGet(data["recipeId"], data["offset"], data["limit"], count)
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
    doSubmitReview ({ commit }, data) {
      commit('setsubmitReviewLoading', true)
      var auth = {
        headers: { 'Content-Type': 'application/json', 'Authorization': store.state.token }
      }

      axios.post(process.env.VUE_APP_API_SERVER + 'recipes/' + data['recipeId'] + '/reviews', data, auth)
        .then(function (response) {
          commit('setReviewsAdd', response.data)
          commit('setsubmitReviewLoading', false)
          commit('setreviewDialog', false)
        })
        .catch(function () {
          commit('setsnackbar', true)
          commit('setsnackbarMessage', 'There was an error posting your review.  Please try again.')
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
    searchRecipes ({ commit }, query) {
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

      axios.get(process.env.VUE_APP_API_SERVER + 'recipes/search' + parms, auth)
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

        axios.get(process.env.VUE_APP_API_SERVER + 'recipes?author=' + store.state.user.email, auth)
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
              console.log(response.data)
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
    },
    userSignUp ({ commit }, payload) {
      commit('setLoading', true)
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then(firebaseUser => {
          commit('setUser', { email: firebaseUser.user.email, uid: firebaseUser.user.uid })
          commit('setLoading', false)
          commit('setToken', firebaseUser.user._lat)
          axios.post(process.env.VUE_APP_API_SERVER + `users?token=` + firebaseUser.user._lat + '&name=' + payload.name, {
            body: ''
          })
            // .then(response => {})
            .then(router.push('/'))
            .catch(function() {
              var user = firebase.auth().currentUser
              user.delete().then(function () {
                // User deleted.
              }).catch(function () {
              })
              commit('setUser', null)
              router.push('/signup')
            })
        })
        .catch(error => {
          commit('setError', error.message)
          commit('setLoading', false)
        })
    },
    deleteRecipe ({ commit }, data) {
      commit('setActionRecipeLoading', true)
      var auth = { 'Content-Type': 'application/json', 'Authorization': store.state.token }

      var url = process.env.VUE_APP_API_SERVER + 'recipes'
      if (data.recipeId !== null) {
        url += '/' + data.recipeId
      }

      console.log(data.recipeId)

      axios({
        method: 'delete',
        url: url,
        data: data,
        headers: auth
      })
      .then(function () {
        console.log("done")
        commit('setActionRecipeLoading', false)
        commit('seteditRecipeDialog', false)
        router.push({ name: 'myrecipes'})
      })
      .catch(function (error) {
        console.log(error)
        commit('setActionRecipeLoading', false)
      })
    },
    actionRecipe ({ commit }, data) {
      commit('setActionRecipeLoading', true)
      var auth = { 'Content-Type': 'application/json', 'Authorization': store.state.token }

      var url = process.env.VUE_APP_API_SERVER + 'recipes'
      if (data.recipeId !== null) {
        url += '/' + data.recipeId
      }

      console.log(data.action)
      console.log(data.recipeId)

      axios({
        method: data.action,
        url: url,
        data: data.data,
        headers: auth
      })
      .then(function () {
        console.log("done")
        var r = store.state.recipe
        for (const prop in data.data) {
          r[prop] = data.data[prop]
        }
        commit('setRecipes', r)
        commit('setActionRecipeLoading', false)
        commit('seteditRecipeDialog', false)
      })
      .catch(function (error) {
        console.log(error)
        commit('setActionRecipeLoading', false)
      })
    }
  },
  getters: {
    recipeSubTypes: state => {
      var qtype = state.editRecipeType
      if (qtype.toLowerCase() === "appetizers") {
        return [{'text': 'Appetizers - Other', 'value': 'appetizers - other'}, {'text': 'Beans and Legumes', 'value': 'beans and legumes'}, {'text': 'Canapes and Bruschetta', 'value': 'canapes and bruschetta'}, {'text': 'Cheese', 'value': 'cheese'}, {'text': 'Deviled Eggs', 'value': 'deviled eggs'}, {'text': 'Dips and Spreads', 'value': 'dips and spreads'}, {'text': 'Fruit', 'value': 'fruit'}, {'text': 'Grilled', 'value': 'grilled'}, {'text': 'Meat', 'value': 'meat'}, {'text': 'Mushrooms', 'value': 'mushrooms'}, {'text': 'Nuts and Seeds', 'value': 'nuts and seeds'}, {'text': 'Olives', 'value': 'olives'}, {'text': 'Pastries', 'value': 'pastries'}, {'text': 'Pickles', 'value': 'pickles'}, {'text': 'Seafood', 'value': 'seafood'}, {'text': 'Snacks', 'value': 'snacks'}, {'text': 'Spicy', 'value': 'spicy'}, {'text': 'Vegetable', 'value': 'vegetable'}, {'text': 'Wraps and Rolls', 'value': 'wraps and rolls'}]
      }
      else if (qtype.toLowerCase() === "breads") {
        return [{'text': 'Breakfast Pastries', 'value': 'breakfast pastries'}, {'text': 'Challah', 'value': 'challah'}, {'text': 'Cornbread', 'value': 'cornbread'}, {'text': 'Flat Bread', 'value': 'flat bread'}, {'text': 'Fruit Bread', 'value': 'fruit bread'}, {'text': 'Holiday Bread', 'value': 'holiday bread'}, {'text': 'Muffins', 'value': 'muffins'}, {'text': 'Popovers and Puddings', 'value': 'popovers and puddings'}, {'text': 'Pumpkin Bread', 'value': 'pumpkin bread'}, {'text': 'Quick Bread', 'value': 'quick bread'}, {'text': 'Rolls and Buns', 'value': 'rolls and buns'}, {'text': 'Rye Bread', 'value': 'rye bread'}, {'text': 'Sourdough and Starters', 'value': 'sourdough and starters'}, {'text': 'Tortillas', 'value': 'tortillas'}, {'text': 'White Bread', 'value': 'white bread'}, {'text': 'Whole Grain Bread', 'value': 'whole grain bread'}, {'text': 'Yeast Bread', 'value': 'yeast bread'}, {'text': 'Zucchini Bread', 'value': 'zucchini bread'}]
      }
      else if (qtype.toLowerCase() === "desserts") {
        return [{'text': 'Cakes', 'value': 'cakes'}, {'text': 'Candies', 'value': 'candies'}, {'text': 'Chocolate', 'value': 'chocolate'}, {'text': 'Cobblers', 'value': 'cobblers'}, {'text': 'Cookies and Bars', 'value': 'cookies and bars'}, {'text': 'Custards and Puddings', 'value': 'custards and puddings'}, {'text': 'Dessert Gelatins', 'value': 'dessert gelatins'}, {'text': 'Dessert Sauces', 'value': 'dessert sauces'}, {'text': 'Dessert - Other', 'value': 'dessert - other'}, {'text': 'Frozen Treats', 'value': 'frozen treats'}, {'text': 'Fruit Crisps', 'value': 'fruit crisps'}, {'text': 'Fruit Crumbles', 'value': 'fruit crumbles'}, {'text': 'Liqueur Flavored Desserts', 'value': 'liqueur flavored desserts'}, {'text': 'Meringues', 'value': 'meringues'}, {'text': 'Mousse', 'value': 'mousse'}, {'text': 'Pies', 'value': 'pies'}, {'text': 'Tiramisu', 'value': 'tiramisu'}, {'text': 'Trifles', 'value': 'trifles'}]
      }
      else if (qtype.toLowerCase() === "drinks") {
          return [{'text': 'Drinks - Other', 'value': 'drinks - other'}, {'text': 'Beer', 'value': 'beer'}, {'text': 'Chocolate', 'value': 'chocolate'}, {'text': 'Cider', 'value': 'cider'}, {'text': 'Cocktails', 'value': 'cocktails'}, {'text': 'Coffee', 'value': 'coffee'}, {'text': 'Eggnog', 'value': 'eggnog'}, {'text': 'Hot Chocolate', 'value': 'hot chocolate'}, {'text': 'Kahlua', 'value': 'kahlua'}, {'text': 'Lemonade', 'value': 'lemonade'}, {'text': 'Liqueurs', 'value': 'liqueurs'}, {'text': 'Mocktails', 'value': 'mocktails'}, {'text': 'Punch', 'value': 'punch'}, {'text': 'Sangria', 'value': 'sangria'}, {'text': 'Shakes and Floats', 'value': 'shakes and floats'}, {'text': 'Smoothies', 'value': 'smoothies'}, {'text': 'Tea', 'value': 'tea'}]
      }
      else if (qtype.toLowerCase() === "main dishes") {
          return [{'text': 'Burgers', 'value': 'burgers'}, {'text': 'Casseroles', 'value': 'casseroles'}, {'text': 'Deep Fried', 'value': 'deep fried'}, {'text': 'Fish and Shellfish', 'value': 'fish and shellfish'}, {'text': 'Grill and BBQ', 'value': 'grill and bbq'}, {'text': 'Main Dish - Other', 'value': 'main dish - other'}, {'text': 'Meat - Steaks and Chops', 'value': 'meat - steaks and chops'}, {'text': 'Meatless', 'value': 'meatless'}, {'text': 'Meatloaf', 'value': 'meatloaf'}, {'text': 'Pasta', 'value': 'pasta'}, {'text': 'Pizza and Calzones', 'value': 'pizza and calzones'}, {'text': 'Poultry', 'value': 'poultry'}, {'text': 'Ribs', 'value': 'ribs'}, {'text': 'Roasts', 'value': 'roasts'}, {'text': 'Sandwiches and Wraps', 'value': 'sandwiches and wraps'}, {'text': 'Slow Cooker', 'value': 'slow cooker'}, {'text': 'Stir-Fries', 'value': 'stir-fries'}, {'text': 'Stuffed Peppers', 'value': 'stuffed peppers'}, {'text': 'Tacos, Burritos and Enchilladas', 'value': 'tacos, burritos and enchilladas'}, {'text': 'Wild Game', 'value': 'wild game'}]
      }
      else if (qtype.toLowerCase() === "salads") {
          return [{'text': 'Bean', 'value': 'bean'}, {'text': 'Coleslaw', 'value': 'coleslaw'}, {'text': 'Croutons and Toppings', 'value': 'croutons and toppings'}, {'text': 'Dressings and Vinaigretts', 'value': 'dressings and vinaigretts'}, {'text': 'Egg Salads', 'value': 'egg salads'}, {'text': 'Fruit Salads', 'value': 'fruit salads'}, {'text': 'Grains', 'value': 'grains'}, {'text': 'Green Salads', 'value': 'green salads'}, {'text': 'Meat and Seafood', 'value': 'meat and seafood'}, {'text': 'Pasta Salads', 'value': 'pasta salads'}, {'text': 'Potato Salads', 'value': 'potato salads'}, {'text': 'Salads - Other', 'value': 'salads - other'}, {'text': 'Vegetable Salads', 'value': 'vegetable salads'}]
      }
      else if (qtype.toLowerCase() === "side dishes") {
          return [{'text': 'Bean and Peas', 'value': 'bean and peas'}, {'text': 'Casseroles', 'value': 'casseroles'}, {'text': 'Dumplings', 'value': 'dumplings'}, {'text': 'French Fries', 'value': 'french fries'}, {'text': 'Grains', 'value': 'grains'}, {'text': 'Potatoes', 'value': 'potatoes'}, {'text': 'Rice', 'value': 'rice'}, {'text': 'Seafood', 'value': 'seafood'}, {'text': 'Sides - Other', 'value': 'sides - other'}, {'text': 'Vegetables', 'value': 'vegetables'}]
      }
      else if (qtype.toLowerCase() === "soups") {
          return [{'text': 'Bean and Legumes', 'value': 'bean and legumes'}, {'text': 'Broth Stocks', 'value': 'broth stocks'}, {'text': 'Cheese Soups', 'value': 'cheese soups'}, {'text': 'Chili', 'value': 'chili'}, {'text': 'Chowders', 'value': 'chowders'}, {'text': 'Cream-style Soups', 'value': 'cream-style soups'}, {'text': 'Dry Soup Mixes', 'value': 'dry soup mixes'}, {'text': 'Meat and Poultry', 'value': 'meat and poultry'}, {'text': 'Noodle', 'value': 'noodle'}, {'text': 'Seafood', 'value': 'seafood'}, {'text': 'Soups - Other', 'value': 'soups - other'}, {'text': 'Stews', 'value': 'stews'}, {'text': 'Vegetable', 'value': 'vegetable'}]

      }
      else if (qtype.toLowerCase() === "sauces") {
          return [{'text': 'Marinade', 'value': 'marinade'}, {'text': 'Sauce', 'value': 'sauce'}]
      }
      else{
          return [{"text": "other", "value": "other"}]
      }
    },
    userMenuItems: state => {
      console.log(state)
      if (state.user === null) {
        return []
      }
      else if (!('profile' in state.user)) {
        return []
      }
      else if ('uid' in state.user.profile) {
        //         var userId = state.profile._id.split("/")
        var userId = state.profile.uid
        var items = [
          { title: "My Profile", to: "/profile/" + userId},
          { title: "My Recipes", to: "/myrecipes"},
          { title: "Sign Out", to: "/signout"}
        ]
        return items
      }
      else
      {
        return []
      }
    },
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
    },
    snackbar: state => {
      return state.snackbar
    },
    snackbarMessage: state => {
      return state.snackbarMessage
    },
    getreviewsLoading: state => {
      return state.reviewsLoading
    }
  }
})
export default store
