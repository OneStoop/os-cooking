import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

function loadView(view) {
  return () => import(/* webpackChunkName: "view-[request]" */ `@/views/${view}.vue`)
}
const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: loadView('Home') },
    { path: '/myrecipes', component: loadView('Myrecipes') },
    { path: '/recipe', component: loadView('Recipe') },
    { path: '/recipes', component: loadView('Recipes') },
    { path: '/signin', component: loadView('Signin'), meta: { requiresNoAuth: true } },
    { path: '/signout', component: loadView('Signout'), meta: { requiresAuth: true } }
  ]
})

Vue.use(VueRouter)


router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isAuthenticated) {
      next()
      return
    }
    next('/signin') 
  } else {
    next() 
  }
})
export default router
