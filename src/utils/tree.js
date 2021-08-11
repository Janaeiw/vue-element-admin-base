import _ from 'lodash'

/**
 * 递归格式化成多维数组
 * @param {*} array 一维数组
 * @param {*} root 根id
 * @param {*} pk 当前id标识
 * @param {*} pid 父级id标识
 * @param {*} child 层级属性名称
 * @param {*} other 其他附加属性
 * @returns 多维数组
 */
export function toTree(array, root = 0, pk = 'id', pid = 'pid', child = 'children', other = null) {
  const tree = []
  if (array) {
    array.forEach(item => {
      if (item[pid] === root) {
        if (other !== null) {
          item = Object.assign({}, item, other)
        }
        const children = toTree(array, item[pk], pk, pid, child, other)
        if (children.length) {
          item[child] = children
        }
        tree.push(item)
      }
    })
  }
  return tree
}

/**
 * 扁平化对象数组
 * @param {*} array 多维数组
 * @param {*} property 层级属性名称
 * @returns 一维数组
 */
export function flatten(array = [], property = 'children') {
  if (array.length === 0) {
    return []
  }
  const flattenArray = []
  function loop(array) {
    array.forEach(item => {
      flattenArray.push(item)
      if (item[property] && item[property].length > 0) {
        loop(item[property])
      }
    })
  }
  loop(array)
  return flattenArray
}

/**
 * 获取指定id的元素
 * @param {*} id 元素id
 * @param {*} array 数组
 * @param {*} property 层级属性名称
 * @returns 指定id的元素的属性
 */
export function getObjectById(id, array, property = 'children') {
  if (array.length === 0) {
    return {}
  }
  let object = {}
  function loop(array) {
    array.forEach(item => {
      if (item.id === id) {
        object = item
      }
      if (item[property] && item[property].length > 0) {
        return loop(item[property])
      }
    })
    return object
  }
  return loop(array)
}

/**
 * 获取所有父级id
 * @param {*} array 数组
 * @returns 所有父级id的数组
 */
export function getParentsIdList(array = []) {
  if (array.length === 0) {
    return []
  }
  const parentsIdList = []
  function loop(array) {
    array.forEach(item => {
      if (item.children && item.children.length > 0) {
        parentsIdList.push(item.id)
        return loop(item.children)
      }
    })
    return parentsIdList
  }
  return loop(array)
}

export function getParentsIdListById(array = [], id) { // 获取指定id的所有父级id
  if (array.length === 0) {
    return []
  }
  const parentsIdList = []
  function loop(array, id) {
    if (id === 0) {
      return parentsIdList
    }
    for (const item of array) {
      if (
        item.id === id &&
        (
          (parentsIdList.length === 0 && !item.children) ||
          (parentsIdList.length > 0 && item.children && item.children.length > 0)
        )
      ) {
        parentsIdList.push(item.pid)
        break
      }
    }
    if (parentsIdList.length > 0) {
      return loop(array, parentsIdList[parentsIdList.length - 1])
    } else {
      return []
    }
  }
  return loop(array, id)
}

export function getLowerIdList(array = [], property = 'children') { // 获取最低级id
  if (array.length === 0) {
    return []
  }
  const lowerIdList = []
  function loop(array) {
    array.forEach(item => {
      if (!item[property] || item[property].length === 0) {
        lowerIdList.push(item.id)
        return loop(item[property])
      }
    })
    return lowerIdList
  }
  return loop(array)
}

export function getLowerChildrens(array, id) { // 查找最底级的元素
  return _.flatMapDeep(array, ({ children, ...rest }) => [rest, children])
    .filter(item => item.button.length > 0 && (item.pid === id || item.id === id))
}

export default {
  toTree,
  flatten,
  getObjectById,
  getParentsIdList,
  getParentsIdListById,
  getLowerIdList,
  getLowerChildrens
}
