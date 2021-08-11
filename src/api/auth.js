/**
 * 登录模块
 */
import request from '@/utils/request'

export function login(data) { // 登录接口
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getUserInfo() { // 用户权限接口
  return request({
    url: '/user-info',
    method: 'get'
  })
}

export function getCaptcha() { // 图片验证码接口
  return request({
    url: '/captcha',
    method: 'get'
  })
}
