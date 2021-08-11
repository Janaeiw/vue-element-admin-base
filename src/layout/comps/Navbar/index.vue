<template>
  <div class="navbar">
    <div class="navbar__item">
      <Logo v-if="showLogo" :collapse="isCollapse" />
      <Hamburger
        v-if="showHamburger"
        :is-active="aside.opened"
        class="hamburger-container"
        @toggleClick="handleToggleAside"
      />
      <div v-show="device === 'desktop'" class="navbar__name">{{ appName }}</div>
    </div>

    <div class="navbar__item">
      <template v-if="showSizeSelect && device !== 'mobile'">
        <el-tooltip content="全局尺寸" effect="dark" placement="bottom">
          <SizeSelect class="navbar__inner" />
        </el-tooltip>
      </template>

      <div class="avatar-container navbar__inner">
        <div class="avatar-wrapper">
          <el-avatar class="user-avatar" :size="30" :src="avatar"></el-avatar>
          <span>{{ name }}</span>
          <span class="user-logout" @click="logout"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Logo from '@/layout/comps/Logo/index.vue'
import Hamburger from './comps/Hamburger.vue'
import SizeSelect from './comps/SizeSelect'
import { appName } from '@/settings'

export default {
  name: 'Navbar',
  components: {
    Logo,
    Hamburger,
    SizeSelect
  },
  props: {
    showHamburger: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      appName
    }
  },
  computed: {
    ...mapState({
      showLogo: state => state.settings.showLogo,
      showSizeSelect: (state) => state.settings.showSizeSelect
    }),
    ...mapGetters({
      aside: 'app/aside',
      name: 'user/name',
      device: 'app/device',
      avatar: 'user/avatar'
    }),
    isCollapse() {
      return !this.aside.opened
    }
  },
  methods: {
    handleToggleAside() {
      this.$store.dispatch('app/toggleAside')
    },
    handleOpenPath(path) {
      if (path === '/logout') {
        this.logout()
        return
      }
      this.openPath(path)
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.openPath('/login')
    },
    openPath(path) {
      if (path === this.$route.path) {
        return
      }
      this.$router.push(path)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  position: relative;
  height: $navbar-height;
  background-color: $navbar-bg-color;
  color: #fff;
  overflow: hidden;
  .navbar__item {
    display: flex;
    align-items: center;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .navbar__inner {
      display: flex;
      padding-left: 20px;
      padding-right: 20px;
      font-size: 16px;
      color: #fff;
      vertical-align: text-bottom;
      transition: background-color 0.3s;
      &:hover {
        cursor: pointer;
      }
    }

    .navbar__name {
      font-size: 22px;
      color: #000;
    }
  }

  .hamburger-container {
    width: 50px;
    height: auto;
    transition: background-color 0.3s;
    text-align: center;
  }

  .avatar-container {
    .avatar-wrapper {
      display: flex;
      align-items: center;
      position: relative;
      color: #000;

      .user-avatar {
        margin-right: 10px;
      }
      /deep/ {
        &.el-avatar > img {
          width: 100%;
        }
      }
      .user-logout {
        margin-left: 30px;
        width: 16px;
        height: 16px;
        background-image: url('~@/assets/images/logout.png');
        background-size: 100% 100%;
      }

      .el-icon-switch-button {
        width: 40px;
        line-height: 40px;
        text-align: center;
        font-size: 18px;
        color: #000;
      }
    }
  }
}
</style>
