<template>
  <div
    class="captcha"
    title="点击刷新验证码"
    :style="{ width: `${width}`, height: `${height}`, 'border-radius': radius }"
    @click="handleRefreshCaptcha"
  >
    <el-image class="captcha__img" :src="img">
      <div slot="error" class="el-image__error">加载失败，点击重试</div>
    </el-image>
  </div>
</template>

<script>
import { getCaptcha } from '@/api/auth'

export default {
  name: 'Captcha',
  props: {
    width: {
      type: String,
      default: '120px'
    },
    height: {
      type: String,
      default: '47px'
    },
    radius: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      img: ''
    }
  },
  methods: {
    init() {
      this.fetchCaptcha()
    },
    clear() {
      this.img = ''
    },
    handleRefreshCaptcha() {
      this.fetchCaptcha()
    },
    fetchCaptcha() {
      getCaptcha().then((res) => {
        this.img = res.data.img
        this.$emit('change', {
          key: res.data.key
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.captcha {
  overflow: hidden;
  &:hover {
    cursor: pointer;
  }
  .captcha__img {
    width: 100%;
    height: 100%;
  }
}
</style>
