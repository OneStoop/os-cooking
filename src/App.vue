<style>
.v-card__text, .v-card__title {
  word-break: normal; /* maybe !important  */
}
</style>
<template>
  <v-app id="inspire">

    <v-app-bar
      app
      color="primary"
      dark
      class="hidden-md-and-up"
    >
      <form v-on:submit.prevent="goToSearch()">
        <v-text-field
          label="Search"
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

      <v-btn text small v-if="this.$store.getters.isNotAuthenticated" :to="'/signin/'">Sign In</v-btn>
      |
      <v-btn text small v-if="this.$store.getters.isNotAuthenticated" :to="'/signup/'">Sign Up</v-btn>


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
            v-for="(item, i) in this.$store.getters.userMenuItems"
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
      color="primary"
      dark
      class="hidden-sm-and-down"
    >
      <v-toolbar-title
        style="width: 350px"
      >
        <a href="/" class="white--text" style="text-decoration: none">Recipes . OS . com</a>
      </v-toolbar-title>

      <form v-on:submit.prevent="goToSearch()">
        <v-text-field
        flat
        solo-inverted
        hide-details
        prepend-inner-icon="mdi-magnify"
        label="Search"
        v-model="search"
        class="pl-10 ml-4"
        ></v-text-field>
      </form>
      <v-btn @click="goToSearch()" icon><v-icon>search</v-icon></v-btn>
      <v-spacer />

      <v-btn text small v-if="this.$store.getters.isNotAuthenticated" :to="'/signin/'">Sign In</v-btn>
      |
      <v-btn text small v-if="this.$store.getters.isNotAuthenticated" :to="'/signup/'">Sign Up</v-btn>

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
            v-for="(item, i) in this.$store.getters.userMenuItems"
            :key="i"
          >
            <v-btn color="info" text :to="item.to">
              {{ item.title }}
            </v-btn>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-main>
      <v-bottom-navigation
        :value="activeBtn"
        color="primary"
        horizontal
      >
        <a href="/" class="v-btn">
          <span>Home</span>
        </a>

        <v-menu>
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              text
            >
              Browse
            </v-btn>
          </template>
          <v-card>
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

        <a :href="'/myrecipes'" class="v-btn" v-if="this.$store.getters.isAuthenticated">
          <span>My Recipes</span>
        </a>

      </v-bottom-navigation>
    </v-main>

    <v-main>
      <router-view></router-view>
    </v-main>

    <v-footer
      color="primary"
      padless
    >
      <v-row>
        <v-col>

<v-menu
        offset-x
        :nudge-width="200"
      >
        <template v-slot:activator="{ on }">
          <v-btn
            v-on="on"
            class="ma-2 white--text"
            text
          >
            Meal Types <v-icon>keyboard_arrow_down</v-icon>
          </v-btn>
        </template>
        <v-card>
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



        </v-col>
      </v-row>
      <v-spacer />

      <span class="white--text">&copy; 2021</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: "Recipes-OneStoop",
  metaInfo: {
      // if no subcomponents specify a metaInfo.title, this title will be used
      title: '',
      // all titles will be injected into this template
      titleTemplate: '%s | Recipes - One Stoop'
  },
  data () {
    return {
      browse: false,
      browseItem: null,
      activeBtn: 1
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
        window.location.replace('/search?q=' + this.$store.state.searchModel)
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
