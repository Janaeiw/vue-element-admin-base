<template>
  <el-select
    :loading="loading"
    v-model="platformId"
    placeholder="请选择"
    :disabled="disabled"
    filterable
    clearable
    :popper-append-to-body="false"
    @change="onChange"
  >
    <el-option
      v-for="item in platforms"
      :key="item.id"
      :label="item.name"
      :value="item.id"
    />
  </el-select>
</template>

<script>
import { readAllPlatforms } from '@/api/platform'
export default {
  name: 'PlatformSelector',
  props: {
    value: {
      type: [Number, String],
      default: -1
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      platformId: '',
      platforms: []
    }
  },
  watch: {
    value(val) {
      this.platformId = val
    }
  },
  created() {
    this.loading = true
    readAllPlatforms()
      .then((res) => {
        this.platforms = res.data || []
        this.loading = false
      })
      .catch(() => {
        this.loading = false
      })
  },
  methods: {
    onChange(val) {
      this.$emit('change', val)
      this.$emit('input', val)
    }
  }
}
</script>
