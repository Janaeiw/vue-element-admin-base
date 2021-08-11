<template>
  <div class="err-page-container">
    <el-row>
      <el-col :span="12">
        <h1 class="text-jumbo text-ginormous">Oops!</h1>
        <h2>你没有权限去该页面</h2>
        <el-link type="primary">
          <router-link to="/">回首页</router-link>
        </el-link>
      </el-col>
      <el-col :span="12">
        <img
          :src="errGif"
          width="313"
          height="428"
          alt="Girl has dropped her ice cream."
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import errGif from '@/assets/401_images/401.gif'

export default {
  name: 'Page401',
  data() {
    return {
      errGif: errGif + '?' + +new Date()
    }
  }
}
</script>

<style lang="scss" scoped>
.err-page-container {
  width: 800px;
  max-width: 100%;
  margin: 100px auto;
  .text-jumbo {
    font-size: 60px;
    font-weight: 700;
    color: #484848;
  }
}
</style>
