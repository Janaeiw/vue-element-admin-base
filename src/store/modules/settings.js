import { showSettings, showSizeSelect, tagsView, fixedHeader, showLogo } from '@/settings'

const state = {
  theme: '',
  showSettings,
  showSizeSelect,
  tagsView,
  fixedHeader,
  showLogo
}

const mutations = {
  changeSetting: (state, { key, value }) => {
    if (Object.prototype.hasOwnProperty.call(state, key)) {
      state[key] = value
    }
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('changeSetting', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
