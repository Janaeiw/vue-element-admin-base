<template>
  <div class="text-more">
    <div v-more class="text-more__content">
      <div v-if="content" v-html="content"></div>
      <div>
        <slot></slot>
      </div>
    </div>
    <div class="text-more__control">
      <el-button type="text" @click="handleClick"> 查看更多 </el-button>
    </div>
  </div>
</template>

<script>
function init(el) {
  if (el.children[0].offsetHeight > 120) {
    el.nextElementSibling.style.display = 'block'
  } else {
    el.nextElementSibling.style.display = 'none'
  }
}
export default {
  name: 'TextMore',
  directives: {
    more: {
      inserted: (el) => {
        init(el)
      },
      componentUpdated: (el) => {
        init(el)
      }
    }
  },
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleClick() {
      this.$emit('open', this.content)
    }
  }
}
</script>

<style lang="scss">
.text-more {
  position: relative;
  .text-more__content {
    max-height: 120px;
    overflow: hidden;
  }
  .text-more__control {
    display: none;
    width: 100%;
    text-align: center;
  }
}
</style>
