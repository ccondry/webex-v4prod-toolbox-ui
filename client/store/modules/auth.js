import * as types from '../mutation-types'
import { post } from '../../utils'

function parseJwt (token) {
  var base64Url = token.split('.')[1]
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  return JSON.parse(window.atob(base64))
}

const state = {
  jwt: null,
  jwtUser: {}
}

const getters = {
  jwt: state => state.jwt,
  jwtUser: state => state.jwtUser,
  authenticated: state => state.jwt !== null
}

const mutations = {
  [types.SET_JWT] (state, data) {
    state.jwt = data
  },
  [types.SET_JWT_USER] (state, data) {
    state.jwtUser = data
  }
}

const actions = {
  setJwt ({commit}, data) {
    commit(types.SET_JWT, data)
    // set authToken in localStorage also
    window.localStorage.setItem('jwt', data)
    // decode jwt and store as user data
    commit(types.SET_JWT_USER, parseJwt(data))
  },
  unsetJwt ({commit}) {
    // unset JWT in state
    commit(types.SET_JWT, null)
    // remove JWT from localStorage
    window.localStorage.removeItem('jwt')
    // unset user in state
    commit(types.SET_JWT_USER, {})
  },
  async logout ({dispatch, commit, getters}) {
    console.log('logging out user')
    try {
      // tell server we're logging out
      const response = await post(getters.jwt, getters.endpoints.logout)
      // store new auth token in localStorage
      dispatch('setJwt', response.jwt)
      // get new user details
      dispatch('loadUser')
      dispatch('successNotification', `Successfully logged out of ${getters.user.username}`)
    } catch (e) {
      console.log(e.message)
      dispatch('errorNotification', `Failed to log out of ${getters.user.username}`)
      // remove JWT
      commit(types.SET_JWT, null)
      // remove JWT from localStorage
      window.localStorage.removeItem('jwt')
      // remove user from state
      commit(types.SET_JWT_USER, {})
    }
  },
  async checkLogin ({getters, dispatch, commit, rootState}) {
    console.log('checking localstorage for JWT login token')
    // retrieve auth token from localStorage
    const jwt = window.localStorage.getItem('jwt')
    // if we found a token, check the web service to see if it's still valid
    if (jwt !== null) {
      console.log('JWT login token found in localStorage')
      console.log('saving JWT in state')
      dispatch('setJwt', jwt)
    } else {
      console.log('JWT not found in localstorage.')
      // forward user to login page, if in production
      if (process.env.NODE_ENV === 'production') {
        window.location = '/auth/login?destination=' + window.location
      }
    }
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
