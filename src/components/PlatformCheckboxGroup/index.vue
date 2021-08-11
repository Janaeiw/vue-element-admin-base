<template>
  <div>
    <el-checkbox-group
      class="platform-checkbox-group"
      v-model="currentValue"
      @change="onChange"
    >
      <el-checkbox
        v-for="item in platforms"
        :key="item.id"
        :label="item.id"
        border
      >
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <div v-if="platforms.length === 0" class="platform-checkbox-group__empty">暂无数据</div>
  </div>
</template>

<script>
import { readAllPlatforms } from '@/api/platform'
export default {
  name: 'PlatformCheckboxGroup',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      platforms: [],
      currentValue: []
    }
  },
  watch: {
    value(val) {
      this.currentValue = (val.split(',') || []).map(item => Number(item))
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      return new Promise((resolve, reject) => {
        readAllPlatforms().then((res) => {
          resolve()
          this.platforms = res.data || []
        }).catch(() => {
          reject()
        })
      })
    },
    onChange(val) {
      this.$emit('input', val.join(','))
    }
  }
}
</script>

<style lang="scss" scoped>
.platform-checkbox-group {
  /deep/ {
    .el-form-item {
      margin-bottom: 10px;
    }
    .el-checkbox-group {
      padding-left: 5px;
      padding-right: 5px;
    }
    .el-checkbox {
      padding: 4px 8px;
      margin-right: 5px;
      margin-bottom: 10px;
      height: auto;
      .el-checkbox__label {
        padding-left: 5px;
        word-break: break-word;
        white-space: normal;
        vertical-align: middle;
        font-size: 12px;
        font-weight: normal;
      }
    }
    .el-checkbox.is-bordered + .el-checkbox.is-bordered {
      margin-left: 0;
    }
  }
}
.platform-checkbox-group__empty {
  margin-top: -5px;
  color: $color--empty;
}
</style>
