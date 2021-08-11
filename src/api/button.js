/**
 * 按钮权限模块
 */
import request from '@/utils/request'

export function readButton(id) { // 按钮详情接口
  return request({
    url: `/button/${id}`,
    method: 'get'
  })
}

export function readButtons(params) {
  return request({
    url: '/button',
    method: 'get',
    params
  })
}

export function createButton(data) { // 按钮创建接口
  return request({
    url: '/button',
    method: 'post',
    data
  })
}

export function updateButton(id, data) { // 按钮更新接口
  return request({
    url: `/button/${id}`,
    method: 'put',
    data
  })
}

export function delButton(id) { // 按钮删除接口
  return request({
    url: `/button/${id}`,
    method: 'delete'
  })
}
