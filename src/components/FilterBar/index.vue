<template>
  <div class="filter-bar" :class="{ 'filter-bar--module': module }">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'FilterBar',
  props: {
    module: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-bar {
  margin-bottom: 30px;
  padding-top: 18px;
  padding-left: 20px;
  padding-right: 20px;
  border-radius: $border-radius--base;
  background-color: #F2F4F8;
  &.filter-bar--module {
    padding-top: 15px;
    border-bottom: 0;
    box-shadow: $box-shadow--base;
  }
  /deep/ {
    .el-form-item {
      margin-bottom: 18px;
    }
    .el-form--inline .el-form-item {
      margin-right: 20px;
    }
    .el-form-item__label {
      padding: 0;
      word-break: break-word;
    }
    .el-input__inner {
      border-color: $border-color--base;
      &:focus,
      &:hover {
        border-color: $color--primary;
      }
    }
    .el-select,
    .el-input {
      max-width: 200px;
    }
    .el-button {
      padding-left: 15px;
      padding-right: 15px;
      min-width: 60px!important;
      vertical-align: middle;
    }
  }
}
</style>
