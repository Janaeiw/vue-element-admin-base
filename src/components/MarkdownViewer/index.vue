<template>
  <div class="markdown-viewer" @click="handleClick">
    <div v-html="content"></div>
    <ImageViewer
      :visible.sync="imageViewer.visible"
      :url-list="[imageViewer.path]"
    />
  </div>
</template>

<script>
import ImageViewer from '@/components/ImageViewer/index.vue'
export default {
  name: 'MarkdownViewer',
  components: {
    ImageViewer
  },
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      imageViewer: {
        visible: false,
        path: ''
      }
    }
  },
  methods: {
    handleClick(e) {
      if (e.target.tagName.toLowerCase() === 'img' && e.target.src) {
        this.imageViewer.path = e.target.src
        this.imageViewer.visible = true
      }
    }
  }
}
</script>

<style lang="scss">
.markdown-viewer {
  * {
    word-break: break-word !important;
  }
  img {
    max-width: 100% !important;
    &:hover {
      cursor: pointer;
    }
  }
  p {
    margin: 0;
  }
}
</style>
