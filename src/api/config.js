/**
 * 配置模块
 */
import request from '@/utils/request'

export function createConfig(data) { // 配置创建接口
  return request({
    url: '/config',
    method: 'post',
    data
  })
}

export function readConfig(id) { // 配置详情接口
  return request({
    url: `/config/${id}`,
    method: 'get'
  })
}

export function readConfigsTree(params) { // 配置列表接口（树结构）
  return request({
    url: '/config-tree',
    method: 'get',
    params
  })
}

export function updateConfig(id, data) { // 配置更新接口
  return request({
    url: `/config/${id}`,
    method: 'put',
    data
  })
}

export function updateConfigs(data) { // 批量更新配置
  return request({
    url: '/config',
    method: 'put',
    data
  })
}

export function delConfig(id) { // 配置删除接口
  return request({
    url: `/config/${id}`,
    method: 'delete'
  })
}

export function delConfigs(ids) { // 配置批量删除接口
  return request({
    url: '/config',
    method: 'delete',
    data: {
      ids
    }
  })
}

export function updateConfigByKey(key, value) { // 根据KEY更新VALUE接口
  return request({
    url: '/config-key-value',
    method: 'put',
    data: {
      key,
      value
    }
  })
}

export function readConfigByKey(key) { // 根据KEY获取VALUE接口
  return request({
    url: '/config-key-value',
    method: 'get',
    params: {
      key: key
    }
  })
}

export function readAllConfigGroups(params) { // 配置组列表接口（不分页）
  return request({
    url: '/config-group-list',
    method: 'get',
    params
  })
}

export function readConfigGroups(params) { // 配置组列表接口（分页）
  return request({
    url: '/config-group',
    method: 'get',
    params
  })
}

export function modifyConfigGroupStatus(id, data) { // 配置组状态修改接口
  return request({
    url: `/config-group-status/${id}`,
    method: 'put',
    data
  })
}
