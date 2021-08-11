<template>
  <ElImageViewer
    v-show="visible"
    class="image-viewer"
    :url-list="urlList"
    :on-close="onClose"
  />
</template>

<script>
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'

export default {
  name: 'ImageViewer',
  components: {
    ElImageViewer
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    urlList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {}
  },
  methods: {
    onClose() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.image-viewer {
  /deep/ {
    .el-icon-circle-close {
      color: #fff;
    }
  }
}
</style>
