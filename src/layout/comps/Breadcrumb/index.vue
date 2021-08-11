<template>
  <el-breadcrumb v-if="breadcrumbList.length > 1" :class="['breadcrumb', {'breadcrumb--dark': dark}]" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="item.name + item.path">
        <span
          v-if="item.redirect === 'noRedirect' || index == breadcrumbList.length - 1"
          class="no-redirect"
        >
          {{ item.meta.title }}
        </span>
        <a v-else @click.prevent="handleOpenPath(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import { compile } from 'path-to-regexp'

export default {
  name: 'Breadcrumb',
  props: {
    dark: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      breadcrumbList: []
    }
  },
  computed: {
    meta() {
      return this.$route.meta
    }
  },
  watch: {
    $route(route) {
      // if you go to the redirect page, do not update the breadcrumbs
      if (route.path.startsWith('/redirect/')) {
        return
      }
      this.initBreadcrumb()
    }
  },
  created() {
    this.initBreadcrumb()
  },
  methods: {
    initBreadcrumb() {
      // only show routes with meta.title
      let matched = this.$route.matched.filter(item => item.meta && item.meta.title)
      const first = matched[0]

      matched = this.customsMatched(matched)

      if (!this.isHome(first)) {
        matched = [{ path: '/', meta: { title: '首页' } }].concat(matched)
      }
      this.breadcrumbList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
    },
    isHome(route) {
      const name = route && route.name
      if (!name) {
        return false
      }
      return name.trim().toLocaleLowerCase() === 'home'
    },
    pathCompile(path) {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = this.$route
      const toPath = compile(path)
      return toPath(params)
    },
    openPath(path) {
      this.$router.push(this.pathCompile(path))
    },
    handleOpenPath(item) {
      const { redirect, path } = item
      if (this.$route.path === path || this.$route.path === redirect) {
        return
      }
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      this.openPath(path)
    },
    customsMatched(matched) {
      return matched
    }
  }
}
</script>

<style lang="scss" scoped>
.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: all .5s;
}
.breadcrumb-enter,
.breadcrumb-leave-active {
  opacity: 0;
  transform: translateX(20px);
}
.breadcrumb-move {
  transition: all .5s;
}
.breadcrumb-leave-active {
  position: absolute;
}

.breadcrumb {
  margin-left: 20px;
  margin-right: 20px;
  padding-top: 20px;
  padding-bottom: 20px;
  &.el-breadcrumb {
    display: inline-block;
    .no-redirect {
      color: $breadcrumb-color--disabled;
    }
    .el-breadcrumb__inner a,
    .el-breadcrumb__inner.is-link {
      color: $breadcrumb-color;
      &:hover {
        text-decoration: underline;
        color: $breadcrumb-color--active;
      }
    }
  }
  &.breadcrumb--dark {
    &.el-breadcrumb {
      .no-redirect {
        color: $breadcrumb--dark-color--disabled;
      }
      .el-breadcrumb__inner a,
      .el-breadcrumb__inner.is-link {
        color: $breadcrumb--dark-color;
        &:hover {
          color: $breadcrumb--dark-color--active;
        }
      }
    }
  }
}
</style>
