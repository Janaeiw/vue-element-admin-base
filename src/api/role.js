import request from '@/utils/request'

export function createRole(data) { // 角色创建接口
  return request({
    url: '/group',
    method: 'post',
    data
  })
}

export function readRole(id) { // 角色详情接口
  return request({
    url: `/group/${id}`,
    method: 'get'
  })
}

export function readRoles(params) { // 角色列表接口（分页）
  return request({
    url: '/group',
    method: 'get',
    params
  })
}

export function readAllRoles(params) { // 角色列表接口（不分页）
  return request({
    url: '/groups',
    method: 'get',
    params
  })
}

export function updateRole(id, data) { // 角色更新接口
  return request({
    url: `/group/${id}`,
    method: 'put',
    data
  })
}

export function modifyRoleStatus(id, data) { // 角色状态更新接口
  return request({
    url: `/group-status/${id}`,
    method: 'put',
    data
  })
}

export function delRole(id) { // 角色删除接口
  return request({
    url: `/group/${id}`,
    method: 'delete'
  })
}
