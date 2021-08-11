<template>
  <el-link type="primary" @click="handleCilck">
    <slot><i class="el-icon-arrow-left" />返回</slot>
  </el-link>
</template>

<script>
export default {
  name: 'RouterBack',
  computed: {
    meta() {
      return this.$route.meta
    }
  },
  methods: {
    handleCilck() {
      if (this.$store.getters['app/fromPath']) {
        this.$router.go(-1)
        return
      }
      this.$router.push(this.meta.buttonGroup ? this.meta.buttonGroup.path : '/')
    }
  }
}
</script>
