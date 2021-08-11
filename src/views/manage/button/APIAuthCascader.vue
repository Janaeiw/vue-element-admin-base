<template>
  <el-cascader
    v-loading="loading"
    element-loading-text=""
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 0.2)"
    element-loading-custom-class="el-custom-cascader-loading"
    :props="defaultProps"
    :options="options"
    :show-all-levels="false"
    filterable
    :append-to-body="false"
    clearable
    v-model="checkedIds"
    @change="onChange"
  />
</template>

<script>
import { readAllMenusButton } from '@/api/menu'
import tree from '@/utils/tree'
// import _ from 'lodash'

export default {
  name: 'APIAuthCascader',
  props: {
    value: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      defaultProps: {
        label: 'title',
        value: 'id'
      },
      checkedIds: '',
      options: [],
      flattenOptions: []
    }
  },
  watch: {
    value(val) {
      this.checkedIds = this.getCheckedIds(this.options, val)
    }
  },
  created() {
    this.fetchList()
  },
  methods: {
    fetchList() {
      this.loading = true
      return readAllMenusButton().then((res) => {
        this.options = this.formatOptions(res.data || [])
        this.flattenOptions = tree.flatten(this.options)
        this.checkedIds = this.getCheckedIds(this.options, this.value)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    formatOptions(options) {
      function loop(options) {
        options.forEach((option) => {
          if (option.children && option.children.length > 0) {
            loop(option.children)
          }
          if (option.api_url && option.api_url.length > 0) {
            option.children = option.api_url.map(item => {
              item.title = item.name
              item.pid = option.id
              return item
            })
          }
        })
      }
      loop(options)
      return options
    },
    onChange() {
      let checkedId = ''
      if (this.checkedIds.length > 0) {
        checkedId = this.checkedIds[this.checkedIds.length - 1]
      }
      this.$emit('input', checkedId)
      this.$emit('change', checkedId)
    },
    getCheckedIds(options, id) {
      if (id === '' || id === -1 || options.length === 0) {
        return []
      }
      return tree.getParentsIdListById(this.flattenOptions, id)
        .filter(item => item !== 0)
        .reverse()
        .concat(id)
    }
  }
}
</script>
