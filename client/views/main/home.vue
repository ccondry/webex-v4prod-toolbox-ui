<template>
  <div>
    
    <div class="tile is-ancestor">
      <div class="tile is-parent is-12">
        <article class="tile is-child box">
          <h1 class="title">Welcome</h1>
          <b-field>
            <p>
              Welcome to the Cisco Webex Contact Center v4 Instant Demo on dCloud.
            </p>
          </b-field>
          <b-field>
            <p>
              Click this button to get support, ask questions, and suggest
              new features:
            </p>
          </b-field>
          <b-field>
            <button class="button is-success" @click.prevent="showSupportRoomDialog" >
              Join Support Room
            </button>
          </b-field>
        </article>
      </div>
    </div>

    <div v-if="loading.user.provision">
      <div class="tile is-ancestor">
        <div class="tile is-parent is-12">
          <article class="tile is-child box">
            <h1 class="title">Loading...</h1>
          </article>
        </div>
      </div>
    </div>

    <div class="tile is-ancestor" v-if="!loading.user.provision && !isProvisioned && !hasRequestedProvision">
      <!-- user not provisioned - show provision button -->
      <div class="tile is-parent is-12">
        <article class="tile is-child box">
          <h1 class="title">Start</h1>
          <b-field>
            <p>
              Your account is not provisioned for this demo yet. Would you like
              to provision it now?
            </p>
          </b-field>
          <b-field>
            <button class="button is-success" @click.prevent="clickProvision" :disabled="working.user.provision">
              {{ working.user.provision ? 'Working...' : 'Yes, Provision Me' }}
            </button>
          </b-field>
        </article>
      </div>
    </div>

    <div class="tile is-ancestor" v-if="!loading.user.provision && hasRequestedProvision">
      <!-- user not provisioned - show provision button -->
      <div class="tile is-parent is-12">
        <article class="tile is-child box">
          <h1 class="title">Provision In Progress</h1>
          <b-field>
            <p>
              Your account is currently marked for provisioning. Please allow 
              10-15 minutes for your account to be ready. We will notify you via
              Webex Teams when your account is ready, and this page will
              change to show your account details.
            </p>
          </b-field>
          <!-- <b-field>
            <button class="button is-success" @click.prevent="clickProvision" :disabled="working.user.provision">
              {{ working.user.provision ? 'Working...' : 'Yes, Provision Me' }}
            </button>
          </b-field> -->
        </article>
      </div>
    </div>
    
    <!-- user is provisioned - show agent info -->
    <div class="tile is-ancestor" v-if="!loading.user.provision && isProvisioned">
      <div class="tile is-parent">
        <article class="tile is-child box is-horizontal">
          <h1 class="title">Agents</h1>
          <div class="content">
            <agents :user="user" />
          </div>
        </article>
      </div>
    </div>
    
    <!-- Demo Website config -->
    <div class="tile is-ancestor" v-if="!loading.user.provision && isProvisioned">
      <div class="tile is-parent">
        <article class="tile is-child box">

          <!-- Brand -->
          <b-collapse class="content card">
            <div slot="trigger" slot-scope="props" class="card-header">
              <p class="card-header-title">Demo Website</p>
              <a class="card-header-icon">
                <b-icon :icon="props.open ? 'menu-down' : 'menu-up'" />
              </a>
            </div>
            <div class="card-content" v-if="loading.dcloud.vertical">
              <b-loading :is-full-page="false" :active="loading.dcloud.vertical" :can-cancel="false"></b-loading>
            </div>
            <div class="card-content" v-else>
              <div class="select">
                <select class="input" v-model="model.vertical" @change="verticalChanged">
                  <option value="" disabled selected>
                    {{ loading.dcloud.vertical ? 'Loading...' : 'Choose Your Demo Vertical' }}
                  </option>
                  <option v-for="(brand, index) in systemBrands" :value="brand.id" :key="brand.id">
                    {{ `${brand.name} (${brand.id})` }}
                  </option>
                  <option disabled>-----------------------------------------</option>
                  <option v-for="(brand, index) in userBrands" :value="brand.id" :key="brand.id">
                    {{ `${brand.name} (${brand.id})` }}
                  </option>
                  <option v-for="(brand, index) in myBrands" :value="brand.id" :key="brand.id">
                    {{ `${brand.name} (${brand.id})` }}
                  </option>
                  <option v-for="(brand, index) in filteredSortedBrands" :value="brand.id" :key="brand.id">
                    {{ `${brand.name} (${brand.id})` }}
                  </option>
                </select>
              </div>
              &nbsp;
              <button class="button is-success" @click="clickGo">Go to Demo Website</button>
              &nbsp;
              <span style="font-size: 1.3em;">
                Or for quick access, call <strong>{{ demoNumber }}</strong>
                Ext. <strong>{{ model.queueId }}</strong>
                </span>
              <b-field style="margin-top: 6px;">
                <b-checkbox v-model="showMore">Show More</b-checkbox>
              </b-field>
              <b-field v-show="showMore">
                <div class="field">
                  <div class="field">
                    <b-radio v-model="brandFilter"
                    v-if="user.admin || user.suJwt"
                    native-value="all">Show all verticals</b-radio>
                  </div>
                  <div class="field">
                    <b-radio v-model="brandFilter"
                    native-value="mine">Show my verticals</b-radio>
                  </div>
                  <div class="field">
                    <b-radio v-model="brandFilter"
                    native-value="other">
                    <span style="float: left;">Show this user's verticals:</span>
                    <b-autocomplete
                      v-model="ownerFilter"
                      :data="autocompleteOwners">
                      <template slot="empty">No results found</template>
                    </b-autocomplete>
                  </b-radio>
                  </div>
                </div>
              </b-field>
                <p>
                  Note: You can create and configure your own vertical on the
                <a href="/branding" target="brand-toolbox">
                  <strong>Demo Branding Toolbox</strong>
                </a>.
              </p>
              <!-- Save Button -->
              <!-- <b-field>
                <button type="button" class="button is-success"
                @click.prevent="clickSave" :disabled="disableSave">Save</button>
              </b-field> -->
              <!-- /Save Button -->

            </div>
          </b-collapse>
          <!-- /Brand -->
          <!-- Advanced -->
          <b-collapse class="content card" :open="false" v-if="user.admin || isSwitchUser">
            <div slot="trigger" slot-scope="props" class="card-header">
              <p class="card-header-title">Admin Configuration</p>
              <a class="card-header-icon">
                <b-icon :icon="props.open ? 'menu-down' : 'menu-up'" />
              </a>
            </div>
            <div class="card-content" v-if="loading.dcloud.vertical">
              <b-loading :is-full-page="false" :active="loading.dcloud.vertical" :can-cancel="false"></b-loading>
            </div>
            <div class="card-content" v-if="!loading.dcloud.vertical">
              <b-field label="Vertical ID">
                <b-input v-model="model.vertical"></b-input>
              </b-field>
              <b-field label="Voice Queue ID">
                <b-input v-model="model.queueId"></b-input>
              </b-field>
              <b-field label="Chat Template ID">
                <b-input v-model="model.templateId"
                :placeholder="defaults.chat.templateId"></b-input>
              </b-field>
              <b-field label="Org ID">
                <b-input v-model="model.orgId"
                :placeholder="defaults.chat.orgId"></b-input>
              </b-field>
              <b-field label="DC">
                <b-input v-model="model.DC"
                :placeholder="defaults.chat.DC"></b-input>
              </b-field>
              <b-field label="Cisco App ID">
                <b-input v-model="model.CiscoAppId"
                :placeholder="defaults.chat.CiscoAppId"></b-input>
              </b-field>
              <b-field label="App Prefix">
                <b-input v-model="model.appPrefix"
                :placeholder="defaults.appPrefix"></b-input>
              </b-field>
              <b-field label="Async">
                <b-switch v-model="model.async"></b-switch>
              </b-field>
              <!-- Save Button -->
              <b-field>
                <button type="button" class="button is-success"
                @click.prevent="clickSave" :disabled="disableSave">Save</button>
              </b-field>
              <!-- /Save Button -->
            </div>
          </b-collapse>
          <!-- /Advanced -->

        </article>
      </div>
    </div>

    <!-- user is provisioned - show agent info -->
    <div class="tile is-ancestor" v-if="!loading.user.provision && isProvisioned">
      <div class="tile is-parent">
        <article class="tile is-child box is-horizontal">
          <h1 class="title">Agents for V2 Call Flow Editor</h1>
          <div class="content">
            <div class="tile is-ancestor">
              <div class="tile">
                <div class="tile is-parent">
                  <article class="tile is-child box">

                    <p class="title">{{ supervisor.name }}</p>
                    <p class="subtitle">{{ supervisor.role }}</p>
                    <img :src="supervisor.picture" width="128px">
                    <p>
                      <strong>Username: {{ supervisor.username }}</strong>
                      <a @click="clickCopy(supervisor.username, 'Username')">
                        <b-icon icon="layers"></b-icon>
                      </a>
                    </p>
                    <p>
                      <strong>Password: {{ supervisor.password }}</strong>
                      <a @click="clickCopy(supervisor.password, 'Password')">
                        <b-icon icon="layers"></b-icon>
                      </a>
                    </p>
                    <p>
                      <strong>Extension: {{ supervisor.extension }}</strong>
                      <a @click="clickCopy(supervisor.extension, 'Extension')">
                        <b-icon icon="layers"></b-icon>
                      </a>
                    </p>
                    <center>
                      <b-field>
                        <button class="button is-success" @click="clickR10Portal">
                          Go to Webex Contact Center Portal
                        </button>
                      </b-field>
                    </center>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Agents from '../../components/agents.vue'

