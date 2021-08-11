import { login, getUserInfo } from '@/api/auth'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { defaultAvatar } from '@/settings'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  id: 0,
  name: '',
  avatar: '',
  status: '',
  realname: '',
  nickname: '',
  phone: '',
  email: '',
  role: 0,
  access: []
}

const getters = {
  id: (state) => state.id,
  name: (state) => state.name,
  nickname: (state) => state.nickname,
  realname: (state) => state.realname,
  avatar: (state) => state.avatar || defaultAvatar,
  phone: (state) => state.phone,
  role: ({ role }) => role,
  token: ({ token }) => token,
  access: ({ access }) => access
}

const mutations = {
  setToken: (state, token) => {
    state.token = token
  },
  setId: (state, id) => {
    state.id = id
  },
  setName: (state, name) => {
    state.name = name
  },
  setAvatar: (state, avatar) => {
    state.avatar = avatar
  },
  setRole: (state, role) => {
    state.role = role
  },
  setAccess: (state, access) => {
    state.access = access
  },
  setRealname: (state, realname) => {
    state.realname = realname
  },
  setNickname: (state, nickname) => {
    state.nickname = nickname
  },
  setEmail: (state, email) => {
    state.email = email
  },
  setPhone: (state, phone) => {
    state.phone = phone
  },
  setStatus: (state, status) => {
    state.status = status
  }
}

const actions = {
  login({ commit }, userInfo) { // 登录
    const { username, password, code_key: codeKey, code } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password, code_key: codeKey, code }).then(response => {
        const { data } = response
        commit('setToken', data.user_token)
        setToken(data.user_token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  getUser({ commit, state }) { // 获取用户信息
    return new Promise((resolve, reject) => {
      getUserInfo().then(response => {
        const data = response.data
        data.group_id = 1
        if (data.access && data.group_id > 0) {
          commit('setRole', data.group_id)
          commit('setAccess', data.access)
        } else {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject('拉取用户权限失败')
        }
        commit('setId', data.user_id)
        commit('setName', data.username)
        commit('setAvatar', data.image_path)
        commit('setRealname', data.real_name)
        commit('setNickname', data.nick_name)
        commit('setPhone', data.phone)
        commit('setEmail', data.email)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  logout({ commit, dispatch }) { // 退出
    return new Promise((resolve, reject) => {
      commit('setToken', '')
      commit('setRole', 0)
      removeToken()
      resetRouter()
      // reset visited views and cached views
      // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
      dispatch('tagsView/delAllViews', null, { root: true })
      resolve()
    })
  },
  resetToken({ commit }) { // 删除token
    return new Promise(resolve => {
      commit('setToken', '')
      commit('setRole', 0)
      removeToken()
      resolve()
    })
  },
  async changeRoles({ state, dispatch }) { // dynamically modify permissions
    const { access } = await dispatch('getUser', state.token)

    resetRouter()

    // generate accessible routes map
    const accessRoutes = await dispatch('permissions/generateRoutes', access, { root: true })

    // dynamically add accessible routes
    accessRoutes.forEach(route => {
      router.addRoute(route)
    })

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })

    return Promise.resolve()
  },
  setAvatar({ commit }, avatar) {
    commit('setAvatar', avatar)
  },
  setPhone({ commit }, phone) {
    commit('setPhone', phone)
  },
  setRealname({ commit }, realname) {
    commit('setRealname', realname)
  },
  setNickname({ commit }, realname) {
    commit('setNickname', realname)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
