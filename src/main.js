import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import '@mdi/font/css/materialdesignicons.css'
import '@fortawesome/fontawesome-free/css/all.css'
import router from './router'
import store from './store'
import firebase from 'firebase/app'
import 'firebase/auth'

Vue.config.productionTip = false

var fbConfig = {
    apiKey: process.env.VUE_APP_FIREBASE_APIKEY,
    authDomain: process.env.VUE_APP_FIREBASE_AUTHDOMAIN,
    projectId: process.env.VUE_APP_FIREBASE_PROJECTID
}
firebase.initializeApp(fbConfig)

Vue.config.productionTip = process.env.NODE_ENV

store.state.baseurl = process.env.VUE_APP_BASEURL

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
