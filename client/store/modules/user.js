import * as types from '../mutation-types'
import defaults from '../../defaults'

const state = {
  user: {},
  provision: {}
}

const getters = {
  user: state => state.user,
  // the provision info for this user for this demo
  provision: state => {
    try {
      return state.provision || {}
    } catch (e) {
      return {}
    }
  },
  // is user provisioned and ready to use this demo?
  isProvisioned: (state, getters) => {
    try {
      return getters.provision.isDone
    } catch (e) {
      return false
    }
  },
  // has user requested provision but provision is not done yet?
  hasRequestedProvision: (state, getters) => {
    if (getters.provision.isDone === false) {
      return true
    }
  },
  isSwitchUser: (state, getters) => {
    return typeof getters.jwtUser.suJwt === 'string'
  }
}

const mutations = {
  [types.SET_USER] (state, data) {
    // console.log('rootState:', this.state)
    const demoId = this.state.demoConfigId
    // make sure parent objects exist in user data
    data.demo = data.demo || {}
    data.demo[demoId] = data.demo[demoId] || {}

    try {
      // set default values from root state, if not set in user's demo config
      if (typeof data.demo[demoId].async !== 'boolean') {
        data.demo[demoId].async = defaults.chat.async
      }
      data.demo[demoId].CiscoAppId = data.demo[demoId].CiscoAppId || defaults.chat.CiscoAppId
      data.demo[demoId].DC = data.demo[demoId].DC || defaults.chat.DC
      data.demo[demoId].appPrefix = data.demo[demoId].appPrefix || defaults.chat.appPrefix
      data.demo[demoId].orgId = data.demo[demoId].orgId || defaults.chat.orgId
      data.demo[demoId].templateId = data.demo[demoId].templateId || defaults.chat.templateId
    } catch (e) {
      console.log('failed to assign values to demo config:', e)
    }

    // save to state
    state.user = data
  },
  [types.SET_USER_PROVISION] (state, data) {
    if (data.length) {
      state.provision = data[0]
    } else {
      // not provisioned
    }
  }
}

const actions = {
  async provisionUser ({getters, dispatch}, showNotification = true) {
    dispatch('setWorking', {group: 'user', type: 'provision', value: true})
    try {
      await dispatch('postData', {
        name: 'provision user for demo',
        endpoint: getters.endpoints.doProvision,
        query: {
          username: getters.user.username,
          demo: 'webex',
          version: 'v4prod'
        },
        showNotification
      })
    } catch (e) {
      console.error('error provisioning user:', e)
    } finally {
      dispatch('setWorking', {group: 'user', type: 'provision', value: false})
      // load provision data now
      dispatch('getProvision', false)
    }
  },
  async getProvision ({getters, dispatch}, showNotification = true) {
    dispatch('setLoading', {group: 'user', type: 'provision', value: true})
    try {
      await dispatch('loadToState', {
        name: 'user provision info',
        endpoint: getters.endpoints.provision,
        query: {
          username: getters.user.username,
          demo: 'webex',
          version: 'v4prod'
        },
        mutation: types.SET_USER_PROVISION,
        showNotification
      })
    } catch (e) {
      console.error('error loading user provision info:', e)
    } finally {
      dispatch('setLoading', {group: 'user', type: 'provision', value: false})
    }
  },
  async loadUser ({getters, dispatch}, showNotification = true) {
    try {
      dispatch('setLoading', {group: 'app', type: 'user', value: true})
      await dispatch('loadToState', {
        name: 'load user',
        endpoint: getters.endpoints.user,
        mutation: types.SET_USER,
        // success: 'User details loaded',
        fail: 'Failed to load user details',
        showNotification
      })
    } catch (e) {
      console.error('error loading user', e)
      dispatch('errorNotification', {title: 'Failed to load user details', message: e.message})
    } finally {
      dispatch('setLoading', {group: 'app', type: 'user', value: false})
    }
  },
  async saveDemoConfig ({getters, dispatch}, {data, showNotification = true}) {
    try {
      dispatch('setWorking', {group: 'app', type: 'user', value: true})
      await dispatch('postData', {
        name: 'save demo configuration',
        endpoint: getters.endpoints.userDemo + '?id=' + getters.demoConfigId,
        success: 'Demo configuration saved.',
        fail: 'Failed to save your demo configuration',
        data,
        showNotification
      })
    } catch (e) {
      console.error('error saving demo config', e)
      dispatch('errorNotification', {title: 'Failed to save demo config', error: e})
    } finally {
      dispatch('setWorking', {group: 'app', type: 'user', value: false})
    }
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
