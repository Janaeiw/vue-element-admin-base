<template>
  <div class="card">
    <div v-if="$slots.header" class="card__header">
      <slot name="header"></slot>
    </div>
    <div class="card__body" :class="bodyClass">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="card__footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: {
    bodyClass: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  display: flex;
  flex-direction: column;
  padding: 25px 20px;
  line-height: 1;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: $border-radius--base;
  box-shadow: $box-shadow--base;
  .card__header {
    padding-top: 5px;
    padding-bottom: 5px;
    box-sizing: border-box;
    font-size: 18px;
    font-weight: bold;
  }
  .card__body {
    font-size: 30px;
    font-weight: 500;
  }
  .card__footer {
    padding-top: 20px;
    font-size: 14px;
    color: #666;
  }
}
</style>
