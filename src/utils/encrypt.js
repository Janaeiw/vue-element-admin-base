import crypto from 'crypto'
import qs from 'qs'

/**
 * 数据加密
 * @param {*} obj 加密对象
 * @param {*} signKey 加密盐值
 */
export function getEncrypt(obj, signKey) {
  const arr = []
  const keys = []
  for (const i in obj) {
    if (typeof obj[i] !== 'object' && i !== 'signature') {
      keys.push(i)
    }
  }
  keys.sort()
  for (const i in keys) {
    arr[keys[i]] = obj[keys[i]]
  }
  const arrStr = qs.stringify(arr)
  let arrSha = crypto.createHash('sha1').update(arrStr).digest('hex')
  arrSha = arrSha + signKey
  return crypto.createHash('md5').update(arrSha).digest('hex')
}
