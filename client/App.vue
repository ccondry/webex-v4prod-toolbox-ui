<template>
  <div id="app">
    <nprogress-container></nprogress-container>
    <b-loading :is-full-page="true" :active="loading.app.endpoints" :can-cancel="false"></b-loading>
    <navbar :show="true" :menu-filter.sync="menuFilter"></navbar>
    <div v-if="authenticated && endpoints" style="min-height: calc(100vh - 1.6em);">
      <app-main></app-main>
    </div>
    <!-- <footer-bar></footer-bar> -->
    <footer class="footer" style="height: 1.6em; padding: 0; background-color: #ebebeb">
      <div class="content">
        <small style="padding-right: 2em;">
          UI version {{ uiVersion }}
        </small>
        <small>
          API version {{ apiVersion }}
        </small>
      </div>
    </footer>
  </div>
</template>

<script>
import NprogressContainer from 'vue-nprogress/src/NprogressContainer'
import { Navbar, AppMain } from 'components/layout/'
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      menuFilter: ''
    }
  },

  components: {
    Navbar,
    AppMain,
    NprogressContainer
  },

  async beforeMount () {
    const { body } = document
    const WIDTH = 768
    const RATIO = 3

    const handler = () => {
      if (!document.hidden) {
        let rect = body.getBoundingClientRect()
        let isMobile = rect.width - RATIO < WIDTH
        this.toggleDevice(isMobile ? 'mobile' : 'other')
        this.toggleSidebar({
          opened: !isMobile
        })
      }
    }

    // add event listeners for DOM events
    document.addEventListener('visibilitychange', handler)
    window.addEventListener('DOMContentLoaded', handler)
    window.addEventListener('resize', handler)

    // check the JWT in localstorage to see if the user is already logged in
    // try {
    console.log('checking login...')
    await this.checkLogin()
    console.log('checking login done.')
    // load current user data from database
    await this.loadUser(false)
    // load current user provision info from database
    await this.getProvision(false)
    // get dcloud instant demo instance info from database
    await this.getInstance(false)
    // get dCloud session information, like phone numbers
    await this.getSession(false)
    // get REST API version info
    await this.getVersionInfo(false)
  },

  async mounted () {
  },

  computed: {
    ...mapGetters([
      'sidebar',
      'authenticated',
      'loading',
      'endpoints',
      'provision',
      'uiVersion',
      'apiVersion'
    ])
  },

  methods: {
    ...mapActions([
      'toggleDevice',
      'toggleSidebar',
      'checkLogin',
      'getEndpoints',
      'loadUser',
      'getInstance',
      'getSession',
      'getProvision',
      'getVersionInfo'
    ])
  },
  watch: {
    authenticated (val, oldVal) {
      if (oldVal === true && val === false) {
        // if user goes from logged in to logged out, forward them to the login page
        window.location = '/auth/login?destination=' + window.location
      } else if (oldVal === false && val === true) {
        // user just logged in
        // load user details from database
        // this.loadUser()
      }
    }
  }
}
</script>

<style lang="scss">
html {
  background-color: whitesmoke;
}

.nprogress-container {
  position: fixed !important;
  width: 100%;
  height: 50px;
  z-index: 2048;
  pointer-events: none;

  #nprogress {
    $color: #48e79a;

    .bar {
      background: $color;
    }
    .peg {
      box-shadow: 0 0 10px $color, 0 0 5px $color;
    }

    .spinner-icon {
      border-top-color: $color;
      border-left-color: $color;
    }
  }
}

// style the b-collapse heading bar
.content .card-header .card-header-title {
  margin-bottom: 0;
}
.card-header-title, .card-header-icon {
  background-color: #f3f3f3;
}
</style>
