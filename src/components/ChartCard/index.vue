<template>
  <Card class="chart-card" :class="{'is-border': border}">
    <div class="chart-card__header">
      <slot name="header"></slot>
      <el-tooltip v-if="$slots.tooltip" effect="light" placement="top">
        <div slot="content">
          <slot name="tooltip" />
        </div>
        <div class="chart-card__icon"></div>
      </el-tooltip>
    </div>
    <div class="chart-card__body">
      <div class="chart-card__value">
        <slot />
      </div>
    </div>
    <template #footer>
      <slot name="footer"></slot>
    </template>
  </Card>
</template>

<script>
import Card from '@/components/Card/index.vue'
export default {
  name: 'ChartCard',
  components: {
    Card
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    value: {
      type: Number,
      default: 0
    },
    border: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.chart-card {
  &.is-border {
    border: 1px solid #efefef;
  }
  .chart-card__header {
    position: relative;
    font-size: 16px;
    color: #333;
    .chart-card__icon {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      width: 18px;
      height: 18px;
      background-image: url('~@/assets/images/icon/warning.png');
      background-size: 100% 100%;
      z-index: 1;
    }
  }
  .chart-card__body {
    padding-top: 20px;
    font-size: 30px;
    font-weight: 500;
    .chart-card__value {
      font-size: 30px;
      font-weight: bold;
      color: #45D1FF;
    }
  }
}
</style>
