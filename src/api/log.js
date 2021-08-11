/**
 * 日志模块
 */
import request from '@/utils/request'

export function readLogs(params) { // 日志列表接口（分页）
  return request({
    url: '/log',
    method: 'get',
    params
  })
}

export function exportLogs(data) { // 日志导出接口
  return request({
    url: '/log-export',
    method: 'post',
    data,
    responseType: 'blob'
  })
}
