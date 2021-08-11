/** 字母，数字，下划线6-18位
 * @param {string} value
 * @returns {Boolean}
 */
export function validUsername(value) {
  const reg = /^[a-zA-Z_0-9]{6,18}$/
  return reg.test(value)
}

/** 必须大小写字母、数字中的两种，6-18位
 * @param {string} value
 * @returns {Boolean}
 */
export function validPassword(value) {
  const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[a-zA-Z0-9].{5,18}$/
  return reg.test(value)
}

/** 字母，数字，4位
 * @param {string} value
 * @returns {Boolean}
 */
export function validCaptcha(value) {
  const reg = /^[a-zA-Z_0-9]{4}$/
  return reg.test(value)
}

/**
 * http链接
 * @param {string} value
 * @returns {Boolean}
 */
export function validURL(value) {
  // const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  const reg = /(^#)|(^http(s*):\/\/[^\s]+\.[^\s]+)/
  return reg.test(value)
}

/**
 * ip
 * @param {string} value
 */
export function validIP(value) {
  const reg = /(^#)|(^http(s*)):\/\/((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/g
  return reg.test(value)
}

/**
 * 小写字母
 * @param {string} value
 * @returns {Boolean}
 */
export function validLowerAlphabets(value) {
  const reg = /^[a-z]+$/
  return reg.test(value)
}

/**
 * 大写字母
 * @param {string} value
 * @returns {Boolean}
 */
export function validUpperAlphabets(value) {
  const reg = /^[A-Z]+$/
  return reg.test(value)
}

/**
 * 大小写字母
 * @param {string} value
 * @returns {Boolean}
 */
export function validAlphabets(value) {
  const reg = /^[A-Za-z]+$/
  return reg.test(value)
}

/**
 * 邮箱
 * @param {string} value
 * @returns {Boolean}
 */
export function validEmail(value) {
  // eslint-disable-next-line no-useless-escape
  // const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  // eslint-disable-next-line no-useless-escape
  const reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
  return reg.test(value)
}

/**
 * 手机号码
 * @param value
 * @returns {boolean}
 */
export function validPhone(value) {
  const reg = /^1\d{10}$/
  return reg.test(value)
}

/**
 * 身份证号码
 * @param {string} value
 */
export function validIdentity(value) {
  const reg = /(^\d{15}$)|(^\d{17}(x|X|\d)$)/
  return reg.test(value)
}

/**
 * @param {string} value
 * @returns {Boolean}
 */
export function isExternal(value) {
  return /^(https?:|mailto:|tel:)/.test(value)
}

/**
 * @param {string} value
 * @returns {Boolean}
 */
export function isString(value) {
  if (typeof value === 'string' || value instanceof String) {
    return true
  }
  return false
}

/**
 * @param {Array} value
 * @returns {Boolean}
 */
export function isArray(value) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(value) === '[object Array]'
  }
  return Array.isArray(value)
}

/**
 * 是否函数
 * @param {function} fn
 * @return {boolean}
 * @Author: Ten
 * @Date: 2021/07/03 17:08
 */
export function isFunction(fn) {
  return typeof fn === 'function'
}
