<template>
  <el-cascader
    v-loading="loading"
    element-loading-text=""
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 0.2)"
    element-loading-custom-class="el-custom-cascader-loading"
    :props="defaultProps"
    :options="formatMenus"
    expandTrigger="click"
    :show-all-levels="false"
    filterable
    :append-to-body="false"
    clearable
    v-model="checkedIds"
    @change="onChange"
  />
</template>

<script>
import { readAllMenus } from '@/api/menu'
import tree from '@/utils/tree'

export default {
  name: 'MenuCascader',
  props: {
    value: {
      type: [Number, String],
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
      checkedIds: [],
      menus: []
    }
  },
  computed: {
    formatMenus() {
      return tree.toTree(this.menus)
    }
  },
  watch: {
    value(val) {
      this.checkedIds = this.getCheckedIds(this.menus, val)
    }
  },
  created() {
    this.fetchList()
  },
  methods: {
    fetchList() {
      this.loading = true
      return readAllMenus().then((res) => {
        this.menus = res.data || []
        this.checkedIds = this.getCheckedIds(this.menus, this.value)
        this.loading = false
      }).catch(err => {
        console.log(err)
        this.loading = false
      })
    },
    onChange() {
      let checkedId = ''
      if (this.checkedIds.length > 0) {
        checkedId = this.checkedIds[this.checkedIds.length - 1]
      }
      this.$emit('input', checkedId)
      this.$emit('change', checkedId)
    },
    getCheckedIds(menus, id) {
      if (id === '' || id === -1 || menus.length === 0) {
        return []
      }
      const node = menus.find(item => {
        return item.id === id
      })
      if (node.pid === 0) {
        return [id]
      }
      return [node.pid, id]
    }
  }
}
</script>
