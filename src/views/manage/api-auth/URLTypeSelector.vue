<template>
  <el-select
    v-model="currentValue"
    placeholder="请选择"
    filterable
    clearable
    :popper-append-to-body="false"
    @change="onChange"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.value | filterURLTypeTitle"
      :value="item.value"
    />
  </el-select>
</template>

<script>
export default {
  name: 'URLTypeSelector',
  props: {
    value: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      currentValue: '',
      options: [
        {
          value: 1
        },
        {
          value: 2
        },
        {
          value: 3
        },
        {
          value: 4
        },
        {
          value: 5
        },
        {
          value: 6
        },
        {
          value: 7
        },
        {
          value: 8
        },
        {
          value: 9
        },
        {
          value: 10
        },
        {
          value: 11
        }
      ]
    }
  },
  watch: {
    value(val) {
      this.currentValue = val
    }
  },
  methods: {
    onChange() {
      this.$emit('input', this.currentValue)
      this.$emit('change', this.currentValue)
    }
  }
}
</script>
