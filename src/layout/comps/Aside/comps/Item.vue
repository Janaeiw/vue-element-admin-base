<script>
export default {
  name: 'Item',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    isDot: {
      type: Boolean,
      default: false
    }
  },
  render(h, context) {
    const { icon, title, isDot } = context.props
    const vnodes = []

    if (icon) {
      if (icon.includes('el-icon')) {
        vnodes.push(<i class={[icon, 'sub-el-icon']} />)
      } else {
        vnodes.push(<svg-icon icon-class={icon} />)
      }
    }

    if (title) {
      vnodes.push(
        <span slot="title" class="item">
          <el-badge hidden={!isDot} is-dot>{title}</el-badge>
        </span>
      )
    }
    return vnodes
  }
}
</script>
<style lang="scss" scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
.item {
  /deep/ {
    .el-badge__content.is-fixed.is-dot {
      right: -15px;
      bottom: 0;
      margin-top: auto;
      margin-bottom: auto;
    }
  }
}
</style>
