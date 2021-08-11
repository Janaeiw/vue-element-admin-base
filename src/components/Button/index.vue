<script>
const map = {
  create: {
    type: 'success',
    icon: 'el-icon-plus',
    text: ''
  },
  search: {
    type: 'primary',
    icon: 'el-icon-search',
    text: '查询'
  },
  refresh: {
    type: 'warning',
    icon: 'el-icon-refresh',
    text: '重置'
  },
  import: {
    type: 'success',
    icon: 'el-icon-upload2',
    text: '导入'
  },
  export: {
    type: 'success',
    icon: 'el-icon-download',
    text: '导出'
  },
  delete: {
    type: 'warning',
    icon: 'el-icon-delete',
    text: '删除'
  },
  transfer: {
    type: 'warning',
    // icon: 'el-icon-delete',
    text: '转移'
  }
}

export default {
  name: 'Button',
  functional: true,
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  render(createElement, context) {
    const { type } = context.props
    let attrsType = ''
    let attrsIcon = ''
    let text = ''
    if (map[type]) {
      attrsType = map[type].type
      attrsIcon = map[type].icon
      text = map[type].text
    }
    return createElement('el-button', {
      ...context.data,
      attrs: {
        type: attrsType,
        icon: type === 'create' ? attrsIcon : ''
      }
      // directives: context.data.directives,
      // on: context.listeners
    }, context.children || text)
  }
}
</script>
