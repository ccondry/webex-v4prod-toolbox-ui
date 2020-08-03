<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile">
        <!-- repeat this tile for each agent -->
        <div class="tile is-parent">
          <article class="tile is-child box">

            <p class="title">{{ agent.name }}</p>
            <p class="subtitle">{{ agent.role }}</p>
            <img :src="agent.picture" width="128px">
            <p>
              <strong>Username: {{ agent.username }}</strong>
              <a @click="clickCopy(agent.username, 'Username')"><b-icon icon="layers"></b-icon></a>
            </p>
            <p>
              <strong>Password: {{ agent.password }}</strong>
              <a @click="clickCopy(agent.password, 'Password')"><b-icon icon="layers"></b-icon></a>
            </p>
            <p>
              <strong>Extension: {{ agent.extension }}</strong>
              <a @click="clickCopy(agent.extension, 'Extension')"><b-icon icon="layers"></b-icon></a>
            </p>
            <center>
              <b-field>
                <button class="button is-success" @click="clickAgentPortal">Go to Agent Desktop</button>
              </b-field>
            </center>
          </article>
        </div>
        <div class="tile is-parent">
          <article class="tile is-child box">

            <p class="title">{{ supervisor.name }}</p>
            <p class="subtitle">{{ supervisor.role }}</p>
            <img :src="supervisor.picture" width="128px">
            <p>
              <strong>Username: {{ supervisor.username }}</strong>
              <a @click="clickCopy(supervisor.username, 'Username')"><b-icon icon="layers"></b-icon></a>
            </p>
            <p>
              <strong>Password: {{ supervisor.password }}</strong>
              <a @click="clickCopy(supervisor.password, 'Password')"><b-icon icon="layers"></b-icon></a>
            </p>
            <p>
              <strong>Extension: {{ supervisor.extension }}</strong>
              <a @click="clickCopy(supervisor.extension, 'Extension')"><b-icon icon="layers"></b-icon></a>
            </p>
            <center>
              <b-field>
                <button class="button is-success" @click="clickWebexAdminPortal">Go to Control Hub</button>
              </b-field>
              <b-field>
                <button class="button is-success" @click="clickCjpAdminPortal">Go to Management Portal</button>
              </b-field>
            </center>
          </article>
        </div>

      </div>
    </div>
   

    <input type="hidden" id="clipboard" :value="clipboard">

  </div>
</template>


<script>
import {mapActions} from 'vuex'

export default {
  props: ['user'],

  data () {
    return {
      portalUrl: 'https://portal.ccone.net',
      webexAdminPortalUrl: 'https://admin.webex.com/overview',
      agentPortalUrl: 'https://agent.cjp.cisco.com/ada-ws/home',
      cjpAdminPortalUrl: 'https://portal.cjp.cisco.com/portal/home',
      clipboard: 'initial-value'
    }
  },

  computed: {
    agent () {
      return {
        picture: 'https://mm.cxdemo.net/static/images/cumulus/common/author1.png',
        username: 'sjeffers' + this.user.id + '@cc1.dc-01.com',
        password: 'C1sco12345',
        extension: '1080' + this.user.id,
        name: 'Sandra Jefferson',
        role: 'Agent'
      }
    },
    supervisor () {
      return {
        picture: 'https://mm.cxdemo.net/static/images/cumulus/common/author3.png',
        username: 'rbarrows' + this.user.id + '@cc1.dc-01.com',
        password: 'C1sco12345',
        extension: '1082' + this.user.id,
        name: 'Rick Barrows',
        role: 'Administrator / Agent'
      }
    }
  },

  methods: {
    ...mapActions([
      'copyToClipboard'
    ]),
    clickAgentPortal (e) {
      // open agent portal in new tab
      window.open(this.agentPortalUrl, '_blank')
    },
    clickWebexAdminPortal (e) {
      // open admin portal in new tab
      window.open(this.webexAdminPortalUrl, '_blank')
    },
    clickCjpAdminPortal (e) {
      // open admin portal in new tab
      window.open(this.cjpAdminPortalUrl, '_blank')
    },
    clickCopy (string, type) {
      this.copyToClipboard({string, type})
    }
  }
}
</script>
