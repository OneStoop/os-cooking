<style>
.v-card__text, .v-card__title {
  word-break: normal; /* maybe !important  */
}
</style>
<template>
  <v-app id="inspire">

    <v-app-bar
      app
      color="cyan"
      dark
      class="hidden-md-and-up"
    >
      <form v-on:submit.prevent="goToSearch()">
        <v-text-field
          label="Outlined"
          placeholder="Search recipes"
          v-model="search"
          outlined
          rounded
          dense
          single-line
          class="mt-5"
        ></v-text-field>
      </form>
      <v-btn @click="goToSearch()" icon><v-icon>search</v-icon></v-btn>

      <v-spacer />
      <router-link :to="'/'" style="text-decoration: none;" class="mr-4">
        <v-icon>home</v-icon>
      </router-link>
      
      <v-btn text v-if="this.$store.getters.isNotAuthenticated" :to="'/signin/'">Sign In</v-btn>
      
      <v-menu bottom left v-if="this.$store.getters.isAuthenticated">
        <template v-slot:activator="{ on }">
          <v-btn
            dark
            icon
            v-on="on"
          >
            <v-icon>account_circle</v-icon>
          </v-btn>
        </template>
        
        <v-list>
          <v-list-item
            v-for="(item, i) in items"
            :key="i"
          >
            <v-btn color="info" text :to="item.to">
              {{ item.title }}
            </v-btn>
          </v-list-item>
        </v-list>
      </v-menu>
    
    </v-app-bar>
  
    <v-app-bar
      app
      color="cyan"
      dark
      class="hidden-sm-and-down"
    >
      <v-btn :to="'/'" text>
        <v-toolbar-title>
          Recipes - One Stoop
        </v-toolbar-title>
      </v-btn>

      <v-btn text v-if="this.$store.getters.isAuthenticated" :to="'/myrecipes'" class="ma-2">My Recipes</v-btn>
      <v-btn text v-if="this.$store.getters.isNotAuthenticated" disabled class="ml-4 mr-4"></v-btn>
      <v-menu
        offset-x
        :nudge-width="200"
      >
        <template v-slot:activator="{ on }">
          <v-btn
            v-on="on"
            class="ma-2"
            text
          >
            Browse <v-icon>keyboard_arrow_down</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            Meal Type
            <v-icon>chevron_right</v-icon>
        </v-card-title>
          <v-divider></v-divider>
          <v-list shaped>
            <v-list-item-group color="primary" v-model="browseItem">
              <v-list-item
                v-for="(item, i) in this.$store.state.recipeTypes.types"
                :key="i"
                :href="'/recipes?recipeType=' + item"
              >
                <v-list-item-content>
                  <v-list-item-title v-text="item"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-menu>      
      

      <form v-on:submit.prevent="goToSearch()">
        <v-text-field
          label="Outlined"
          placeholder="Search recipes"
          v-model="search"
          outlined
          rounded
          dense
          single-line
          class="mt-5"
        ></v-text-field>
      </form>
      <v-btn @click="goToSearch()" icon><v-icon>search</v-icon></v-btn>
      <v-spacer />

      <v-btn text v-if="this.$store.getters.isNotAuthenticated" :to="'/signin/'">Sign In</v-btn>
      
      <v-menu bottom left v-if="this.$store.getters.isAuthenticated">
        <template v-slot:activator="{ on }">
          <v-btn
            dark
            icon
            v-on="on"
          >
            <v-icon>account_circle</v-icon>
          </v-btn>
        </template>
        
        <v-list>
          <v-list-item
            v-for="(item, i) in items"
            :key="i"
          >
            <v-btn color="info" text :to="item.to">
              {{ item.title }}
            </v-btn>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-content>
      <router-view></router-view>
    </v-content>

    <v-footer
      color="cyan"
      app
    >
      <v-spacer />

      <span class="white--text">&copy; 2020</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      browse: false,
      items: [
      { title: "My Profile", to: "/profile/" + this.$store.getters.user.email},
      { title: "My Recipes", to: "/myrecipes"},
      { title: "Sign Out", to: "/signout"}
      ],
      browseItem: null
    }
  },
  computed: {
    search: {
      get () {
        return this.$store.state.searchModel
      },
      set (value) {
          this.$store.commit('setsearchModel', value)
      }
    }
  },
  methods: {
    autoRefreshToken () {
      this.$store.dispatch('refreshToken')
    },
    goToSearch () {
      if (this.$store.state.searchModel != null) {
        window.location.replace('/search?term=' + this.$store.state.searchModel)
        this.$store.commit('setsearchModel', null)
      }
    }
  },
  beforeUpdate () {
  },
  mounted () {
    let vm = this
    // setTimeout(function () { vm.autoRefreshToken() }, 300000)
    setTimeout(function () { vm.autoRefreshToken() }, 3300000)
  },
  watch: {
  }
}
</script>
