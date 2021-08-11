/**
 * 平台模块
 */
import request from '@/utils/request'

export function createPlatform(data) { // 平台创建接口
  return request({
    url: '/platform',
    method: 'post',
    data
  })
}

export function readPlatform(id) { // 平台详情接口
  return request({
    url: `/platform/${id}`,
    method: 'get'
  })
}

export function readPlatforms(params) { // 平台列表接口（分页）
  return request({
    url: '/platform',
    method: 'get',
    params
  })
}

export function readAllPlatforms(params) { // 平台列表接口（不分页）
  return request({
    url: '/platforms',
    method: 'get',
    params
  })
}

export function updatePlatform(id, data) { // 平台更新接口
  return request({
    url: `/platform/${id}`,
    method: 'put',
    data
  })
}

export function modifyPlatformSecret(id, data) { // 平台刷新secret接口
  return request({
    url: `/platform-secret/${id}`,
    method: 'put',
    data
  })
}

export function delPlatform(id) { // 平台删除接口
  return request({
    url: `/platform/${id}`,
    method: 'delete'
  })
}
