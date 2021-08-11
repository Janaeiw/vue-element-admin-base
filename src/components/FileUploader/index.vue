<template>
  <el-upload
    ref="upload"
    :action="action"
    :headers="headers"
    name="file"
    :data="data"
    :show-file-list="false"
    :before-upload="beforeUpload"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :on-exceed="handleExceed"
    :on-success="handleSuccess"
    :on-error="handleError"
    :multiple="multiple"
    :limit="limit"
    :accept="accept"
    class="file-uploader"
  >
    <el-button size="small" type="primary" icon="el-icon-upload2" class="file-uploader__btn">
      <slot />
    </el-button>
    <div slot="tip" class="el-upload__tip">
      <slot name="tips"></slot>
    </div>
  </el-upload>
</template>

<script>
import { getToken } from '@/utils/auth'

export default {
  name: 'FileUploader',
  props: {
    action: {
      type: String,
      default: ''
    },
    limit: {
      type: Number,
      default: 1
    },
    multiple: {
      type: Boolean,
      default: false
    },
    tips: {
      type: String,
      default: ''
    },
    maxSize: {
      // kb
      type: Number,
      default: 1024
    },
    fileType: {
      type: String,
      default: 'excel'
    },
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      headers: {
        'access-token': getToken()
      },
      fileList: []
    }
  },
  computed: {
    accept() {
      if (this.fileType === 'excel') {
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
      }
      return ''
    }
  },
  methods: {
    beforeUpload(file) {
      if (!this.accept.includes(file.type)) {
        this.$message.warning('请选择 excel 类型文件上传')
        return false
      }
      if (file.size > this.maxSize * 1024) {
        this.$message.warning(
          `文件大小不能超过 ${Math.floor(this.maxSize / 1024)}MB`
        )
        return false
      }
    },
    handlePreview() {},
    handleRemove() {},
    handleExceed() {},
    handleSuccess() {
      this.$refs.upload.clearFiles()
      this.$emit('success')
    },
    handleError(err) {
      this.$emit('error', err.toString())
    }
  }
}
</script>

<style lang="scss" scoped>
.file-uploader {
  .file-uploader__btn {
    min-width: 124px;
    height: 32px;
  }
  /deep/ {
    .el-upload__tip {
      line-height: 21px;
      font-size: 12px;
      color: #999;
    }
  }
}
</style>
