/**
 * 创建随机字符串
 * @param {长度} len
 * @param {特征字符集合} charSet
 */
export function randomString(len = 16, charSet) {
  charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let randomString = ''
  for (let i = 0; i < len; i++) {
    const randomPoz = Math.floor(Math.random() * charSet.length)
    randomString += charSet.substring(randomPoz, randomPoz + 1)
  }
  return randomString
}

/**
 * 过滤img标签
 * @param {string} value
 */
export function filterImgTags(value) {
  return value.replace(/<img.*?(?:>|\/>)/gi, '')
}

/**
 * 去除所有空格
 * @param {string} value
 */
export function trimAll(value) {
  return value.replace(/\s+/g, '')
}

export default {
  randomString,
  filterImgTags,
  trimAll
}
