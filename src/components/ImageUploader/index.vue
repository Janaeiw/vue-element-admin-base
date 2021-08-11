<template>
  <div class="image-uploader">
    <div class="image-uploader__inner">
      <div
        v-show="currentUploadImgPath"
        class="image-uploader__close"
        title="点击删除"
        @click="handleDel"
      >
        <i class="el-icon-close"></i>
      </div>
      <el-upload
        ref="imageUploader"
        class="image-uploader__form"
        name="image"
        list-type="picture-card"
        :action="action"
        :headers="headers"
        :show-file-list="false"
        :limit="limit"
        :auto-upload="false"
        :before-upload="onBeforeUpload"
        :on-success="onSuccess"
        :on-error="onError"
        :on-change="onChange"
      >
        <img v-show="currentUploadImgPath" :src="currentUploadImgPath" />
        <div v-show="!currentUploadImgPath">
          <i class="el-icon-plus"></i>
          <div class="image-uploader__label">上传</div>
        </div>
      </el-upload>
      <div class="image-uploader__default">
        <el-image
          v-show="defaultImgPath"
          class="image-uploader__default-img"
          :src="defaultImgPath"
          fit="contain"
        />
        <div class="image-uploader__label">{{ label }}</div>
      </div>
    </div>
    <div class="image-uploader__tips">{{ tips }}</div>
  </div>
</template>

<script>
import Vue from 'vue'
import { api, defaultAvatar } from '@/settings'
import { getToken } from '@/utils/auth'
import { imageCompress } from '@/utils/image'
import { base64ToBlob } from '@/utils/file'

export default {
  name: 'ImageUploader',
  props: {
    limit: {
      type: Number,
      default: 0
    },
    imgPath: {
      type: String,
      default: ''
    },
    defaultImgPath: {
      type: String,
      default: defaultAvatar
    },
    action: {
      type: String,
      default: api.userIco
    },
    label: {
      type: String,
      default: '默认头像'
    },
    tips: {
      type: String,
      default: '请上传头像，若不设置则使用系统默认头像'
    },
    full: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      bus: null,
      uploadImgPath: '',
      headers: {
        'access-token': getToken()
      }
    }
  },
  watch: {
    imgPath() {
      this.init()
    }
  },
  computed: {
    currentUploadImgPath() {
      return this.uploadImgPath
    }
  },
  created() {
    this.bus = new Vue()
    this.init()
  },
  methods: {
    init() {
      if (this.imgPath !== this.defaultImgPath) {
        this.uploadImgPath = this.imgPath
      }
    },
    upload() {
      this.headers['access-token'] = getToken()
      this.$refs.imageUploader.submit()
      return new Promise((resolve, reject) => {
        if (!this.uploadImgPath.includes('blob')) {
          resolve(this.uploadImgPath || `${this.defaultImgPath}`)
        } else {
          this.bus.$on('success', (path) => {
            resolve(path)
          })
          this.bus.$on('error', (err) => {
            this.$message.error(err.msg)
            reject(err)
          })
        }
      })
    },
    handleDel() {
      this.uploadImgPath = ''
      this.$refs.imageUploader.clearFiles()
    },
    onSuccess(res, file) {
      if (res.data.image_path !== this.defaultImgPath) {
        this.uploadImgPath = this.full
          ? res.data.image_path_full
          : res.data.image_path
      }
      this.bus.$emit('success', this.uploadImgPath)
    },
    onError(err) {
      this.bus.$emit('error', {
        msg: err.toString()
      })
    },
    onBeforeUpload(file) {
      return new Promise((resolve, reject) => {
        imageCompress({
          image: file,
          type: 'png'
        }).then((res) => {
          resolve(base64ToBlob(res.image))
        })
      })
    },
    onChange(file) {
      if (!file.raw.type.includes('image/')) {
        this.$message.warning('上传头像图片只能是 JPG/JPEG/PNG/GIF 格式!')
        this.$refs.imageUploader.clearFiles()
        return false
      } else if (!(file.raw.size / 1024 / 1024 < 2)) {
        this.$message.warning('上传头像图片大小不能超过 2MB!')
        this.$refs.imageUploader.clearFiles()
        return false
      }
      this.uploadImgPath = file.url
    },
    handleRemove() {
      this.uploadImgPath = ''
      this.bus.$emit('success', '')
    }
  }
}
</script>

<style lang="scss" scoped>
.image-uploader {
  /deep/ {
    .el-upload {
      position: relative;
      width: 100%;
      height: 100%;
      line-height: 100px;
      overflow: hidden;
      img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        bottom: 0;
        right: 0;
        margin: auto;
        object-fit: cover;
      }
    }
    .el-upload--picture-card {
      width: 100px;
      height: 100px;
      line-height: 100px;
      background-color: #fff;
      border-color: #ccc;
      &:hover {
        border-color: $color--primary;
      }
      img {
        width: 100%;
      }
    }
  }
  .image-uploader__inner {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  .image-uploader__close {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 80px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, .7);
    border-radius: 0 4px 0 12px;
    text-align: center;
    font-weight: bold;
    color: #fff;
    z-index: 1;
    &:hover {
      cursor: pointer;
    }
  }

  .image-uploader__form,
  .image-uploader__default {
    display: inline-block;
    margin-bottom: 10px;
  }
  .image-uploader__form {
    margin-right: 15px;
  }
  .image-uploader__label {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 10px;
    margin: auto;
    line-height: normal;
    font-size: 12px;
    color: #999;
    z-index: 0;
  }
  .image-uploader__default {
    position: relative;
    width: 100px;
    height: 100px;
    text-align: center;
    border: 1px dashed #ccc;
    border-radius: 6px;
    .image-uploader__default-img {
      position: absolute;
      top: 10%;
      left: 0;
      right: 0;
      margin-left: auto;
      margin-right: auto;
      width: 60%;
      height: 60%;
    }
  }
  .image-uploader__tips {
    line-height: 21px;
    font-size: 12px;
    color: #999;
  }
}
</style>
