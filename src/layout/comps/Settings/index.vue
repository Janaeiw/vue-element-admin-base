<template>
  <div class="settings">
    <div>
      <h3 class="settings__title">页面布局设置</h3>

      <div class="settings__item">
        <span>选择主题</span>
        <theme-picker
          class="theme-picker-container"
          @change="themeChange"
        />
      </div>

      <div class="settings__item">
        <span>开启页签</span>
        <el-switch v-model="tagsView" class="settings__switch" />
      </div>

      <!-- <div class="settings__item">
        <span>固定头部</span>
        <el-switch v-model="fixedHeader" class="settings__switch" />
      </div>

      <div class="settings__item">
        <span>菜单 Logo</span>
        <el-switch v-model="showLogo" class="settings__switch" />
      </div> -->
    </div>
  </div>
</template>

<script>
import ThemePicker from './comps/ThemePicker'

export default {
  name: 'Settings',
  components: {
    ThemePicker
  },
  computed: {
    fixedHeader: {
      get() {
        return this.$store.state.settings.fixedHeader
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'fixedHeader',
          value: val
        })
      }
    },
    tagsView: {
      get() {
        return this.$store.state.settings.tagsView
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'tagsView',
          value: val
        })
      }
    },
    showLogo: {
      get() {
        return this.$store.state.settings.showLogo
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'showLogo',
          value: val
        })
      }
    }
  },
  methods: {
    themeChange(val) {
      this.$store.dispatch('settings/changeSetting', {
        key: 'theme',
        value: val
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.theme-picker-container {
  float: right;
  margin: -3px 8px 0 0;
  height: 26px;
}
.settings {
  padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .settings__title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    line-height: 22px;
  }

  .settings__item {
    padding: 12px 0;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65);
  }

  .settings__switch {
    float: right;
  }
}
</style>
