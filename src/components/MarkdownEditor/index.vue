<template>
  <vue-editor
    ref="markdownEditor"
    :editorToolbar="customToolbar"
    :customModules="customModulesForEditor"
    :editorOptions="editorSettings"
    useCustomImageHandler
    @image-added="handleImageAdded"
    v-model="editorContent"
  >
  </vue-editor>
</template>

<script>
import { VueEditor } from 'vue2-editor'
// import { ImageDrop } from 'quill-image-drop-module'
import ImageResize from 'quill-image-resize-module'
import axios from 'axios'
import { getToken } from '@/utils/auth'

export default {
  name: 'MarkdownEditor',
  components: {
    VueEditor
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  watch: {
    value(val) {
      this.editorContent = val
    },
    editorContent(val) {
      // if (val === '<p><br></p>') {
      //   val = ''
      // }
      this.$emit('input', val)
      this.$emit('change', val)
    }
  },
  data() {
    return {
      customToolbar: [
        [{ header: [false, 1, 2, 3, 4, 5, 6] }],
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        [
          { align: '' },
          { align: 'center' },
          { align: 'right' },
          { align: 'justify' }
        ],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'],
        ['clean']
      ],
      customModulesForEditor: [
        // { alias: 'imageDrop', module: ImageDrop },
        { alias: 'imageResize', module: ImageResize }
      ],
      editorSettings: {
        modules: {
          // imageDrop: true,
          imageResize: {}
        }
      },
      editorContent: ''
    }
  },
  mounted() {
    const target = this.$refs.markdownEditor.$el.querySelector('.ql-editor')
    target.addEventListener('paste', (event) => {
      const items = event.clipboardData.items
      for (const item of items) {
        if (item.type.indexOf('image') === 0) {
          event.preventDefault()
          const blob = item.getAsFile()
          this.fetchUploadImage(blob).then((imagePathFull) => {
            const elem = document.createElement('div')
            elem.innerHTML = this.editorContent
            const imgElem = document.createElement('img')
            imgElem.src = imagePathFull
            if (elem.children && elem.children.length > 0 && elem.children[0].tagName.toLowerCase() === 'p') {
              elem.children[0].appendChild(imgElem)
            } else {
              const pElem = document.createElement('p')
              pElem.appendChild(imgElem)
              elem.appendChild(pElem)
            }
            this.editorContent = elem.innerHTML
            this.$nextTick(() => {
              this.$refs.markdownEditor.handleInitialContent()
            })
          })
        }
      }
    })
  },
  created() {
    this.editorContent = this.value
  },
  methods: {
    fetchUploadImage(file) {
      return new Promise((resolve, reject) => {
        const formData = new FormData()
        formData.append('image', file)
        document.getElementById('file-upload').value = '' // 暂时处理无法上传重复文件问题
        axios({
          url: '/api/user-ico',
          method: 'POST',
          headers: {
            'access-token': getToken()
          },
          data: formData
        }).then((res) => {
          if (res.data.status === 1) {
            resolve(res.data.data.image_path_full)
          } else {
            this.$message.error(res.data.msg)
          }
        }).catch((err) => {
          console.log(err)
        })
      })
    },
    handleImageAdded(file, Editor, cursorLocation) {
      this.fetchUploadImage(file).then((imagePathFull) => {
        Editor.insertEmbed(
          cursorLocation,
          'image',
          imagePathFull
        )
      })
    }
  }
}
</script>

<style lang="scss">
.ql-snow .ql-picker {
  line-height: normal;
}
.ql-toolbar.ql-snow {
  border: 1px solid #ccc;
  border-radius: $border-radius--base $border-radius--base 0 0;
}
.ql-container {
  border: 1px solid #ccc;
  border-radius: 0 0 $border-radius--base $border-radius--base;
}
</style>
