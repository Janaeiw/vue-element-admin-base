<template>
  <div class="hamburger" @click="toggleClick">
    <svg-icon :icon-class="className" class-name="humburger__icon" />
  </div>
</template>

<script>
export default {
  name: 'Hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    className() {
      return this.isActive ? 'fold' : 'unfold'
    }
  },
  methods: {
    toggleClick() {
      this.$emit('toggleClick')
    }
  }
}
</script>

<style lang="scss" scoped>
.hamburger {
  width: 20px;
  height: 20px;
  vertical-align: middle;
  font-size: 22px;
  color: #333;
  &:hover {
    cursor: pointer;
  }
  .humburger__icon {
    vertical-align: -0.16em;
  }
}
</style>
