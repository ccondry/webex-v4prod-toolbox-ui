import Vue from 'vue'
import Buefy from 'buefy'
import NProgress from 'vue-nprogress'
import { sync } from 'vuex-router-sync'
import App from './App.vue'
import router from './router'
import store from './store'
import * as filters from './filters'
import * as types from 'vuex-store/mutation-types'

import 'buefy/dist/buefy.css'
// import 'vue-material-design-icons/styles.css'

Vue.use(Buefy)

Vue.router = router

Vue.use(NProgress)
// Vue.use(require('vue-moment'))
// Enable devtools
Vue.config.devtools = true

sync(store, router)

const nprogress = new NProgress({ parent: '.nprogress-container' })

const { state } = store

router.beforeEach((to, from, next) => {
  if (state.app.device.isMobile && state.app.sidebar.opened) {
    store.commit(types.TOGGLE_SIDEBAR, false)
  }
  // is user logged out?
  if (state.auth.jwt === null) {
    // console.log('user is not logged in')
    // continue
    next()
  } else {
    // user is logged in
    // continue
    next()
  }
})

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

const app = new Vue({
  router,
  store,
  nprogress,
  ...App
})

export { app, router, store }
