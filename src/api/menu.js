/**
 * 菜单模块
 */
import request from '@/utils/request'

export function createMenu(data) { // 菜单创建接口
  return request({
    url: '/menu',
    method: 'post',
    data
  })
}

export function readMenu(id) { // 菜单详情接口
  return request({
    url: `/menu/${id}`,
    method: 'get'
  })
}

export function readMenus(params) { // 菜单列表接口（分页）
  return request({
    url: '/menu',
    method: 'get',
    params
  })
}

export function readAllMenus(params) { // 所有菜单列表（不分页）
  return request({
    url: '/menus',
    method: 'get',
    params
  })
}

export function readAllMenusButton(params) { // 菜单下按钮结构树接口
  return request({
    url: '/menus-button',
    method: 'get',
    params
  })
}

export function updateMenu(id, data) { // 菜单更新接口
  return request({
    url: `/menu/${id}`,
    method: 'put',
    data
  })
}

export function modifyMenuStatus(id, data) { // 菜单状态更新接口
  return request({
    url: `/menu-status/${id}`,
    method: 'put',
    data
  })
}

export function delMenu(id) { // 菜单删除接口
  return request({
    url: `/menu/${id}`,
    method: 'delete'
  })
}

export function delMenus(ids) { // 菜单批量删除接口
  return request({
    url: '/menu',
    method: 'delete',
    data: {
      ids
    }
  })
}
