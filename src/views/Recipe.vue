<style>
.v-card__text, .v-card__title {
  word-break: normal; /* maybe !important  */
}
</style>
<template>
  <v-container>
    <v-row no-gutters align="center" justify="center"  v-if="this.$store.state.recipe != null">
      <v-col cols="12">
        <div v-if="this.$store.state.recipe != null">
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
    
    <v-row no-gutters v-if="this.$store.state.recipe === null">
      <v-col cols="12">
        <v-skeleton-loader
          class="ma-4"
          type="card"
        ></v-skeleton-loader>
      </v-col>
    </v-row>

    <!-- small display -->
    <v-card class="hidden-md-and-up">
      <v-card-title>{{ this.$store.state.recipe.title }}</v-card-title>
        <v-row v-if="this.$store.state.recipe != null" dense>
          <v-btn class="pa-2 ma-2" v-if="isOwner === false">Bookmark</v-btn>
          <v-icon class="ml-4 mr-1">bookmark</v-icon>
          <v-rating
            :value="this.$store.state.recipe.rating"
            color="amber"
            dense
            half-increments
            readonly
            size="14"
            class="pl-2 ml-2"
          ></v-rating>
          <div class="grey--text ml-1">{{ this.$store.state.recipe.rating }} ({{ this.$store.state.recipe.ratingCount }})</div>
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
                lazy-src="https://onestoop00001.nyc3.digitaloceanspaces.com/onestoop00001/NoImage.jpeg"
                height="300px"
                contain
              ></v-img>
            </div>
            <div v-if="this.$store.state.recipe.images.length === 0">
              <v-img
                src="https://onestoop00001.nyc3.digitaloceanspaces.com/onestoop00001/NoImage.jpeg"
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
            <v-card-actions>
              <v-tooltip bottom v-if="isOwner">
                <template v-slot:activator="{ on }">
                  <v-chip v-on="on">
                    <v-icon>create</v-icon>
                  </v-chip>
                </template>
                <span>Edit Description</span>
              </v-tooltip>
            </v-card-actions>
          </v-card>
          </v-col>
        </v-row>
        
        <v-row>
          <p class="title ml-4">
            Ingredients
            <v-tooltip bottom v-if="isOwner">
                <template v-slot:activator="{ on }">
                  <v-chip v-on="on">
                    <v-icon>create</v-icon>
                  </v-chip>
                </template>
                <span>Edit Ingredients</span>
              </v-tooltip>  
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
            <v-tooltip bottom v-if="isOwner">
                <template v-slot:activator="{ on }">
                  <v-chip v-on="on">
                    <v-icon>create</v-icon>
                  </v-chip>
                </template>
                <span>Edit Directions</span>
              </v-tooltip>  
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
    
    <!-- big screen -->
    <v-card class="hidden-sm-and-down">
      <v-card-title class="display-1">{{ this.$store.state.recipe.title }}</v-card-title>

      <v-row align="center" justify="center"  v-if="this.$store.state.recipe != null">
        <v-col cols="12">
          <v-card flat>
            <v-card-actions>
              <v-btn class="pa-2 ma-2" v-if="isOwner === false">Bookmark</v-btn>
              <v-icon class="ml-4 mr-1">bookmark</v-icon>
              <v-rating
                :value="this.$store.state.recipe.rating"
                color="amber"
                dense
                half-increments
                readonly
                size="14"
                class="pl-2 ml-2"
              ></v-rating>
              <div class="grey--text ml-1">{{ this.$store.state.recipe.rating }} ({{ this.$store.state.recipe.ratingCount }})</div>
              
              <v-spacer></v-spacer>
              
              <v-icon class="ml-4 mr-1">alarm</v-icon>Ready in {{ this.$store.state.recipe.prepTime + this.$store.state.recipe.cookTime }} Minutes
              <v-icon class="ml-4 mr-1">group</v-icon>Servings {{ this.$store.state.recipe.servings }}
              
            </v-card-actions>
          </v-card>
          <v-divider></v-divider>
        </v-col>
      </v-row>
      
      <v-row align="center" justify="center" v-if="this.$store.state.recipe != null">
        <v-col cols="5">
          <v-card height="350px" class="pa-1">
            <div v-if="this.$store.state.recipe.images.length === 1">
                  <v-img
                    :src="this.$store.state.recipe.images[0].url"
                    lazy-src="https://onestoop00001.nyc3.digitaloceanspaces.com/onestoop00001/NoImage.jpeg"
                    height="300px"
                    contain
                  ></v-img>
                </div>
                <div v-if="this.$store.state.recipe.images.length === 0">
                  <v-img
                    src="https://onestoop00001.nyc3.digitaloceanspaces.com/onestoop00001/NoImage.jpeg"
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
              <v-tooltip bottom v-if="isOwner">
                <template v-slot:activator="{ on }">
                  <v-chip v-on="on">
                    <v-icon>create</v-icon>
                  </v-chip>
                </template>
                <span>Edit Description</span>
              </v-tooltip>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      
      <v-row align="center" justify="center" v-if="this.$store.state.recipe != null">
        <v-col cols="8">
          <p class="title">
            Ingredients
            <v-tooltip bottom v-if="isOwner">
                <template v-slot:activator="{ on }">
                  <v-chip v-on="on">
                    <v-icon>create</v-icon>
                  </v-chip>
                </template>
                <span>Edit Ingredients</span>
              </v-tooltip>  
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
            <v-tooltip bottom v-if="isOwner">
                <template v-slot:activator="{ on }">
                  <v-chip v-on="on">
                    <v-icon>create</v-icon>
                  </v-chip>
                </template>
                <span>Edit Directions</span>
              </v-tooltip>  
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
  computed: {
    isOwner: function () {
      if (this.$store.state.profile != null) {
        if (this.$store.state.recipe.authorId === this.$store.state.profile._id) {
          return true
        } else { return false }
      } else return false
    }
  },
  mounted () {
    let vm = this
    this.autoRefreshToken()
    setTimeout(function () { vm.$store.dispatch('refreshToken') }, 3300000)
    this.$store.dispatch('getRecipe', this.$route.query.id)
  },
  beforeDestroy: function () {
    this.$store.commit('setRecipe', null)
  }
}
</script>
