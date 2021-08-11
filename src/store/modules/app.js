const state = {
  aside: {
    opened: localStorage.getItem('asideStatus') ? !!+localStorage.getItem('asideStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop',
  size: localStorage.getItem('size') || 'mini'
}

const getters = {
  size: ({ size }) => size,
  device: ({ device }) => device,
  aside: ({ aside }) => aside
}

const mutations = {
  toggleAside: state => {
    state.aside.opened = !state.aside.opened
    state.aside.withoutAnimation = false
  },
  closeAside: (state, withoutAnimation) => {
    state.aside.opened = false
    state.aside.withoutAnimation = withoutAnimation
  },
  toggleDevice: (state, device) => {
    state.device = device
  },
  setSize: (state, size) => {
    state.size = size
  }
}

const actions = {
  toggleAside({ commit, state }) {
    localStorage.setItem('asideStatus', state.aside.opened ? 0 : 1)
    commit('toggleAside')
  },
  closeAside({ commit }, { withoutAnimation }) {
    localStorage.setItem('asideStatus', 0)
    commit('closeAside', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('toggleDevice', device)
  },
  setSize({ commit }, size) {
    localStorage.setItem('size', size)
    commit('setSize', size)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
