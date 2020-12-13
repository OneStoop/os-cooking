<style>
.v-card__text, .v-card__title {
  word-break: normal; /* maybe !important  */
}
</style>
<template>
  <v-container>
    <v-row no-gutters align="center" justify="center"  v-if="this.$store.state.recipe.title != ''">
      <v-col cols="12">
        <div>
          <v-btn icon :to="'/'">
            <v-icon>home</v-icon>
          </v-btn>
          <v-icon>mdi-chevron-right</v-icon>
          <router-link :to="'/recipes?recipeType=' + this.$store.state.recipe.recipeType" >
            <v-btn text class="caption">
              {{ this.$store.state.recipe.recipeType }}
            </v-btn>
          </router-link>
          <v-icon>mdi-chevron-right</v-icon>
          <router-link :to="'/recipes?recipeType=' + this.$store.state.recipe.recipeType + '&recipeSubType=' + this.$store.state.recipe.recipeSubType" >
            <v-btn text class="caption">
              {{ this.$store.state.recipe.recipeSubType }}
            </v-btn>
          </router-link>
          <v-icon>mdi-chevron-right</v-icon>
            <v-btn text class="caption" disabled>
              {{ this.$store.state.recipe.title }}
            </v-btn>
          <v-divider></v-divider>
        </div>
      </v-col>
    </v-row>
    
    <v-row no-gutters v-if="this.$store.state.recipe.title === ''">
      <v-col cols="12">
        <v-skeleton-loader
          class="ma-4"
          type="card"
        ></v-skeleton-loader>
      </v-col>
    </v-row>

    <!-- small display -->
    <v-card class="hidden-md-and-up" v-if="this.$store.state.recipe.title != ''">
      <v-card-title>{{ this.$store.state.recipe.title }}</v-card-title>
      <v-row dense>
        <v-btn
          class="pa-2 ma-2"
          @click.stop="openEditRecipe"
          v-if="isOwner === true"
        >
          <v-icon>create</v-icon>Edit
        </v-btn>
        <v-btn
          class="pa-2 ma-2"
          @click.stop="openDeleteDialog"
          v-if="isOwner === true"
        >
          <v-icon>delete_sweep</v-icon>Delete
        </v-btn>
        <v-rating
          :value="this.$store.state.recipe.rating"
          color="amber"
          dense
          half-increments
          readonly
          size="14"
          class="pl-2 ml-2 mt-3"
        ></v-rating>
        <div class="grey--text ml-1 mt-3">{{ this.$store.state.recipe.ratingCount }} Reviews</div>
      </v-row>
      <v-row dense>
        <v-icon class="ml-4 mt-2">alarm</v-icon><p class="ma-2">Ready in {{ this.$store.state.recipe.prepTime + this.$store.state.recipe.cookTime }} Minutes</p>
        <v-icon class="ml-4 mt-2">group</v-icon><p class="ma-2">Servings {{ this.$store.state.recipe.servings }}</p>
      </v-row>
      <v-row>
        <p v-if="this.$store.state.authorName" class="ml-6">By: {{ this.$store.state.authorName }}</p>
      </v-row>
      
      <v-row align="center">
        <v-col cols="12">
        <v-card>
          <div v-if="this.$store.state.recipe.images.length === 1">
            <v-img
              :src="this.$store.state.recipe.images[0].url"
              lazy-src="https://storage.googleapis.com/onestoopimages01/NoImage.jpeg"
              height="300px"
              contain
            ></v-img>
          </div>
          <div v-if="this.$store.state.recipe.images.length === 0">
            <v-img
              src="https://storage.googleapis.com/onestoopimages01/NoImage.jpeg"
              height="300px"
              contain
            ></v-img>
          </div>
        </v-card>
        </v-col>
      </v-row>
      
      <v-row align="center">
        <v-col cols="12">
        <v-card class="ma-4">
          {{ this.$store.state.recipe.description }}
        </v-card>
        </v-col>
      </v-row>
      
      <v-row>
        <p class="title ml-4">
          Ingredients
        </p>
      </v-row>
        
      <v-row>
        <v-simple-table class="ml-4">
          <template v-slot:default>
            <tbody>
              <tr v-for="item in $store.state.recipe.ingredients" :key="item.item">
                <td>{{ item.quantity }} {{ item.measure }} {{ item.item }}<div v-if="item.note">; {{ item.note }}</div></td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-row>

      <v-row>
        <p class="title ml-4 mt-4">
          Directions
        </p>
      </v-row>
      
      <v-row>
        <v-simple-table class="ml-4">
          <template v-slot:default>
            <tbody>
              <tr v-for="item in $store.state.recipe.directions.split('\n')" :key="item">
                <td>{{ item }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-row>
    </v-card>
    
    <!-- big display -->
    <v-card class="hidden-sm-and-down" v-if="this.$store.state.recipe.title != ''">
      <v-card-title class="display-1">
        {{ this.$store.state.recipe.title }}
      </v-card-title>

      <v-row align="center" justify="center">
        <v-col cols="12">
          <v-card flat>
            <v-card-actions>
              <v-btn
                class="pa-2 ma-2"
                @click.stop="openEditRecipe"
                v-if="isOwner === true"
              >
                <v-icon>create</v-icon>Edit
              </v-btn>
              <v-btn
                class="pa-2 ma-2"
                @click.stop="openDeleteDialog"
                v-if="isOwner === true"
              >
                <v-icon>delete_sweep</v-icon>Delete
              </v-btn>
              <v-rating
                :value="this.$store.state.recipe.rating"
                color="amber"
                dense
                half-increments
                readonly
                size="14"
                class="pl-2 ml-2"
              ></v-rating>
              <div class="grey--text ml-1">{{ this.$store.state.recipe.ratingCount }} Reviews</div>
              
              <v-spacer></v-spacer>
              
              <v-icon class="ml-4 mr-1">alarm</v-icon>Ready in {{ this.$store.state.recipe.prepTime + this.$store.state.recipe.cookTime }} Minutes
              <v-icon class="ml-4 mr-1">group</v-icon>Servings {{ this.$store.state.recipe.servings }}
              
            </v-card-actions>
          </v-card>
          <v-divider></v-divider>
        </v-col>
      </v-row>
      
      <v-row align="center" justify="center">
        <v-col cols="5">
          <v-card height="350px" class="pa-1">
            <div v-if="this.$store.state.recipe.images.length === 1">
                  <v-img
                    :src="this.$store.state.recipe.images[0].url"
                    lazy-src="https://storage.googleapis.com/onestoopimages01/NoImage.jpeg"
                    height="300px"
                    contain
                  ></v-img>
                </div>
                <div v-if="this.$store.state.recipe.images.length === 0">
                  <v-img
                    src="https://storage.googleapis.com/onestoopimages01/NoImage.jpeg"
                    height="300px"
                    contain
                  ></v-img>
                </div>
            <v-card-actions>
              <v-chip class="ma-1 pa-4">Prep Time: {{ this.$store.state.recipe.prepTime }}</v-chip>
              <v-chip class="ma-1 pa-4">Cook Time: {{ this.$store.state.recipe.cookTime }}</v-chip>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="7">
          <v-card height="350px" class="pa-1">
            <br>
            <p v-if="this.$store.state.authorName">By: {{ this.$store.state.authorName }}</p>
            {{ this.$store.state.recipe.description }}
            <v-card-actions>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      
      <v-row align="center" justify="center">
        <v-col cols="8">
          <p class="title">
            Ingredients
          </p>
          
          <v-simple-table>
            <template v-slot:default>
              <tbody>
                <tr v-for="item in $store.state.recipe.ingredients" :key="item.item">
                  <td>{{ item.quantity }} {{ item.measure }} {{ item.item }}<div v-if="item.note">; {{ item.note }}</div></td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
      
        <v-col cols="8">
          <p class="title">
            Directions
          </p>
          <v-simple-table>
            <template v-slot:default>
              <tbody>
                <tr v-for="item in $store.state.recipe.directions.split('\n')" :key="item">
                  <td>{{ item }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
      </v-row>
    </v-card>
    
    <!-- all display -->
    <v-row align="center" justify="center" v-if="this.$store.state.recipe.title != ''">
      <v-col cols="12">
        <v-card>
          <v-card-text >
            <p class="text-center display-1">
            {{ this.$store.state.recipe.rating }}
            <v-rating
              :value="this.$store.state.recipe.rating"
              color="amber"
              half-increments
              dense
              readonly
              size="30"
              class=""
            ></v-rating>
            </p>
            <p class="text-center caption">
            {{ this.$store.state.recipe.ratingCount }} Reviews
            </p>
            
            <div class="text-right" v-if="this.$store.getters.isNotAuthenticated">
              Login to review or ask question
            </div>
            <div class="text-right" v-if="this.$store.getters.isAuthenticated">
              <v-btn
                class="ma-2"
                color="primary"
                @click.stop="openReviewModel"
                v-if="isOwner === false"
              >
                Write a Review
              </v-btn>
              <v-dialog v-model="this.$store.state.reviewDialog" persistent>
                <v-card>
                  <v-card-text>
                    <v-form ref="reviewForm" v-model="reviewValid">
                      <div>
                      <p class="body-1">Score</p>
                      <v-rating
                        v-model="reviewRating"
                        required></v-rating>
                      <p class="caption red--text" v-if="this.reviewRatingError === true">Rating is required</p>
                      <v-text-field
                        label="Title"
                        type="text"
                        v-model="reviewTitle"
                        :rules="reviewTitleRules"
                        outlined
                        required
                        class="mb-2">
                      </v-text-field>
                      </div>
                      <v-textarea
                        label="Review"
                        type="text"
                        outlined
                        v-model="reviewReview"
                        :rules="reviewReviewRules"
                        required>
                      </v-textarea>
                      <v-text-field
                        label="Locations (City/State only)"
                        type="text"
                        v-model="reviewLocation"
                        outlined
                        class="mb-2">
                      </v-text-field>
                      <p>Do you recommend this recipe?</p>
                      <v-radio-group v-model="reviewRecommend" column>
                        <v-radio label="Yes" value="true"></v-radio>
                        <v-radio label="No" value="false"></v-radio>
                      </v-radio-group>
                    </v-form>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn
                      class="ma-2"
                      color="primary"
                      :loading="this.$store.state.submitReviewLoading"
                      @click="startReviewSubmit"
                    >
                      Post
                    </v-btn>
                    <v-btn
                      class="ma-2"
                      color="primary"
                      @click="cancleReview"
                    >
                      Cancle
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              
<!--
              <v-btn
                class="ma-2"
                color="primary"
              >
                Ask a Question
              </v-btn>
-->
            </div>
            <v-tabs
            >
                <v-tab>Reviews</v-tab>
<!--
                <v-tab>Questions</v-tab>
-->
                <v-tab-item v-if="reviewsLoading === true">
                  <div>
                    <v-skeleton-loader
                      type="list-item-two-line"
                    ></v-skeleton-loader>
                  </div>
                </v-tab-item>
                <v-tab-item v-if="reviewsLoading === false">
                  <v-card v-for="review in this.visableReviews" :key="review._id">
                    <v-card-title>
                      {{ review.authorId }}
                      <v-spacer></v-spacer>
                      <div class="subtitle-1">
                        {{ review.date }}
                      </div>
                    </v-card-title>
                    <v-card-subtitle>
                      <v-rating
                        :value="review.score"
                        color="primary"
                        half-increments
                        dense
                        readonly
                        size="18"
                      ></v-rating>
                    </v-card-subtitle>
                    <v-card-text>
                      <div class="font-italic font-weight-medium">Recommended: {{ review.recommend }}</div>
                      <div class="body-1 mt-2">
                        {{ review.body }}
                      </div>
                      <div class="font-weight-bold mt-2">
                        Location:
                      </div>
                      <div>
                        {{ review.location }}
                      </div>
                    </v-card-text> 
                  </v-card>

                  <v-pagination
                    v-model="reviewPage"
                    :length="this.reviewPages"
                  ></v-pagination>
                </v-tab-item>
                <v-tab-item>
                  <v-pagination
                    v-model="questionPage"
                    :length="6"
                  ></v-pagination>
                </v-tab-item>
            </v-tabs>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar :value="this.$store.getters.snackbar" :timeout="3000">
      {{ this.$store.getters.snackbarMessage }}
    </v-snackbar>
    
    <v-dialog v-model="this.$store.state.editRecipeDialog" persistent max-width="800">
      <v-card>
        <v-card-title>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="Recipe title"
                type="text"
                v-model="title"
                outlined
                shaped
                required
              >
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
                v-model="$store.state.editRecipeType"
                required>
              </v-select>
            </v-col>

            <v-col cols="3">
              <v-select
                autocomplete
                label="Sub Type"
                :items="recipeSubTypes"
                item-text="text"
                item-value="value"
                v-model="recipeSubType"
                :loading="recipeSubTypesLoading"
                required>
              </v-select>
            </v-col>
            
            <v-col cols="3">
              <v-select
                label="Cuisine"
                :items="cuisineType.types"
                item-text="text"
                item-value="value"
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
            

          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn
            class="ma-2"
            color="primary"
            :loading="this.$store.state.actionRecipeLoading"
            :disabled="this.$store.state.actionRecipeLoading"
            @click="startEditSubmit"
          >
            Update
          </v-btn>
          <v-btn
            class="ma-2"
            color="primary"
            @click="cancleEditRecipe"
          >
            Cancle
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <v-dialog v-model="this.deleteRecipeDialog" persistent max-width="800">
      <v-card>
        <v-card-title>
          Delete Recipe
        </v-card-title>
        <v-card-text>
          Are you sure?  All data related to this recipe will be deleted.  This cannot be undone!
        </v-card-text>
        <v-card-actions>
          <v-btn
            class="ma-2"
            color="error"
            @click="cancleDeleteRecipe"
          >
            Delete
          </v-btn>
          <v-btn
            class="ma-2"
            color="primary"
            @click="cancleDeleteRecipe"
          >
            Cancle
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import router from '../router'
export default {
  data () {
    return {
      breadcrumbs: [
        {
          text: 'Dashboard',
          disabled: false,
          href: '/',
        }
      ],
      deleteRecipeDialog: false,
      deleteDialog: false,
      description: null,
      directions: null,
      ingredients: [],
      reviewPage: 1,
      questionPage: 1,
      reviewLocation: null,
      reviewRecommend: null,
      reviewRating: null,
      reviewRatingError: false,
      reviewReview: null,
      reviewReviewRules: [
        v => !!v || 'Review is required'
      ],
      reviewTitle: null,
      reviewTitleRules: [
        v => !!v || 'Title is required'
      ],
      reviewValid: true,
      notes: null,
      visableReviews: [],
      title: null,
      prepTime: null,
      cookTime: null,
      selected: null,
      servings: null,
      source: null,
      recipeSubTypes: [],
      recipeSubType: null,
      recipeSubTypesLoading: null,
      cusine: null,
      mealTime: null,
      cuisineType: {
        types:
          [{'text': 'African', 'value': 'african'}, {'text': 'Asian', 'value': 'asian'}, {'text': 'Chinese', 'value': 'chinese'}, {'text': 'Creole and Cajun', 'value': 'creole and cajun'}, {'text': 'English', 'value': 'english'}, {'text': 'French', 'value': 'french'}, {'text': 'Greek', 'value': 'greek'}, {'text': 'German', 'value': 'german'}, {'text': 'Indian', 'value': 'indian'}, {'text': 'Irish', 'value': 'irish'}, {'text': 'Italian', 'value': 'italian'}, {'text': 'Mexican', 'value': 'mexican'}, {'text': 'Southern', 'value': 'southern'}, {'text': 'Southwest', 'value': 'southwest'}, {'text': 'Spanish', 'value': 'spanish'}, {'text': 'Thai', 'value': 'thai'}, {'text': 'other', 'value': 'other'}]
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
      visibility: null
    }
  },
  methods: {
    autoRefreshToken () {
      this.$store.dispatch('refreshToken')
    },
    openDeleteDialog () {
      this.deleteRecipeDialog = true
    },
    cancleDeleteRecipe () {
      this.deleteRecipeDialog = false
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
    openReviewModel () {
      this.$store.commit('setreviewDialog', true)
    },
    openEditRecipe () {
      this.title = this.$store.state.recipe.title
      this.prepTime = this.$store.state.recipe.prepTime
      this.cookTime = this.$store.state.recipe.cookTime
      this.servings = this.$store.state.recipe.servings
      var t = this.$store.state.recipe.recipeType[0].toUpperCase() + this.$store.state.recipe.recipeType.slice(1)
      this.$store.commit('seteditRecipeType', t)
      this.getRecipeSubTypes()
      this.recipeSubType = this.$store.state.recipe.recipeSubType
      this.cusine = this.$store.state.recipe.cusine
      this.mealTime = this.$store.state.recipe.mealTime
      this.ingredients = this.$store.state.recipe.ingredients
      this.description = this.$store.state.recipe.description
      this.directions = this.$store.state.recipe.directions
      this.notes = this.$store.state.recipe.notes
      this.source = this.$store.state.recipe.source
      var v = this.$store.state.recipe.visibility[0].toUpperCase() + this.$store.state.recipe.visibility.slice(1)
      this.visibility = v
      this.$store.commit('seteditRecipeDialog', true)
    },
    startEditSubmit () {
      var data = {'data':{}}
      data.data.title = this.title
      data.data.prepTime = this.prepTime
      data.data.cookTime = this.cookTime
      data.data.servings = this.servings
      data.data.recipeSubType = this.recipeSubType
      data.data.cusine = this.cusine
      data.data.mealTime = this.mealTime
      data.data.ingredients = this.ingredients
      data.data.description = this.description
      data.data.notes = this.notes
      data.data.source = this.source
      data.data.visibility = this.visibility
      
      data.recipeId = this.$route.params.id
      data.action = 'patch'
      console.log(data)
      
      this.$store.dispatch('actionRecipe', data)
    },
    startReviewSubmit () {
      if (this.reviewRating === null) {
        this.reviewRatingError = true
      }
      else if (this.$refs.reviewForm.validate()) {
        var data = {
            "title": this.reviewTitle,
            "body": this.reviewReview,
            "score": this.reviewRating,
            "recipeId": this.$route.params.id,
            "recommend": this.reviewRecommend,
            "location": this.reviewLocation
        }
        this.$store.dispatch('doSubmitReview', data)
      }
    },
    cancleEditRecipe () {
      this.$store.commit('seteditRecipeDialog', false)
    },
    cancleReview () {
      this.$store.commit('setreviewDialog', false)
      this.reviewLocation = null
      this.reviewRecommend = null
      this.reviewRating = null
      this.reviewRatingError = false
      this.reviewReview = null
      this.reviewTitle = null
      this.reviewValid = true
      this.$refs.reviewForm.resetValidation()
    },
    callgetReviews () {
      this.$store.commit('setreviewsLoading', true)
      this.$store.dispatch('getReviews', {"recipeId": this.$route.params.id, "offset": 0, "limit": 5})
    },
    getRecipeSubTypes () {
      console.log("doing get")
      this.recipeSubTypes = []
      this.recipeSubTypesLoading = true
      this.recipeSubTypes = this.$store.getters.recipeSubTypes
      this.recipeSubTypesLoading = false
    }
  },
  computed: {
    isOwner: function () {
      if (this.$store.state.profile != null) {
        if (this.$store.state.recipe.authorId === this.$store.state.profile._id) {
          return true
        } else { return false }
      } else return false
    },
    reviewDialogWatch: function () {
      return this.$store.state.reviewDialog
    },
    reviewPages: function () {
      if ( this.$store.state.reviews === null ) {
        return null
      }
      else {
        return Math.ceil(this.$store.state.reviews.total/5)
      }
    },
    reviewsLen: function () {
      if (this.$store.state.reviews != null) {
        return this.$store.state.reviews.reviews.length
      } else {return 0}
    },
    reviewsLoading: function () {
      return this.$store.getters.getreviewsLoading
    },
    rcpType: function () {
      return this.$store.state.editRecipeType
    },
    loadedRecipe: function () {
      if (this.$store.state.recipe !== null) {
        return this.$store.state.recipe
      }
      else {
        return null
      }
    }
  },
  watch: {
    loadedRecipe: function () {
      if (this.loadedRecipe !== null) {
        if (this.$route.params.title == undefined) {
          router.push({ name: 'recipe', params: { id: this.$route.params.id, title: this.$store.state.recipe.title.replace(/\s+/g, '-').toLowerCase()}})
        } else if (this.$store.state.recipe.title.replace(/\s+/g, '-').toLowerCase() !== this.$route.params.title.replace(/\s+/g, '-').toLowerCase()) {
          router.push({ name: 'recipe', params: { id: this.$route.params.id, title: this.$store.state.recipe.title.replace(/\s+/g, '-').toLowerCase() }})
        }
        document.title = this.$store.state.recipe.title
      }
    },
    rcpType: function () {
      this.getRecipeSubTypes()
      var t = this.$store.state.recipe.recipeType[0].toUpperCase() + this.$store.state.recipe.recipeType.slice(1)
      if (this.$store.state.editRecipeType !== t) {
        this.recipeSubType = ""
      }
    },
    reviewRating: function (val) {
      if (val != null) {
        this.reviewRatingError = false   
      }
    },
    reviewDialogWatch: function (val) {
       if (val === false) {
         this.cancleReview()   
       }
    },
    reviewPage: function (val) {
      this.$store.commit('setreviewsLoading', true)
      if (this.$store.state.reviews.reviews.length <= ((val * 5) - 5) ) {
        console.log("need data")
        this.$store.dispatch('getReviews', {"recipeId": this.$route.params.id, "offset": this.$store.state.reviews.nextOffset, "limit": 5})
      }
      else {
        console.log("didn't need data")
        this.$store.commit('setreviewsLoading', false)
        this.visableReviews = this.$store.state.reviews.reviews.slice((this.reviewPage - 1)* 5, this.reviewPage * 5)
      }
    },
    reviewsLen: function (val) {
      if (val > 0 && val <= 5) {
        this.visableReviews = this.$store.state.reviews.reviews
      }
    },
    reviewsLoading: function (val) {
      console.log(val)
      if (val === false) {
        console.log("val was false")
        if ( (this.reviewPage * 5) > this.$store.state.reviews.total ) {
          console.log("short list")
          this.visableReviews = this.$store.state.reviews.reviews.slice((this.reviewPage - 1)* 5, this.$store.state.reviews.total)
        } 
        else {
          console.log("full list")
          this.visableReviews = this.$store.state.reviews.reviews.slice((this.reviewPage - 1)* 5, this.reviewPage * 5)
        }
      }
    }
  },
  mounted () {
    let vm = this
    this.$store.commit('setsubmitReviewLoading', false)
    this.$store.commit('reSetRecipe')
    this.$store.commit('setReviews', null)
    this.autoRefreshToken()
    setTimeout(function () { vm.$store.dispatch('refreshToken') }, 3300000)
    this.$store.dispatch('getRecipe', this.$route.params.id)
    this.callgetReviews()
  },
  beforeDestroy: function () {
    this.$store.commit('reSetRecipe')
    this.$store.commit('setReviews', null)
    this.$store.commit('seteditRecipeDialog', false)
    this.visableReviews = []
    document.title = "Recipes - One Stoop"
  }
}
</script>
