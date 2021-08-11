<template>
  <el-input class="input" :value="value" v-bind="$attrs" @input="onInput" />
</template>

<script>
export default {
  name: 'Input',
  props: {
    type: {
      type: String,
      default: ''
    },
    reg: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Number],
      default: ''
    }
  },
  methods: {
    onInput(value) {
      let formattedValue = ''
      if (this.reg) {
        formattedValue = value.replace(new RegExp(this.reg, 'g'), '')
      } else {
        switch (this.type) {
          case 'number':
            console.log(/^[0|1|2|3|4|5|6|7|8|9]*$/.test(value))
            formattedValue = /^[0|1|2|3|4|5|6|7|8|9]*$/.test(value)
              ? (value.length > 1 ? Number(value) : value)
              : this.value
        }
      }
      this.$emit('input', formattedValue)
      this.$emit('change', formattedValue)
    }
  }
}
</script>

<style lang="scss">
.input {
  &.el-input--small ~ .el-form-item__error {
    padding-top: 0;
  }
}
</style>
