<template>
  <el-cascader
    v-loading="loading"
    :key="Math.random()"
    ref="cascader"
    element-loading-text=""
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 0.2)"
    element-loading-custom-class="el-custom-cascader-loading"
    v-model="checkedIdList"
    :options="treeList"
    :props="defaultProps"
    clearable
    filterable
    placeholder="请选择"
    :append-to-body="false"
    @change="handleChange"
  />
</template>

<script>
import { readAllDepartments } from '@/api/department'
import tree from '@/utils/tree'

export default {
  name: 'DepartmentCascader',
  props: {
    value: {
      type: [Number, String],
      default: ''
    },
    defaultList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: false,
      defaultProps: {
        label: 'name',
        value: 'id',
        checkStrictly: true,
        expandTrigger: 'hover'
      },
      list: [],
      checkedIdList: []
    }
  },
  computed: {
    treeList() {
      return this.defaultList.concat(tree.toTree(this.list))
    }
  },
  watch: {
    value(departmentId) {
      this.setDepartmentId(departmentId)
    }
  },
  created() {
    this.fetchList()
  },
  methods: {
    fetchList() {
      this.loading = true
      readAllDepartments({
        pid: -1
      }).then(res => {
        this.loading = false
        this.list = res.data || []
        this.setDepartmentId(this.value)
      }).catch(err => {
        console.log(err)
        this.loading = false
      })
    },
    handleChange(value) {
      if (value.length > 0) {
        this.$emit('input', value[value.length - 1])
      } else {
        this.$emit('input', '')
      }
    },
    setDepartmentId(id) {
      if (id && this.list.length > 0) {
        this.checkedIdList = tree.getParentsIdListById(this.list, id)
          .filter(item => item !== 0)
          .reverse()
          .concat(id)
      } else {
        if (id === 0) {
          this.checkedIdList = [id]
        } else {
          this.checkedIdList = []
        }
      }
    }
  }
}
</script>
