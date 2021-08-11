<template>
  <div class="logo" :class="{ collapse }">
    <router-link
      v-if="collapse"
      key="collapse"
      class="logo__link"
      to="/"
    />
    <router-link v-else key="expand" class="logo__link" to="/">
    </router-link>
  </div>
</template>

<script>
import { appName } from '@/settings'
export default {
  name: 'Logo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: appName
    }
  }
}
</script>

<style lang="scss" scoped>
.logo {
  position: relative;
  width: $aside-width;
  height: 50px;
  line-height: 50px;
  background-color: $navbar-bg-color;
  text-align: center;
  overflow: hidden;
  .logo__link {
    display: inline-block;
    width: 100%;
    height: 100%;
    background-image: url('~@/assets/images/logo.png');
    background-size: 100% 100%;
    .logo__icon {
      margin-right: 12px;
      width: 32px;
      height: 32px;
    }
    .logo__title {
      display: inline-block;
      margin: 0;
      line-height: 50px;
      font-weight: 600;
      font-size: 18px;
      color: #fff;
    }
  }

  &.collapse {
    width: $aside-width--mini;
    .logo__link {
      background-image: url('~@/assets/images/logo--mini.png');
      background-size: contain;
      background-position: center;
    }
  }
}
</style>
