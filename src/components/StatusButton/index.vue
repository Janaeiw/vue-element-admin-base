<template>
  <span
    :class="[
      'pointer',
      {
        'el-icon-success text-success': status == 1,
        'el-icon-error text-danger': status == 0
      }
    ]"
    @click="handleClick"
  >
    {{ status | statusFilter }}
  </span>
</template>

<script>
export default {
  name: 'StatusButton',
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: '禁用',
        1: '正常'
      }
      return statusMap[status]
    }
  },
  props: {
    status: {
      type: Number,
      default: 0
    }
  },
  methods: {
    handleClick() {
      this.$emit('click')
    }
  }
}
</script>
