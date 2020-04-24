<style>
.v-card__text, .v-card__title {
  word-break: normal; /* maybe !important  */
}
</style>
<template>
  <v-container>

    <v-row no-gutters v-if="this.$store.getters.getrecipesLoading === false">
      <v-col cols="3" v-for="d in this.$store.state.recipes.recipes" :key="d._id">
        <v-card class="pa-2 ma-2" md="2">
          <router-link :to="'/recipe?id=' + d._id">
          <div v-if="d.images.length === 1">
            <v-img
              :src="d.images[0].url"
              lazy-src="https://onestoop00001.nyc3.digitaloceanspaces.com/onestoop00001/NoImage.jpeg"
              height="300px"
              
            ></v-img>
          </div>
          <div v-if="d.images.length === 0">
            <v-img
              src="https://onestoop00001.nyc3.digitaloceanspaces.com/onestoop00001/NoImage.jpeg"
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
            <div class="grey--text ml-4">{{ d.rating }} ({{ d.ratingCount }})</div>
            <v-spacer></v-spacer>
            <v-btn icon>
              <v-icon>bookmarkt</v-icon>
            </v-btn>
            <v-btn icon>
              <v-icon>mdi-share-variant</v-icon>
            </v-btn>
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
    },
    doClick () {
      this.$store.dispatch('getRecipes', this.$route.query)
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
    }
  },
  mounted () {
    let vm = this
    this.autoRefreshToken()
    setTimeout(function () { vm.$store.dispatch('refreshToken') }, 3300000)
    this.$store.commit('setRecipes', [])
    this.$store.dispatch('getRecipes', this.$route.query)
    this.scroll()
  },
  beforeDestroy: function () {
    this.$store.commit('setRecipes', [])
  }
}
</script>
