/**
 * 部门模块
 */
import request from '@/utils/request'

export function createDepartment(data) { // 创建部门
  return request({
    url: '/department',
    method: 'post',
    data
  })
}

export function readDepartment(id) { // 部门详情接口
  return request({
    url: `/department/${id}`,
    method: 'get'
  })
}

export function readDepartments(params) { // 部门列表接口（分页）
  return request({
    url: '/department',
    method: 'get',
    params
  })
}

export function readAllDepartments(params) { // 所有部门列表（不分页）
  return request({
    url: '/departments/',
    method: 'get',
    params
  })
}

export function updateDepartment(id, data) { // 部门更新接口
  return request({
    url: `/department/${id}`,
    method: 'put',
    data
  })
}

export function delDepartment(id) { // 部门删除接口
  return request({
    url: `/department/${id}`,
    method: 'delete'
  })
}
