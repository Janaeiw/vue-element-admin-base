import _ from 'lodash'
import { constantRoutes } from '@/router'
import { trimAll } from '@/utils/string'

const state = {
  routes: [],
  asyncRoutes: []
}

const getters = {
  routes: ({ routes }) => routes
}

const mutations = {
  setRoutes: (state, routes) => {
    state.asyncRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  updateRoutes: (state, routes) => {
    state.routes = routes
  }
}

const actions = {
  setDotByName({ commit, state }, { name = '', isDot = false }) {
    if (name === '') {
      return
    }
    const routes = _.cloneDeep(state.routes)
    for (const item of routes) {
      if (item.children) {
        for (const child of item.children) {
          if (child.name === name) {
            child.meta.isDot = isDot
            break
          }
        }
      }
      if (item.name === name) {
        item.meta.isDot = isDot
        break
      }
    }
    commit('updateRoutes', routes)
  },
  generateRoutes({ commit }, data) {
    return new Promise(resolve => {
      data.push({
        path: '/personal-info',
        component: 'layout,personal-info/index',
        name: 'PersonalInfo',
        hidden: false,
        alwaysShow: false,
        meta: {
          title: '个人信息',
          icon: 'idcard',
          noCache: false
        }
      })
      const accessedRouters = data.map((item) => {
        const components = trimAll(item.component).split(',')
        if (components.length > 1) { // 一级页面
          item.children = [
            {
              path: item.path,
              component: components[1],
              name: item.name,
              meta: { ...item.meta }
            }
          ]
        }
        item.component = (resolve) => require(['@/layout'], resolve)
        if (item.children) {
          const showingChildren = item.children.filter((item) => {
            return !item.hidden
          })
          item.meta.breadcrumb = showingChildren.length > 1 // 只有一个子菜单不显示在面包屑
          item.children.map((child) => {
            const childComponent = child.component
            child.component = (resolve) => require([`@/views/${childComponent}`], resolve)
          })
        }
        return item
      })
      const includeHome = accessedRouters.some(item => item.path === '/')
      if (accessedRouters.length > 0 && !includeHome) { // 没有设置首页，重定向到第一个菜单
        const firstRoute = accessedRouters.find(item => item.name)
        const redirectName = firstRoute.children && firstRoute.children.length > 0
          ? firstRoute.children.find(item => item.name).name : firstRoute.name
        accessedRouters.push({
          path: '/',
          redirect: {
            name: redirectName
          }
        })
      }
      if (accessedRouters.length === 0) { // 没有任何页面权限
        accessedRouters.push({ path: '*', redirect: '/401', hidden: true })
      } else {
        accessedRouters.push({ path: '*', redirect: '/', hidden: true })
      }
      commit('setRoutes', accessedRouters)
      resolve(accessedRouters)
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
