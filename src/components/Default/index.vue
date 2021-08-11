<template>
  <div class="default" :class="{'default--absolute': position === 'absolute'}">
    <div :class="['default__image', `default__image--${type}`]"></div>
    <div class="default__text">{{ currentText }}</div>
  </div>
</template>

<script>
export default {
  name: 'Default',
  props: {
    type: {
      type: String,
      default: 'content'
    },
    text: {
      type: String,
      default: ''
    },
    position: {
      type: String,
      default: ''
    }
  },
  computed: {
    currentText() {
      if (this.text) {
        return this.text
      }
      switch (this.type) {
        case 'record':
          return '当前暂无访问记录噢~'
        case 'content':
          return '当前暂无查询内容噢~'
        case 'message':
          return '当前暂无消息噢~'
        case 'permissions':
          return '抱歉，您还没有权限访问该页面噢~'
        default:
          return '当前暂无查询内容噢~'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.default {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  justify-content: center;
  &.default--absolute {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
  .default__image {
    width: 165px;
    height: 165px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    &.default__image--record {
      background-image: url('~@/assets/images/default/record.png');
    }
    &.default__image--content {
      background-image: url('~@/assets/images/default/content.png');
    }
    &.default__image--message {
      background-image: url('~@/assets/images/default/message.png');
    }
    &.default__image--permissions {
      background-image: url('~@/assets/images/default/permissions.png');
    }
  }
  .default__text {
    margin-top: 20px;
    font-size: 14px;
    color: #999;
  }
}
</style>
