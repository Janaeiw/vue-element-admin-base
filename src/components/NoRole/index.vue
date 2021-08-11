<template>
  <Default type="permissions" :text="text" />
</template>

<script>
import Default from '@/components/Default/index.vue'

export default {
  name: 'NoRole',
  components: {
    Default
  },
  props: {
    text: {
      type: String,
      default: '您暂无该页面权限，有需要请联系管理员'
    }
  }
}
</script>
