<template>
  <div class="el-upload-list el-upload-list--picture-card">
    <div class="el-upload-list__item is-ready">
      <div class="el-upload-list__item-thumbnail">
        <slot></slot>
      </div>
      <span class="el-upload-list__item-actions">
        <span class="el-upload-list__item-preview" @click="handlePreview(path)">
          <i class="el-icon-zoom-in"></i>
        </span>
        <span class="el-upload-list__item-delete" @click="handleDownload(path)">
          <i class="el-icon-download"></i>
        </span>
        <span class="el-upload-list__item-delete" @click="handleRemove(path)">
          <i class="el-icon-delete"></i>
        </span>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImageActions',
  data() {
    return {
      path: ''
    }
  },
  methods: {
    handlePreview() {},
    handleDownload() {},
    handleRemove() {}
  }
}
</script>