export default {
  components: {
    Agents
  },

  data () {
    return {
      showModal: false,
      model: {},
      ownerFilter: '',
      brandFilter: 'mine',
      chatReason: '',
      showMore: false,
      portalUrl: 'https://portal.ccone.net'
    }
  },

  methods: {
    ...mapActions([
      'saveDemoConfig',
      'loadVerticals',
      'loadUser',
      'loadReasons',
      'provisionUser',
      'inviteToSupportRoom'
    ]),
    clickR10Portal () {
       // open agent portal in new tab
      window.open(this.portalUrl, '_blank')
    },
    showSupportRoomDialog (event) {
      // show dialog
      this.$buefy.dialog.prompt({
        title: 'Join the Webex Teams support room',
        message: `What is your Webex Teams email address?`,
        type: 'is-success',
        confirmText: 'Join',
        inputAttrs: {
          placeholder: 'username@example.com',
          value: this.user.email
        },
        onConfirm: (email) => {
          this.inviteToSupportRoom({email})
        }
      })
    },
    clickProvision () {
      this.provisionUser()
    },
    async verticalChanged (e) {
      // user changed vertical selection
      // console.log('verticalChanged to ', e.target.value)
      console.log('verticalChanged to ', this.model.vertical)
      try {
        // update only the vertical on the server
        await this.saveDemoConfig({
          data: {
            vertical: this.model.vertical
          }
        })
        // refresh user data in state from server now
        await this.loadUser(false)
      } catch (e) {
        // failed to save data
        console.log('failed to save demo configuration ', e.message)
        this.$toast.open({
          message: 'Failed to save demo configuration.',
          type: 'is-danger'
        })
      }
    },
    async clickSave () {
      // admin clicked save button in advanced config form
      // save all data for admins who can see the advanced form
      // copy model to a local var
      const data = JSON.parse(JSON.stringify(this.model))
      // remove empty strings from the data, so that those values are not unset on server side
      for (const key of Object.keys(data)) {
        if (data[key] === '') {
          delete data[key]
        }
      }
      // save the data on the server
      await this.saveDemoConfig({data})
    },
    updateCache (data) {
      console.log('home.vue updateCache:', data)
      // copy state data to local data
      try {
        this.model = JSON.parse(JSON.stringify(data))
      } catch (e) {
        console.error('failed to updateCache on home.vue - incoming data was', data, e)
      }
    },
    clickGo (e) {
      console.log('clicked go button')
      window.open(this.brandDemoLink, 'brand')
    }
  },

  computed: {
    ...mapGetters([
      'loading',
      'working',
      'defaults',
      'user',
      'verticals',
      'demoConfig',
      'brandDemoLink',
      'cumulusDemoLink',
      'demoConfigId',
      'dcloudSession',
      'isProvisioned',
      'hasRequestedProvision',
      'provision',
      'isSwitchUser'
    ]),
    supervisor () {
      return {
        picture: 'https://mm.cxdemo.net/static/images/cumulus/common/author3.png',
        username: 'rbarrows' + this.user.id + '@dcloud.cisco.com',
        password: 'C1sco12345',
        extension: '1082' + this.user.id,
        name: 'Rick Barrows',
        role: 'Administrator / Agent'
      }
    },
    demoNumber () {
      try {
        switch (this.model.vertical) {
          case 'city':
          case 'city-no-bot':
            return this.dcloudSession.dids.DID5
          case 'healthcare':
          case 'healthcare-no-bot':
            return this.dcloudSession.dids.DID9
          case 'utility':
          case 'utility-no-bot':
            return this.dcloudSession.dids.DID10
          case 'finance':
          case 'finance-no-bot':
            return this.dcloudSession.dids.DID7
          case 'travel':
          case 'travel-no-bot':
            return this.dcloudSession.dids.DID8
          default: return this.dcloudSession.dids.DID7
        }
      } catch (e) {
        return ''
      }
    },
    disableSave () {
      return false
    },
    autocompleteOwners () {
      const allOwners = this.verticals.map(v => v.owner)
      const uniqueOwners = Array.from(new Set(allOwners))
      return uniqueOwners.filter((option) => {
        return option
        .toString()
        .toLowerCase()
        .indexOf(this.ownerFilter.toLowerCase()) >= 0
      })
    },
    sortedBrands () {
      // make a mutable copy of the store data
      try {
        const copy = JSON.parse(JSON.stringify(this.verticals))
        // case-insensitive sort by name
        copy.sort((a, b) => {
          var nameA = a.name.toUpperCase() // ignore upper and lowercase
          var nameB = b.name.toUpperCase() // ignore upper and lowercase
          if (nameA < nameB) {
            return -1
          }
          if (nameA > nameB) {
            return 1
          }
          // names must be equal
          return 0
        })
        return copy
      } catch (e) {
        console.log(`couldn't get sorted brands`, e)
      }
    },
    systemBrands () {
      return this.sortedBrands.filter(v => !v.owner || v.owner === 'system' || v.owner === null)
    },
    userBrands () {
      if (this.brandFilter === 'all') {
        return this.sortedBrands.filter(v => v.owner && v.owner !== 'system' && v.owner !== null)
      } else {
        return []
      }
    },
    myBrands () {
      if (this.brandFilter === 'mine') {
        return this.sortedBrands.filter(v => v.owner === this.user.username)
      } else {
        return []
      }
    },
    filteredSortedBrands () {
      if (this.brandFilter === 'other') {
        // filter to only show the brands owned by specified user
        return this.sortedBrands.filter(v => v.owner === this.ownerFilter)
      } else {
        return []
      }
    },
    vertical () {
      return this.model.vertical
    }
  },

  async mounted () {
    try {
      // load verticals list
      await this.loadVerticals(false)
    } catch (e) {
      console.error('failed to load verticals in home.vue mounted() :', e)
    }
    // update cache
    try {
      this.updateCache(this.user.demo[this.demoConfigId])
    } catch (e) {
      // just continue
    }
  },

  watch: {
    user (val, oldVal) {
      // user object changed
      // update our cached data
      this.updateCache(val.demo[this.demoConfigId])
    },
    vertical (val) {
      console.log('vertical changed to', val)
      const selectedVertical = this.sortedBrands.find(v => {
        return v.id === val
      })
      console.log('selectedVertical is', val)
      // is this selected vertical owned by someone else?
      if (
        selectedVertical &&
        selectedVertical.owner !== 'system' &&
        selectedVertical.owner !== this.user.username
      ) {
        // selected vertical owned by a user that is not this user
        this.brandFilter = 'other'
        this.ownerFilter = selectedVertical.owner
      }
    }
  }
}
</script>
