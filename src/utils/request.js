import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import { appId } from '@/settings.js'

const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 50000
})

request.interceptors.request.use(
  config => {
    // appId
    config.headers['access-appid'] = appId
    // token
    if (store.getters['user/token'] && store.getters['user/token'] !== undefined) {
      config.headers['access-token'] = getToken()
    }
    return config
  },
  error => {
    console.error('request', error)
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  response => {
    if (response.data instanceof Blob) {
      return Promise.resolve(response)
    }
    const res = response.data
    if (res.status === 1) {
      return res
    } else {
      if (res.code === 11102 || res.code === 11103 || res.code === 11203) { // token 过期
        MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      } else {
        Message({
          message: res.msg || 'Error',
          type: 'error',
          showClose: false,
          duration: 3 * 1000
        })
      }

      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject({
        status: res.status,
        code: res.code,
        msg: res.msg
      })
    }
  },
  error => {
    console.log('err' + error)
    Message({
      message: error.message,
      type: 'error',
      showClose: true,
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)

export default request
