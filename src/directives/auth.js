// 后台和前端约定按钮类型
// 'create'=>'新增',
// 'delete'=>'删除',
// 'edit'=>'编辑',
// 'export'=>'导出',
// 'import'=>'导入',
// 'order'=>'排序',
// 'change-status'=>'状态修改',
// 'transfer'=>'转移',
// 'sort-up'=>'排序上移',
// 'sort-down'=>'排序下移',
import { on } from 'element-ui/src/utils/dom'
import { Message } from 'element-ui'

function isAuth(map, type) {
  return map.some(item => type === item.map.toLocaleLowerCase())
}

function offClick(vnode, el, binding) {
  if (binding.value === 'area') {
    el.style.position = 'relative'
    const mask = document.createElement('div')
    mask.style = 'position:absolute;top:0;left:0;width:100%;height:100%;z-index:100;cursor:not-allowed'
    on(mask, 'click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      Message.error('您没有权限进行该操作，请联系管理员')
    })
    el.appendChild(mask)
    return
  }
  if (!vnode.componentInstance) {
    return
  }
  if (vnode.data.nativeOn && vnode.data.nativeOn.click) {
    return
  }
  vnode.componentInstance.$off('click')
  on(el, 'click', (e) => {
    e.preventDefault()
    e.stopPropagation()
    Message.error('您没有权限进行该操作，请联系管理员')
  })
}

// 为空数组显示全部
// 有值显示相应的按钮
// -1 则没有权限（配置权限是全不选）
const auth = {
  inserted: function (el, binding, vnode) {
    const buttonAuth = (vnode.context.$route.meta && vnode.context.$route.meta.button) || []
    const maps = binding.arg.split(',')
    if (buttonAuth === -1) { // -1 则没有权限（配置权限是全不选）
      offClick(vnode, el, binding)
      return
    }
    if (buttonAuth.length === 0) { // 为空则都有权限
      return
    }
    maps.forEach(type => { // 有值显示相应的按钮
      if (buttonAuth && !isAuth(buttonAuth, type)) {
        offClick(vnode, el, binding)
      }
    })
  }
}

const install = function(Vue) {
  Vue.directive('auth', auth)
}

auth.install = install
export default auth
