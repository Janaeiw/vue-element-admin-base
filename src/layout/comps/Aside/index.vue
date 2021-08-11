<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :default-active="activeMenu"
      :collapse="isCollapse"
      :unique-opened="true"
      :collapse-transition="false"
      :background-color="variables.menuBgColor"
      :text-color="variables.menuTextColor"
      :active-text-color="variables.menuTextColorActive"
      mode="vertical"
    >
      <AsideItem
        v-for="route in formatRoutes(permissionsRoutes)"
        :key="route.name"
        :item="route"
        :base-path="route.path"
      />
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import AsideItem from './comps/AsideItem/index.vue'
import variables from '@/styles/variables.scss'

export default {
  components: {
    AsideItem
  },
  computed: {
    ...mapGetters({
      permissionsRoutes: 'permissions/routes',
      aside: 'app/aside'
    }),
    activeMenu() {
      const { meta, path, name } = this.$route
      // if set path, the aside will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return name || path
    },
    showLogo() {
      return this.$store.state.settings.showLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.aside.opened
    }
  },
  methods: {
    formatRoutes(routes) {
      return routes
    }
  }
}
</script>

<style lang="scss" scoped>
.search {
  padding-top: 9px;
  padding-bottom: 9px;
  text-align: center;
  /deep/ {
    .el-select .el-input__inner {
      border-top: 0;
      border-right: 0;
      border-left: 0;
      border-radius: 0;
    }
  }
}
</style>
