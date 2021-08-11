/**
 * 用户模块
 */
import request from '@/utils/request'

export function readUser(id) { // 用户详情接口
  return request({
    url: `/user/${id}`,
    method: 'get'
  })
}

export function readUsers(params) { // 用户列表接口（分页）
  return request({
    url: '/user',
    method: 'get',
    params
  })
}

export function createUser(data) { // 用户创建接口
  return request({
    url: '/user',
    method: 'post',
    data
  })
}

export function updateUser(id, data) { // 用户更新接口（管理员更新用户信息）
  return request({
    url: `/user/${id}`,
    method: 'put',
    data
  })
}

export function updateUserSelf(id, data) { // 用户更新接口（用户自己更新信息）
  return request({
    url: `/user-self/${id}`,
    method: 'put',
    data
  })
}

export function modifyUserStatus(id, data) { // 用户状态更新接口
  return request({
    url: `/user-status/${id}`,
    method: 'put',
    data
  })
}

export function delUser(id) { // 用户删除接口
  return request({
    url: `/user/${id}`,
    method: 'delete'
  })
}

export function delUsers(ids) { // 用户批量删除接口
  return request({
    url: '/user',
    method: 'delete',
    data: {
      ids
    }
  })
}

export function exportUsers(data) { // 用户/客服导出接口
  return request({
    url: '/user-export',
    method: 'post',
    data,
    responseType: 'blob'
  })
}
