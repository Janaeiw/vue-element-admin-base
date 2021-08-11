<template>
  <el-tabs
    class="platforms-tabs"
    type="border-card"
    size="medium"
    v-model="platformId"
    @tab-click="handleChange"
  >
    <el-tab-pane
      v-for="(platform, index) in currentPlatforms"
      :key="index"
      :label="platform.name"
      :name="String(platform.id)"
    >
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'PlatformTabs',
  props: {
    value: {
      type: Number,
      default: 0
    },
    wiki: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      platformId: '-2'
    }
  },
  computed: {
    ...mapGetters({
      platforms: 'user/platforms'
    }),
    currentPlatforms() {
      return this.platforms.filter(item => {
        if (this.wiki) {
          return item
        }
        return item.id !== -2
      })
    }
  },
  created() {
    if (this.currentPlatforms.length > 0) {
      this.platformId = String(this.currentPlatforms[0].id)
      this.update(this.platformId, this.currentPlatforms[0].name)
    }
  },
  methods: {
    update(platformId, platformName) {
      platformId = Number(platformId)
      this.$emit('input', platformId)
      this.$emit('change', platformId, platformName)
    },
    handleChange() {
      let platformName = ''
      for (const item of this.platforms) {
        if (item.id === Number(this.platformId)) {
          platformName = item.name
          break
        }
      }
      this.update(this.platformId, platformName)
    }
  }
}
</script>

<style lang="scss" scoped>
.platforms-tabs {
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: $border-radius--base;
  box-shadow: $box-shadow--base;
  border: 0;
  /deep/ {
    .el-tabs__nav-next, .el-tabs__nav-prev {
      line-height: 36px;
    }
    .el-tabs__header {
      background-color: transparent;
      border-bottom: 0;
    }
    .el-tabs__nav {
      border-radius: 18px;
      border: 1px solid $border-color--primary;
    }
    .el-tabs__content {
      padding: 0;
    }
    .el-tabs__item {
      height: 35px;
      line-height: 35px;
      border: 0;
      border-radius: 17px;
      font-weight: normal;
      font-size: 14px;
      color: #666;
      &:not(.is-disabled):hover {
        color: #666;
      }
      &.is-active {
        background-color: #2795ff;
        color: #fff;
        &:hover {
          color: #fff;
        }
      }
    }
  }
}
</style>
