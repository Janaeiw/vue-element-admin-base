<template>
  <el-select
    v-model="map"
    placeholder="请选择"
    filterable
    clearable
    :popper-append-to-body="false"
    @change="onChange"
  >
    <el-option
      v-for="item in buttons"
      :key="item.map"
      :label="item.map | filterButtonMapTitle"
      :value="item.map"
    />
  </el-select>
</template>

<script>
export default {
  name: 'ButtonSelector',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      map: '',
      buttons: [
        {
          map: 'create'
        },
        {
          map: 'delete'
        },
        // {
        //   map: 'search'
        // },
        {
          map: 'edit'
        },
        {
          map: 'export'
        },
        {
          map: 'import'
        },
        {
          map: 'order'
        },
        {
          map: 'change-status'
        },
        {
          map: 'transfer'
        },
        {
          map: 'sort-up'
        },
        {
          map: 'sort-down'
        }
      ]
    }
  },
  watch: {
    value(val) {
      this.map = val
    }
  },
  methods: {
    onChange() {
      this.$emit('input', this.map)
      this.$emit('change', this.map)
    }
  }
}
</script>
