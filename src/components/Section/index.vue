<template>
  <section class="section">
    <header class="section__header">
      <slot name="header" />
    </header>
    <main class="section__main" :style="mainStyle">
      <slot />
    </main>
  </section>
</template>

<script>
export default {
  name: 'Section',
  props: {
    mainStyle: {
      type: Object,
      default() {
        return {}
      }
    }
  }
}
</script>

<style lang="scss">
.section {
  .section__header {
    padding: 12px 20px;
    border-radius: $border-radius--base;
    font-size: 16px;
    background-color: #F2F4F8;
    color: #333;
  }
  .section__main {
    padding: 30px 20px;
  }
}
</style>
