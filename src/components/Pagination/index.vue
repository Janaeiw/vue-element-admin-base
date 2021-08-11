<template>
  <div
    v-show="total > 0"
    v-loading="loading"
    element-loading-spinner=" "
    class="pagination-container"
    :style="style"
  >
    <el-pagination
      :current-page="page"
      :pager-count="pagerCount"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="psize"
      :total="total"
      :background="false"
      :layout="layout"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
    />
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    total: {
      type: Number,
      default: 0
    },
    page: {
      type: Number,
      default: 0
    },
    psize: {
      type: Number,
      default: 20
    },
    align: {
      type: String,
      default: 'center'
    },
    layout: {
      type: String,
      default: 'jumper, prev, pager, next, total, sizes'
    },
    pagerCount: {
      type: Number,
      default: 7
    }
  },
  computed: {
    style() {
      return {
        'text-align': this.align
      }
    }
  },
  methods: {
    onSizeChange(size) {
      this.$emit('size-change', size)
    },
    onCurrentChange(page) {
      this.$emit('current-change', page)
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination-container {
  margin-top: 20px;
  line-height: 21px;
  /deep/ {
    .el-pagination {
      font-weight: normal;
      .btn-prev,
      .btn-next {
        margin-left: 10px;
        margin-right: 10px;
        padding-left: 0;
        padding-right: 0;
        border: 1px solid #ccc;
        border-radius: 4px;
        width: 22px;
      }
      span:not([class*=suffix]),
      button {
        min-width: 22px;
        height: 22px;
        line-height: 22px;
      }
    }
    .el-input--mini .el-input__inner {
      height: 22px;
    }
    .el-pagination__editor {
      margin-left: 5px;
      margin-right: 5px;
      height: 22px;
      &.el-input {
        width: 40px;
        .el-input__inner {
          height: 22px;
        }
      }
    }
    .el-pagination__total {
      margin-left: 10px;
    }
    .el-pager {
      li {
        min-width: 22px;
        line-height: 22px;
        height: 22px;
        border: 1px solid #ccc;
        border-radius: $border-radius--pagination;
        &.active {
          border: 1px solid $color--primary;
        }
      }
      li+li {
        margin-left: 9px;
      }
    }
  }
}
</style>
