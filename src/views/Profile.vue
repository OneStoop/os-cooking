<style>
.v-card__text, .v-card__title {
  word-break: normal; /* maybe !important  */
}
</style>
<template>
  <v-container>
    <v-row no-gutters align="center" justify="center">
      <v-col cols="12">
        <div>
          <v-btn icon :to="'/'">
            <v-icon>home</v-icon>
          </v-btn>
          <v-icon>mdi-chevron-right</v-icon>
            <v-btn text class="caption" disabled>
              Profile
            </v-btn>
          <v-divider></v-divider>
        </div>
      </v-col>
    </v-row>
    


    <!-- small display -->
    <v-card class="hidden-md-and-up">
    
    </v-card>
    
    <!-- big display -->
    <v-card class="hidden-sm-and-down" elevation="0">
      <v-row align="center" justify="center" :loading="this.loading">
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
                  <v-icon size="200">fa-user</v-icon>
                </div>
            <v-card-actions>
              <v-chip class="ma-1 pa-4"></v-chip>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="7">
          <v-card height="350px" class="pa-1">
            <br>
            <p>Name: {{ this.pageProfile.name }}</p>
            <p>email: {{ this.pageProfile.email }}</p>
            <p>Display Name: {{ this.pageProfile.displayName }}</p>
            <v-card-actions>
            </v-card-actions>
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
      breadcrumbs: [
        {
          text: 'Dashboard',
          disabled: false,
          href: '/',
        }
      ],
      pageProfile: null,
      loading: false
    }
  },
  methods: {
  },
  computed: {
  },
  watch: {
  },
  mounted () {
    // this.$store.dispatch('getProfile', this.$route.query.id)
    document.title = "Profile - One Stoop"
    let vm = this
    var headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': this.$store.state.token
    }
    this.loading = true
    fetch(process.env.VUE_APP_API_SERVER + 'users/' + this.$route.params.id,
      {
        method: 'GET',
        mode: 'cors',
        headers: headers
      }
    )
    .then(response => response.json())
    .then(data => {
      vm.pageProfile = data
      vm.loading = false 
    })
    .catch(function (error) {
      vm.loading = false
      console.log(error)
    })
  },
  beforeDestroy: function () {
    document.title = "Recipes - One Stoop"
  }
}
</script>
