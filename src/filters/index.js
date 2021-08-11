import dayjs from 'dayjs'

export function filterFormatDateOfTable(value) {
  if (value) {
    return dayjs(value).format('YYYY-MM-DD HH:mm')
  }
  return '/'
}

export function filterFormatDate(value) {
  return dayjs(value).format('YYYY-MM-DD')
}

export function filterForamtSerialNumber(index, page, psize = 20) {
  index = ((page - 1) * psize + index + 1)
  return index < 10 ? `0${index}` : index
}

export function filterFormatTimeOfTable(second) {
  return second ? `${Math.floor(second / 60)}分${second % 60}秒` : ''
}

export function filterButtonMapTitle(key) {
  const map = {
    create: '新增',
    delete: '删除',
    // search: '查找',
    edit: '编辑',
    export: '导出',
    import: '导入',
    order: '排序',
    'change-status': '状态修改',
    transfer: '转移',
    'sort-up': '排序上移',
    'sort-down': '排序下移'
  }
  return map[key]
}

export function filterURLTypeTitle(type) {
  const map = {
    1: '新增',
    2: '编辑',
    3: '删除',
    4: '导出',
    5: '导入',
    6: '排序',
    7: '状态修改',
    8: '转移',
    9: '排序上移；',
    10: '排序下移',
    11: '查看'
  }
  return map[type]
}
