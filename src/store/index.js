import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'
import enhance from './modules/enhance'
import online from './modules/online'
import permission from './modules/permission'
import im from './modules/im'
import netdisk from './modules/netdisk'
import tw from './modules/tw'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    user,
    permission,
    enhance,
    online,
    im,
    netdisk,
    tw,
  },
  state: {

  },
  mutations: {

  },
  actions: {

  },
  getters
})
