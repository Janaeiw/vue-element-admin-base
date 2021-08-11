<template>
  <div class="app-container" :style="currentStyle" v-bind="$attrs">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Container',
  props: {
    module: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    currentStyle() {
      if (this.module) {
        return {
          margin: 0,
          backgroundColor: 'transparent',
          boxShadow: 'none'
        }
      }
      return {}
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  margin: 20px;
  padding: 20px;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: $border-radius--base;
  box-shadow: $box-shadow--base;
  z-index: 1;
}
</style>
