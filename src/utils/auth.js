import { getEncrypt } from '@/utils/encrypt'
import { appSecret } from '@/settings.js'
const TokenKey = 'Admin-Token'

/**
 * 获取token
 */
export function getToken() {
  return localStorage.getItem(TokenKey)
}

/**
 * 设置token
 * @param {*} token
 */
export function setToken(token) {
  return localStorage.setItem(TokenKey, token)
}

/**
 * 删除token
 */
export function removeToken() {
  localStorage.removeItem(TokenKey)
}

/**
 * 数据签名
 * @param {*} obj
 */
export function getSignature(obj) {
  let encrypt = {}
  if (obj) {
    encrypt = obj
  }
  // 签名
  const signature = getEncrypt(encrypt, appSecret)
  encrypt.signature = signature
  return encrypt
}
