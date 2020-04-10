<template>
  <v-app id="inspire">

    <v-app-bar
      app
      color="cyan"
      dark
    >
      <v-btn :to="'/'" text>
        <v-toolbar-title>
          Cooking - One Stoop
        </v-toolbar-title>
      </v-btn>

      <v-btn text v-if="this.$store.getters.isAuthenticated" :to="'/myrecipes'">My Recipes</v-btn>
      <v-menu
        v-model="browse"
        :close-on-content-click="true"
        :nudge-width="200"
        offset-x
      >
        <template v-slot:activator="{ on }">
          <v-btn
            text
            v-on="on"
          >
            Browse <v-icon>keyboard_arrow_down</v-icon>
          </v-btn>
        </template>
      </v-menu>

      <v-text-field
        label="Search"
        single-line
        outlined
      ></v-text-field>
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
            @click="bob"
          >
            <v-btn color="info" text v-if="item.title === 'My Profile'" :to="'/profile/' + $store.getters.user.email">
              My Profile
            </v-btn>
            <v-btn color="info" text v-if="item.title === 'Sign Out'" :to="'/signout'">
              Sign Out
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
      { title: "My Profile"},
      { title: "Sign Out"}
      ]
    }
  },
  computed: {
  },
  methods: {
  },
  beforeUpdate () {
  },
  watch: {
  }
}
</script>
