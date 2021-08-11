<template>
  <div
    v-loading="loading"
    class="flex flex-column flex-1 relative"
    :style="{'min-height': minHeight}"
  >
    <div
      class="flex flex-column flex-1"
      :style="{'opacity': showDefault ? 0 : 1}"
    >
      <slot />
    </div>
    <Default
      v-show="!loading && showDefault"
      position="absolute"
      :type="defaultType"
    />
  </div>
</template>

<script>
import Default from '@/components/Default/index.vue'

export default {
  name: 'TableContainer',
  components: {
    Default
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    minHeight: {
      type: String,
      default: '300px'
    },
    showDefault: { // 是否显示缺省图
      type: Boolean,
      default: false
    },
    defaultType: { // 缺省图类型
      type: String,
      default: 'content'
    }
  }
}
</script>
