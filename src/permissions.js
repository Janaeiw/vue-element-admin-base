import { beforeEach, afterEach } from '@/router/guards'
import { isFunction } from '@/utils/validate'

function permissions ({ router, store, message, confirm }) {
  // 路由前置守卫
  beforeEach.forEach(guard => {
    if (isFunction(guard)) {
      router.beforeEach((to, from, next) => guard(to, from, next, {
        router,
        store,
        message,
        confirm
      }))
    }
  })

  // 路由后置守卫
  afterEach.forEach(guard => {
    if (isFunction(guard)) {
      router.afterEach((to, from) => guard(to, from))
    }
  })
}

export default permissions
