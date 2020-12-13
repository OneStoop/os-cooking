<style>
.v-card__text, .v-card__title {
  word-break: normal; /* maybe !important  */
}
</style>
<template>
  <v-container fluid>
  <v-card>
    <v-toolbar flat color="cyan darken-2" dark>
      <v-toolbar-title>My Recipes</v-toolbar-title>
    </v-toolbar>
    <v-tabs v-model="activeTab" icons-and-text>
      <v-tab>
        <v-icon left>assignment</v-icon>
        My Recipes
      </v-tab>
      <v-tab>
        <v-icon left>bookmark</v-icon>
        Favorite
      </v-tab>
      <v-tab>
        <v-icon left>add_box</v-icon>
        Add Recipe
      </v-tab>

      <v-tab-item>

        <v-row no-gutters v-if="this.$store.state.recipesLoading === false">
          <v-col cols="12" md="6" lg="4" xl="3" v-for="d in this.$store.state.myRecipes.recipes" :key="d._id">
            <v-card class="pa-2 ma-2" md="2">
              <router-link :to="'/recipe/' + d._id + '/' + d.title.replace(/\s+/g, '-').toLowerCase()">
              <div v-if="d.images.length === 1">
                <v-img
                  :src="d.images[0].url"
                  lazy-src="https://storage.googleapis.com/onestoopimages01/NoImage.jpeg"
                  height="300px"
                  
                ></v-img>
              </div>
              <div v-if="d.images.length === 0">
                <v-img
                  src="https://storage.googleapis.com/onestoopimages01/NoImage.jpeg"
                  height="300px"
                ></v-img>
              </div>
              </router-link>
              <v-card-title>{{ d.title }}</v-card-title>
              
              <v-card-actions>
                <v-rating
                  :value="d.rating"
                  color="amber"
                  dense
                  half-increments
                  readonly
                  size="14"
                ></v-rating>
                <div class="grey--text ml-2">{{ d.ratingCount }} Reviews</div>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <v-row no-gutters v-if="showLoading === true">
          <v-col cols="3" v-for="(d, i) in [1,2,3]" :key="i">
            <v-skeleton-loader
              class="ma-4"
              max-width="300"
              type="card"
            ></v-skeleton-loader>
          </v-col>
        </v-row>
      </v-tab-item>

      <v-tab-item>
        <v-row no-gutters>
          <v-col cols="6" md="2">
            <v-card class="mx-auto" outlined title>

            </v-card>
          </v-col>
        </v-row>
      </v-tab-item>
      <v-tab-item>
        <v-row no-gutters>
          <v-col cols="12" sm="4" md="3"></v-col>
          <v-col cols="12" sm="4" md="6">
        <form @submit.prevent="submitAddRecipe">

            <v-col>
              <v-alert type="error" dismissible v-model="alert">
                {{ error }}
              </v-alert>
            </v-col>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    label="Recipe title"
                    type="text"
                    v-model="title"
                    outlined
                    shaped
                    required>
                  </v-text-field>
                </v-col>
                
                <v-col cols="4">
                  <v-text-field
                    label="Prep Time minutes"
                    type="text"
                    v-model="prepTime"
                    required>
                  </v-text-field>
                </v-col>
                
                <v-col cols="4">
                  <v-text-field
                    label="Cook Time minutes"
                    type="text"
                    v-model="cookTime"
                    required>
                  </v-text-field>
                </v-col>
                
                <v-col cols="4">
                  <v-text-field
                    label="Servings"
                    type="text"
                    v-model="servings"
                    required>
                  </v-text-field>
                </v-col>
                
                <v-col cols="3">
                  <v-select
                    autocomplete
                    label="Recipe Type"
                    :items="this.$store.state.recipeTypes.types"
                    v-model="recipeType"
                    v-on:change="getRecipeSubTypes"
                    required>
                  </v-select>
                </v-col>

                <v-col cols="3">
                  <v-select
                    autocomplete
                    label="Sub Type"
                    :items="recipeSubTypes"
                    v-model="recipeSubType"
                    :loading="recipeSubTypesLoading"
                    required>
                  </v-select>
                </v-col>
                
                <v-col cols="3">
                  <v-select
                    label="Cuisine"
                    :items="cuisineType.types"
                    v-model="cusine"
                    required>
                  </v-select>
                </v-col>
                
                <v-col cols="3">
                  <v-select
                    label="Meal Time"
                    :items="mealtimeItems.types"
                    v-model="mealTime"
                    required>
                  </v-select>
                </v-col>

                <v-col cols="12">
                  <div class="title">Ingredients <div class="font-weight-thin">(click to edit in column)</div></div>
                </v-col>
                 
                <v-col cols="12">
                   <v-simple-table>
                     <template v-slot:default>
                       <tbody>
                         <tr v-for="item in ingredients" :key="item.id">
                           <td>
                             <v-checkbox
                               v-model="selected"
                               :value="item.id"
                             ></v-checkbox>
                           </td>
                           <td>
                             <v-text-field
                               v-model="item.quantity"
                               label="Quantity"
                             ></v-text-field>
                           </td>
                           <td>
                             <v-text-field
                               v-model="item.measure"
                               label="Measure"
                             ></v-text-field>
                           </td>
                           <td>
                             <v-text-field
                               v-model="item.item"
                               label="Item"
                             ></v-text-field>
                           </td>
                           <td>
                             <v-text-field
                               v-model="item.note"
                               label="Note"
                             ></v-text-field>
                           </td>
                         </tr>
                       </tbody>
                     </template>
                  </v-simple-table>
                </v-col>

                <v-col cols="12">
                  <v-btn @click="addIngredientLine()" class="ma-2"><v-icon left>add_box</v-icon>add ingredient line</v-btn>
                  <v-btn color="red lighten-2" @click="deleteItem" class="ma-2">Delete</v-btn>
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    label="Description"
                    type="text"
                    v-model="description"
                    required>
                  </v-textarea>
                </v-col>
                
                 <v-col cols="12">
                  <v-textarea
                    label="Directions"
                    type="text"
                    v-model="directions"
                    required>
                  </v-textarea>
                </v-col>
                
                <v-col cols="12">
                  <v-textarea
                    label="Notes (optional)"
                    type="text"
                    v-model="notes">
                  </v-textarea>
                </v-col>
                
                <v-col cols="12">
                  <v-text-field
                    label="Source (optional)"
                    type="text"
                    v-model="source">
                  </v-text-field>
                </v-col>
                
                <v-col cols="3">
                  <v-select
                    label="Visibility"
                    :items="['Public', 'Private']"
                    v-model="visibility"
                    required>
                  </v-select>
                </v-col>
                
                <v-col cols="9">

                
            <v-flex xs12>
              <v-card>
                <input
                  type="file"
                  ref="file"
                  multiple="multiple"
                  :name="uploadFieldName"
                  @change="onFileChange($event.target.name, $event.target.files)"
                  style="display:none"
                >
                <v-container fluid grid-list-md>
                  <v-layout row wrap>
                    <v-flex
                      xs2
                      v-for="img in this.imageIDs"
                      :key="img.imageId"
                    >
                      <v-skeleton-loader
                        :loading="deleting"
                        height="100px"
                        type="card"
                      >
                        <v-card>
                          <v-img
                            :src="img.url"
                            height="100px"
                          >
                          </v-img>
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn small icon @click="removedEvent(img)"><v-icon>delete_outline</v-icon></v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-skeleton-loader>
                    </v-flex>
                      <v-skeleton-loader v-if="imgLoading" type="card" height="100px">
                      </v-skeleton-loader>
                  </v-layout>
                </v-container>
              </v-card>
            </v-flex>

            <v-flex xs12 align-center justify-space-between>
              <v-btn small @click="launchFilePicker()"><v-icon>insert_photo</v-icon>Add a photo</v-btn>
            </v-flex>                

                
                </v-col>

              <div class="text-center">
              <v-btn color="cyan" class="ma-2" type="submit">Save</v-btn>
              <v-btn color="cyan" class="ma-2" @click="canclePost">Cancle</v-btn>
              </div>
          </v-row>
        </form>
          </v-col>
          <v-col cols="12" sm="4" md="4"></v-col>
          </v-row>
          <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
          {{ snackText }}
          </v-snackbar>
          <v-overlay :value="successOverlay">
            <v-btn
              @click="closeSuccess"
              color="success"
            >
              Recipe Added
            </v-btn>
          </v-overlay>
      </v-tab-item>
    </v-tabs>
  </v-card>

  </v-container>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      activeTab: 0,
      recipeType: null,
      recipeSubTypes: ['Loading'],
      recipeSubType: null,
      recipeSubTypesLoading: false,
      cusine: null,
      mealTime: null,
      deleteDialog: false,
      email: '',
      password: '',
      alert: false,
      cards2: [
        {title: "jim1"},
        {title: "jim2"},
        {title: "jim3"},
        {title: "jim4"}
      ],
      selected: [],
      snack: false,
      snackColor: null,
      snackText: "",
      imgLoading: false,
      deleting: false,
      title: null,
      prepTime: null,
      cookTime: null,
      imageIDs: [],
      uploadFieldName: null,
      visibility: "Public",
      ingredients: [
        {
          "quantity": "",
          "measure": "",
          "item": "",
          "note": "",
          "id": 0
        }
      ],
      source: null,
      notes: null,
      directions: null,
      description: null,
      servings: null,
      cuisineType: {
        types:
          [
            "African",
            "Asian",
            "Chinese",
            "Creole and Cajun",
            "English",
            "French",
            "Greek",
            "German",
            "Indian",
            "Irish",
            "Italian",
            "Mexican",
            "Southern",
            "Southwest",
            "Spanish",
            "Thai",
            "other"
          ]
      },
      mealtimeItems: {
        types:
          [
            "Breakfast",
            "Lunch",
            "Dinner",
            "Brunch",
            "other"
          ]
      },
      successOverlay: false
    }
  },
  methods: {
    autoRefreshToken () {
      this.$store.dispatch('refreshToken')
    },
    closeSuccess () {
      this.successOverlay = false
      this.title = null
      this.recipeType = null
      this.recipeSubTypes = []
      this.cusine = null
      this.mealTime = null
      this.selected = []
      this.prepTime = null
      this.cookTime = null
      this.imageIDs = []
      this.uploadFieldName = null
      this.visibility = "Public"
      this.source = null
      this.notes = null
      this.directions = null
      this.description = null
      this.servings = null
      this.activeTab = 0
      this.ingredients = [
        {
          "quantity": "",
          "measure": "",
          "item": "",
          "note": "",
          "id": 0
        }
      ]
    },
    submitAddRecipe () {
      var images = []
      for(var i = 0; i < this.imageIDs.length; i++) {
        images.push(this.imageIDs[i].imageID)
      }
      var data = {
        title: this.title,
        prepTime: Number(this.prepTime),
        cookTime: Number(this.cookTime),
        servings: Number(this.servings),
        recipeType : this.recipeType,
        recipeSubType : this.recipeSubType,
        cusine : this.cusine,
        mealTime : this.mealTime,
        ingredients: this.ingredients,
        description: this.description,
        directions: this.directions,
        notes: this.notes,
        source: this.source,
        visibility: this.visibility,
        images: images
      }
      console.log(data)
      var auth = {
        headers: { 'Content-Type': 'application/json', 'Authorization': this.$store.state.token }
      }
    
      axios.post(process.env.VUE_APP_API_SERVER + 'recipes', data, auth)
        .then(response => {
          console.log(response)
          this.successOverlay = true
          this.$store.dispatch('getMyRecipes')
          this.activeTab =  0
        })
    },
    canclePost () {
      this.title = null
      this.recipeType = null
      this.recipeSubTypes = []
      this.cusine = null
      this.mealTime = null
      this.selected = []
      this.prepTime = null
      this.cookTime = null
      this.imageIDs = []
      this.uploadFieldName = null
      this.visibility = "Public"
      this.source = null
      this.notes = null
      this.directions = null
      this.description = null
      this.servings = null
      this.activeTab = 0
      this.ingredients = [
        {
          "quantity": "",
          "measure": "",
          "item": "",
          "note": "",
          "id": 0
        }
      ]
    },
    getRecipeSubTypes (type) {
      this.recipeSubTypes = []
      this.recipeSubTypesLoading = true
      var auth = {
          headers: { 'Content-Type': 'application/json', 'Authorization': this.$store.state.token }
        }
      axios.get(process.env.VUE_APP_API_SERVER + 'recipeTypes?type=' + type, auth)
          .then(response => {
            this.recipeSubTypes = response.data.types
            this.recipeSubTypesLoading = false
          })
          .catch(function (error) {
            console.log(error)
          })
    },
    deleteItem () {
      for(var i = 0; i < this.selected.length; i++) {
        const index = this.ingredients.indexOf(this.selected[i])
        this.ingredients.splice(index, 1)
      }
      this.deleteDialog = false
      this.selected = []
    },
    addIngredientLine () {
      var found = true
      var addThis = 0
      while (found) {
        var id = this.ingredients.length + addThis
        found = this.ingredients.some(el => el.id === id)
        console.log(id)
        addThis += 1
      }
      this.ingredients.push({
          "quantity": "",
          "measure": "",
          "item": "",
          "note": "",
          "id": id
        })
    },
    save () {
      this.snack = true
      this.snackColor = 'success'
      this.snackText = 'Data saved'
    },
    launchFilePicker () {
      this.imgLoading = true
      this.$refs.file.click()
    },
    launchEditFilePicker () {
      this.$refs.editFile.click()
    },
    onFileChange (fieldName, file) {
      function doPost (vm, f) {
        const formData = new FormData()
        formData.append('file', f, f.name)
        var auth = {
          headers: { 'Content-Type': 'application/json', 'Authorization': vm.$store.state.token }
        }
        axios.post(process.env.VUE_APP_API_SERVER + 'images', formData, auth)
          .then(response => {
            console.log(response.data)
            vm.imageIDs.push({ 'url': response.data.url,
                               'imageID': response.data.imageID })
            vm.imgLoading = false
          })
          .catch(function (error) {
            console.log(error)
            vm.imgLoading = false
          })
      }

      for (var i = 0; i < file.length; i++) {
        doPost(this, file[i])
      }
    },
    removedEvent (image) {
      function deleteFile (vm, count, key) {
        var auth = {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': vm.$store.getters.token }
        }
        axios
          .delete(process.env.VUE_APP_API_SERVER + 'images?key=' + key, auth)
          .then(response => {
            console.log(response)
            for (var i = 0; i < vm.imageIDs.length; i++) {
              if (vm.imageIDs[i].key === key) {
                vm.imageIDs.splice(i, 1)
              }
              vm.deleting = false
            }
          })
          .catch(function (e) {
            if (e.response.data.status === 'expired' && count < 3) {
              count++
              vm.$store.dispatch('refreshToken')
              setTimeout(deleteFile(vm, count, image), 1000)
            } else if (e.response.status >= 400 && count < 3) {
              count++
              setTimeout(deleteFile(vm, count, image), 1000)
            } else {
              console.log("did something else")
            }
          })
      }
      this.deleting = true
      let vm = this
      var count = 0
      deleteFile(vm, count, image.key)
    },
    scroll () {
      window.onscroll = () => {
        let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight

        if (bottomOfWindow) {
          // this.addPosts()
          console.log("at the bottom")
          if (this.$store.state.myRecipes.moreResults && this.$store.state.addrecipesLoading === false) {
            var newQuery = {}
            newQuery['limit'] = 10
            newQuery['nextOffset'] = this.$store.state.myRecipes.nextOffset
            newQuery['author'] = this.$store.state.user.email
            this.$store.dispatch('addmyRecipes', newQuery)
          }
        }
      }
    }
  },
  computed: {
    error () {
      return this.$store.state.error
    },
    loading () {
      return this.$store.state.loading
    },
    showLoading: function () {
       if (this.$store.state.recipesLoading === true || this.$store.state.addrecipesLoading == true) {
        return true
       }
       else {
        return false
       }
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
  },
  mounted () {
    this.scroll()
    let vm = this
    this.$store.commit('setmyRecipes', [])
    this.autoRefreshToken()
    setTimeout(function () { vm.autoRefreshToken() }, 3300000)
    this.$store.dispatch('getMyRecipes')
  },
  beforeDestroy: function () {
    this.$store.commit('setmyRecipes', [])
  }
}
</script>
