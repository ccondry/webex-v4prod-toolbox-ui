import * as types from '../mutation-types'

const state = {
  session: {},
  verticals: [],
  demoConfig: {},
  instance: {}
}

const mutations = {
  [types.SET_DCLOUD_SESSION] (state, data) {
    state.session = data
  },
  [types.SET_VERTICALS] (state, data) {
    state.verticals = data
  },
  [types.SET_DEMO_CONFIG] (state, data) {
    state.demoConfig = data
  },
  [types.SET_DCLOUD_INSTANCE] (state, data) {
    // choose the first instance
    const i = data.find(v => v.id === 1)
    if (i) {
      state.instance = i
    }
  }
}

const getters = {
  verticals: state => state.verticals,
  demoConfig: state => state.demoConfig,
  dcloudSession: state => state.session,
  instance: state => state.instance || {},
  sessionId: (state, getters) => getters.instance.session,
  datacenter: (state, getters) => getters.instance.datacenter,
  brandDemoLink (state, getters) {
    return `https://mm-brand.cxdemo.net?session=${getters.sessionId}&datacenter=${getters.datacenter}&userId=${getters.user.id}`
  },
  cumulusDemoLink (state, getters) {
    return `https://mm.cxdemo.net?session=${getters.sessionId}&datacenter=${getters.datacenter}&userId=${getters.user.id}`
  }
}

const actions = {
  async getInstance ({getters, commit, dispatch}, showNotification = true) {
    dispatch('setLoading', {group: 'dcloud', type: 'instance', value: true})
    try {
      await dispatch('loadToState', {
        name: 'dcloud instance info',
        endpoint: getters.endpoints.instance,
        query: {
          demo: 'webex',
          version: 'v4prod'
        },
        mutation: types.SET_DCLOUD_INSTANCE,
        showNotification
      })
    } catch (e) {
      console.error('error loading dcloud instance info:', e)
    } finally {
      dispatch('setLoading', {group: 'dcloud', type: 'instance', value: false})
    }
  },
  async getSession ({getters, commit, dispatch}, showNotification = true) {
    dispatch('setLoading', {group: 'dcloud', type: 'session', value: true})
    try {
      await dispatch('loadToState', {
        name: 'dcloud session info',
        endpoint: getters.endpoints.session,
        mutation: types.SET_DCLOUD_SESSION,
        showNotification,
        query: {
          session: getters.sessionId,
          datacenter: getters.datacenter,
          userId: getters.user.id
        }
      })
    } catch (e) {
      console.error('error loading dcloud session info', e)
    } finally {
      dispatch('setLoading', {group: 'dcloud', type: 'session', value: false})
    }
  },
  async loadVerticals ({getters, commit, dispatch}, showNotification = true) {
    dispatch('setLoading', {group: 'dcloud', type: 'vertical', value: true})
    await dispatch('loadToState', {
      name: 'verticals',
      endpoint: getters.endpoints.vertical,
      mutation: types.SET_VERTICALS,
      success: 'Verticals loaded.',
      fail: 'Failed to load verticals list',
      showNotification
    })
    dispatch('setLoading', {group: 'dcloud', type: 'vertical', value: false})
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
