/**
 * 接口url模块
 */
import request from '@/utils/request'

export function readAPIURL(id) { // 接口url详情接口
  return request({
    url: `/api-url/${id}`,
    method: 'get'
  })
}

export function readAPIURLs(params) { // 接口url列表（分页）
  return request({
    url: '/api-url',
    method: 'get',
    params
  })
}

export function createAPIURL(data) { // 接口url创建接口
  return request({
    url: '/api-url',
    method: 'post',
    data
  })
}

export function updateAPIURL(id, data) { // 接口url更新接口
  return request({
    url: `/api-url/${id}`,
    method: 'put',
    data
  })
}

export function delAPIURL(id) { // 接口url删除接口
  return request({
    url: `/api-url/${id}`,
    method: 'delete'
  })
}
