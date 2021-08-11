import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import permissions from './permissions'

import Element from './element-ui'
import SingleMessage from '@/utils/singleMessage'

import Monitor from 'indra-monitor'

import 'normalize.css/normalize.css'
import '@/styles/index.scss'

import './icons'

import * as filters from './filters'

import auth from '@/directives/auth'
Vue.use(auth)

Vue.use(Element, {
  zIndex: 4000
})

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.prototype.$message = new SingleMessage()

Vue.config.productionTip = false

// 前端报错监控
if (process.env.NODE_ENV !== 'development' && process.env.VUE_APP_ERROR_API) {
  Monitor.init({
    appid: 'AdminBase', // 项目id
    env: process.env.VUE_APP_ENV, // 环境变量
    reportUrl: process.env.VUE_APP_ERROR_API, // 上报接口地址
    instance: {
      vue: Vue,
      resource: process.env.VUE_APP_ENV === 'production'
    }
  })
}

permissions({
  router,
  store,
  message: Vue.prototype.$message,
  confirm: Vue.prototype.$confirm
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
