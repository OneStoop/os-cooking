<style>
.v-card__text, .v-card__title {
  word-break: normal; /* maybe !important  */
}
</style>
<template>
  <v-container>
    <v-card class="hidden-md-and-up">
      <v-row no-gutters v-if="this.$store.getters.getrecipesLoading === false">
        <v-col cols="12" v-for="d in this.$store.state.recipes.recipes" :key="d._id">
          <v-card class="pa-2 ma-2" md="2">
            <router-link :to="'/recipe/' + d._id + '/' + d.title.replace(/\s+/g, '-').toLowerCase()">
            <div v-if="d.images.length > 0">
              <v-img
                :src="d.images[0].image.url"
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
      <v-row no-gutters v-if="showLoading">
        <v-col cols="12">
          <v-skeleton-loader
            class="ma-4"
            type="card"
          ></v-skeleton-loader>
        </v-col>
      </v-row>
      <v-row no-gutters v-if="noResults">
        <v-col cols="12">
          <v-card class="pa-2 ma-2" md="2">
            <v-img
              class="white--text"
              heigh="300px"
              src="https://storage.googleapis.com/onestoopimages01/no-results-cake.jpg"
            >
              <v-card-title>No Results, but you can add your own recipe!</v-card-title>
            </v-img>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
    
    
    <v-card class="hidden-sm-and-down">
    <v-row no-gutters v-if="this.$store.getters.getrecipesLoading === false">
      <v-col cols="3" v-for="d in this.$store.state.recipes.recipes" :key="d._id">
        <v-card class="pa-2 ma-2" md="2">
          <router-link :to="'/recipe/' + d._id + '/' + d.title.replace(/\s+/g, '-').toLowerCase()">
          <div v-if="d.images.length > 0">
            <v-img
              :src="d.images[0].image.url"
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
    
    <v-row no-gutters v-if="showLoading">
      <v-col cols="3" v-for="(d, i) in [1,2,3]" :key="i">
        <v-skeleton-loader
          class="ma-4"
          max-width="300"
          type="card"
        ></v-skeleton-loader>
      </v-col>
    </v-row>
    <v-row no-gutters v-if="noResults">
      <v-col cols="12">
        <v-card class="pa-2 ma-2" md="2">
          <v-img
            class="white--text"
            heigh="300px"
            src="https://storage.googleapis.com/onestoopimages01/no-results-cake.jpg"
          >
            <v-card-title>No Results, but you can add your own recipe!</v-card-title>
          </v-img>
        </v-card>
      </v-col>
    </v-row>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
    autoRefreshToken () {
      this.$store.dispatch('refreshToken')
    },
    scroll () {
      window.onscroll = () => {
        let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight

        if (bottomOfWindow) {
          // this.addPosts()
          console.log("at the bottom")
          if (this.$store.state.recipes.moreResults && this.$store.state.addrecipesLoading === false) {
            var newQuery = this.$route.query
            newQuery['limit'] = 10
            newQuery['nextOffset'] = this.$store.state.recipes.nextOffset
            console.log(newQuery)
            this.$store.dispatch('addRecipes', newQuery)
          }
        }
      }
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
    showLoading: function () {
       if (this.$store.getters.getrecipesLoading === true || this.$store.state.addrecipesLoading === true) {
        return true
       }
       else {
        return false
       }
    },
    noResults: function () {
      if ( this.showLoading === false && this.$store.state.recipes !== null ) {
        if ( this.$store.state.recipes.recipes.length > 0 ) {
          return false
        }
        else {
          return true
        }
      }
      else {
        return false
      }

    }
  },
  mounted () {
    let vm = this
    this.autoRefreshToken()
    setTimeout(function () { vm.$store.dispatch('refreshToken') }, 3300000)
    this.$store.commit('setRecipes', [])
    this.$store.dispatch('searchRecipes', this.$route.query)
  },
  beforeDestroy: function () {
    this.$store.commit('setRecipes', [])
  }
}
</script>
