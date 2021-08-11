<template>
  <div class="explain-panel">
    <p>
      <slot />
    </p>
  </div>
</template>

<script>
export default {
  name: 'ExplainPanel'
}
</script>

<style lang="scss">
.explain-panel {
  padding: 8px 16px;
  background-color: #ecf8ff;
  border-radius: 4px;
  border-left: 5px solid $color--primary;
  P {
    font-size: 14px;
    color: #5e6d82;
    line-height: 1.5em;
  }
}
</style>
