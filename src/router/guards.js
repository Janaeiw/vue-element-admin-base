/*
 * @Author: Ten
 * @Date: 2021/06/21 07:29
 * @LastEditTime: 2021/07/03 17:01
 * @LastEditors: Ten
 * @Description: 路由守卫
 */
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import { getPageTitle } from '@/utils/index'

// 路由校验忽略列表
const loginIgnore = ['/login']

NProgress.configure({ showSpinner: false })

// 加载开始
const progressStart = (to, from, next) => {
  if (!NProgress.isStarted()) {
    NProgress.start()
  }
  next()
}

// 加载结束
const progressDone = () => {
  NProgress.done()
}

// 登录token守卫
const loginGuard = (to, from, next) => {
  const hasToken = !!getToken()
  if (loginIgnore.includes(to.path) || hasToken) {
    next()
  } else {
    next({
      path: '/login',
      query: {
        redirect: to.path
      }
    })
  }
}

// 用户权限信息守卫
const roleGuard = async (to, from, next, options) => {
  const { router, store } = options
  const hasRole = store.getters['user/role']
  if (loginIgnore.includes(to.path) || hasRole) {
    document.title = getPageTitle(to.meta.title)
    next()
  } else {
    try {
      const { access } = await store.dispatch('user/getUser')
      const accessRoutes = await store.dispatch('permissions/generateRoutes', access)
      accessRoutes.forEach(route => {
        router.addRoute(route)
      })
      next({ ...to, replace: true })
    } catch (err) {
      console.log(err)
      await store.dispatch('user/resetToken')
      next({
        path: '/login',
        query: {
          redirect: to.path
        }
      })
    }
  }
}

export const beforeEach = [progressStart, loginGuard, roleGuard]
export const afterEach = [progressDone]
