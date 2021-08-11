import { cleanArray } from './array'

/**
 * 获取url参数
 * @param {string} name
 */
export function getQuery(name, search) {
  search = search || window.location.search.substr(1) || window.location.hash.split('?')[1]
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`)
  const res = search.match(reg)
  if (res != null) {
    return unescape(res[2])
  }
  return null
}

/**
 * 获取所有url参数
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObj(url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 * 对象转url参数
 * @param {Object} json
 * @returns {Array}
 */
export function objToParam(json) {
  if (!json) return ''
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return ''
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
    })
  ).join('&')
}

/**
 * url参数序列化
 * @param {string} url
 * @returns {Object}
 */
export function paramToObj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
    '"}'
  )
}
