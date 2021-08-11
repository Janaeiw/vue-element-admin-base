<template>
  <el-button
    :loading="loading"
    :type="type"
    @click="handleClick"
  >
    <slot />
  </el-button>
</template>

<script>
import request from '@/utils/request'
import download from '@/utils/download'

export default {
  name: 'FileDownload',
  props: {
    type: {
      type: String,
      default: 'success'
    },
    action: {
      type: String,
      default: ''
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
      loading: false
    }
  },
  methods: {
    handleClick() {
      this.loading = true
      request({
        url: this.action,
        method: 'post',
        data: this.data,
        responseType: 'blob'
      }).then((res) => {
        this.loading = false
        download(res)
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>
