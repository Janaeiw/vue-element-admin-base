<template>
  <div :class="classObj" class="app-wrapper">
    <div
      v-if="device === 'mobile' && aside.opened"
      class="aside__mask"
      @click="handleCloseAside"
    />
    <div :class="{ 'fixed-header': fixedHeader }">
      <Navbar :showHamburger="showAside" />
      <TagsView v-if="needTagsView" class="tags-view-container" />
    </div>
    <div style="height: 100%">
      <div v-show="showAside" class="aside-container">
        <MenuAutocomplete
          :fold="!this.aside.opened"
          @fold="onMenuAutocompleteFold"
        />
        <Aside />
      </div>
      <div class="main-container">
        <div v-show="fixedHeader" :style="{ height: needTagsView ? '101px' : '56px'}"></div>
        <Main />
      </div>
    </div>
  </div>
</template>

<script>
import Aside from './comps/Aside/index.vue'
import Main from './comps/Main/index.vue'
import Navbar from './comps/Navbar/index.vue'
import TagsView from './comps/TagsView/index.vue'
import ResizeMixin from './mixins/ResizeHandler'
import MenuAutocomplete from '@/components/MenuAutocomplete/index.vue'
import { mapState } from 'vuex'

export default {
  name: 'Layout',
  mixins: [ResizeMixin],
  components: {
    Aside,
    Main,
    Navbar,
    TagsView,
    MenuAutocomplete,
    // Settings
    // RightPanel
  },
  props: {
    showAside: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapState({
      aside: (state) => state.app.aside,
      device: (state) => state.app.device,
      showSettings: (state) => state.settings.showSettings,
      needTagsView: (state) => state.settings.tagsView,
      fixedHeader: (state) => state.settings.fixedHeader
    }),
    classObj() {
      return {
        'aside--close': !this.aside.opened,
        'aside--open': this.aside.opened,
        'aside--hidden': !this.showAside,
        'without-animation': this.aside.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleCloseAside() {
      this.$store.dispatch('app/closeAside', { withoutAnimation: false })
    },
    onMenuAutocompleteFold() {
      this.$store.dispatch('app/toggleAside')
    }
  }
}
</script>

<style lang="scss" scoped>
.app-wrapper {
  height: 100%;
  width: 100%;
}

.tags-view-container {
  margin-left: $aside-width;
  width: calc(100% - #{$aside-width});
  transition: all .28s;
  overflow: hidden;
}

.main-container {
  display: flex;
  flex-direction: column;
  margin-left: $aside-width;
  min-height: 100%;
  transition: margin-left .28s;
  background-color: $bg-color--base;
}

.aside-container {
  position: fixed;
  top: $navbar-height;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  width: $aside-width !important;
  height: calc(100% - #{$navbar-height});
  background-color: $menu-bg-color;
  font-size: 0;
  overflow: hidden;
  transition: width 0.28s;
  z-index: 2000;
  /deep/ {
    // reset element-ui css
    .horizontal-collapse-transition {
      transition: 0s width ease-in-out, 0s padding-left ease-in-out, 0s padding-right ease-in-out;
    }
    .scrollbar-wrapper {
      overflow-x: hidden !important;
    }
    .el-scrollbar__bar.is-vertical {
      right: 0px;
    }
    .el-scrollbar {
      height: 100%;
    }
    &.has-logo {
      .el-scrollbar {
        height: calc(100% - 50px);
      }
    }
    .is-horizontal {
      display: none;
    }
    a {
      display: inline-block;
      width: 100%;
      overflow: hidden;
    }
    .svg-icon {
      margin-right: 9px;
      font-size: 16px;
    }
    .sub-el-icon {
      margin-right: 12px;
      margin-left: -2px;
    }
    .el-menu {
      border: none;
      height: 100%;
      width: 100% !important;
    }
    .el-submenu {
      &:hover {
        .el-submenu__title {
          background-color: transparent !important;
        }
      }
      &:hover,
      &.is-active {
        .el-submenu__title {
          color: $menu-text-color--active !important;
        }
      }
    }
    .el-menu-item {
      position: relative;
      height: 45px;
      line-height: 45px;
      &:hover,
      &.is-active {
        background-color: $menu-bg-color--active !important;
      }
      &.is-active {
        &::after {
          content: ' ';
          position: absolute;
          top: 0;
          right: 0;
          width: 3px;
          height: 100%;
          background-color: $menu-text-color--active;
          border-radius: 2px;
          z-index: 1;
        }
      }
    }
  }
}

.aside__mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .3);
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  transition: width 0.28s;
  z-index: 2000;
}
</style>

<style lang="scss" scoped>
.aside--close {
  .aside-container {
    width: $aside-width--mini !important;
  }

  .tags-view-container {
    margin-left: $aside-width--mini;
    width: calc(100% - #{$aside-width--mini});
  }

  .main-container {
    margin-left: $aside-width--mini;
  }

  .submenu-title-no-dropdown {
    position: relative;
    padding: 0 !important;
    /deep/ {
      .el-tooltip {
        padding: 0 !important;
        .svg-icon {
          margin-left: 20px;
        }
        .sub-el-icon {
          margin-left: 19px;
        }
      }
    }
  }

  /deep/ {
    .el-submenu {
      overflow: hidden;

      &>.el-submenu__title {
        padding: 0 !important;

        .svg-icon {
          margin-left: 20px;
        }

        .sub-el-icon {
          margin-left: 19px;
        }

        .el-submenu__icon-arrow {
          display: none;
        }
      }
    }

    .el-menu--collapse {
      .el-submenu {
        &>.el-submenu__title {
          &>span {
            height: 0;
            width: 0;
            overflow: hidden;
            visibility: hidden;
            display: inline-block;
          }
        }
      }
    }
  }
}

.without-animation {
  .main-container,
  .aside-container,
  .fixed-header {
    transition: none;
  }
}
.aside--hidden {
  .main-container {
    margin-left: 0;
  }
  .fixed-header {
    width: 100%;
  }
}
</style>

<style lang="scss" scoped>
// mobile responsive
.mobile {
  &.app-wrapper {
    &.aside--open {
      position: fixed;
      top: 0;
    }
  }
  .main-container {
    margin-left: 0px;
  }
  .aside-container {
    transition: transform .28s;
    width: $aside-width !important;
  }
  &.aside--close {
    .aside-container {
      pointer-events: none;
      transition-duration: 0.3s;
      transform: translate3d(-$aside-width, 0, 0);
    }
  }
  .fixed-header {
    width: 100%;
    transition: none;
  }
  .tags-view-container {
    margin-left: 0;
    width: 100%;
  }
}
</style>

<style lang="scss">
// when menu collapsed
.el-menu--vertical {
  &>.el-menu {
    .svg-icon {
      margin-right: 16px;
    }
    .sub-el-icon {
      margin-right: 12px;
      margin-left: -2px;
    }
  }

  // the scroll bar appears when the subMenu is too long
  >.el-menu--popup {
    max-height: 100vh;
    overflow-y: auto;

    &::-webkit-scrollbar-track-piece {
      background: #d3dce6;
    }

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background: #99a9bf;
      border-radius: 20px;
    }
  }
}
.el-menu--collapse .el-menu .el-submenu {
  min-width: $aside-width !important;
}
</style>
