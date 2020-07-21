import Vue from 'vue'
import Router from 'vue-router'
import menuModule from 'vuex-store/modules/menu'
Vue.use(Router)

/***
Items in the menu module will be added using generateRoutesFromMenu
Make sure you load all components here that are not listed in the menu module
***/
const router = new Router({
  mode: 'history',
  linkExactActiveClass: 'is-active',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    ...generateRoutesFromMenu(menuModule.state.items),
    {
      path: '*',
      redirect: '/webex-v4prod/main/home'
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (!hasQueryParams(to) && hasQueryParams(from)) {
    next({name: to.name, query: from.query})
  } else {
    next()
  }
})

export default router

// Menu should have 2 levels.
function generateRoutesFromMenu (menu = [], routes = []) {
  for (let i = 0, l = menu.length; i < l; i++) {
    let item = menu[i]
    if (item.path) {
      routes.push(item)
    }
    if (!item.component) {
      generateRoutesFromMenu(item.children, routes)
    }
  }
  return routes
}

function hasQueryParams (route) {
  return !!Object.keys(route.query).length
}
