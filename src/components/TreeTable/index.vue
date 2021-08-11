<template>
  <el-table
    :data="formatData"
    row-key="id"
    v-bind="$attrs"
    @selection-change="handleSelectionChange"
  >
    <el-table-column
      type="selection"
      width="55px"
      align="center"
      v-if="visible"
      fixed
    />
    <el-table-column v-if="columns.length === 0" width="150" align="center">
      <template slot-scope="scope">
        {{ scope.$index }}
      </template>
    </el-table-column>
    <el-table-column
      v-for="column in columns"
      v-else
      :key="column.value"
      :label="column.text"
      :width="column.width"
      :min-width="column.minWidth"
      header-align="center"
      align="left"
    >
      <template slot-scope="scope">
        {{ scope.row[column.value] }}
      </template>
    </el-table-column>
    <slot />
  </el-table>
</template>

<script>
export default {
  name: 'TreeTable',
  props: {
    data: {
      type: [Array, Object],
      required: true
    },
    columns: {
      type: Array,
      default: () => []
    },
    evalFunc: Function,
    evalArgs: Array,
    expandAll: {
      type: Boolean,
      default: false
    },
    visible: { // 是否显示多选框
      type: Boolean,
      default: false
    }
  },
  computed: {
    formatData() { // 格式化数据源
      let tmp
      if (!Array.isArray(this.data)) {
        tmp = [this.data]
      } else {
        tmp = this.data
      }
      return tmp
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.$emit('selection-change', val)
    }
  }
}
</script>
