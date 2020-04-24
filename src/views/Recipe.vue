<style>
.v-card__text, .v-card__title {
  word-break: normal; /* maybe !important  */
}
</style>
<template>
  <v-container>
    
    <v-row no-gutters v-if="this.$store.state.recipe === null">
      <v-col cols="3" v-for="(d, i) in [1,2,3]" :key="i">
        <v-skeleton-loader
          class="ma-4"
          max-width="300"
          type="card"
        ></v-skeleton-loader>
      </v-col>
    </v-row>

    <v-row no-gutters align="center" justify="center"  v-if="this.$store.state.recipe != null">
      <v-col cols="12">
        <div v-if="this.$store.state.recipe != null">
          <v-icon>home</v-icon>
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

    <v-row align="center" justify="center"  v-if="this.$store.state.recipe != null">
      <v-col cols="8">
        <v-card flat>
          <v-card-title class="display-3">{{ this.$store.state.recipe.title }}</v-card-title>
          <v-card-actions>
            <v-btn class="pa-2 ma-2" v-if="isOwner === false">Bookmark</v-btn>
            <v-spacer></v-spacer>
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
            <v-icon class="ml-4 mr-1">alarm</v-icon>Ready in {{ this.$store.state.recipe.prepTime + this.$store.state.recipe.cookTime }} Minutes
            <v-icon class="ml-4 mr-1">group</v-icon>Servings {{ this.$store.state.recipe.servings }}
            <v-icon class="ml-4 mr-1">bookmark</v-icon>
          </v-card-actions>
        </v-card>
        <v-divider></v-divider>
      </v-col>
    </v-row>

    <v-row align="center" justify="center" v-if="this.$store.state.recipe != null">
      <v-col cols="4">
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
      <v-col cols="5">
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
    setTimeout(function () { vm.$store.dispatch('refreshToken') }, 300000)
    this.$store.dispatch('getRecipe', this.$route.query.id)
  },
  beforeDestroy: function () {
    this.$store.commit('setRecipe', null)
  }
}
</script>
