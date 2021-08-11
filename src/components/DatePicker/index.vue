<template>
  <el-date-picker
    class="date-picker"
    v-model="date"
    :type="type"
    :format="format"
    value-format="yyyy-MM-dd HH:mm:ss"
    range-separator="～"
    start-placeholder="请选择日期"
    end-placeholder="请选择日期"
    :picker-options="pickerOptions"
    :append-to-body="false"
    v-bind="$attrs"
    :style="style"
    @change="onChanged"
  />
</template>

<script>
import dayjs from 'dayjs'
export default {
  name: 'DatePicker',
  props: {
    type: { // datetimerange | daterange
      type: String,
      default: 'daterange'
    },
    format: { // yyyy-MM-dd | yyyy-MM-dd HH:mm:ss
      type: String,
      default: 'yyyy-MM-dd'
    },
    start: {
      type: String,
      default: ''
    },
    end: {
      type: String,
      default: ''
    },
    withinDays: { // 时间范围限制
      type: Number,
      default: 0
    },
    min: { // 最小时间（时间戳）
      type: [Number, String],
      default: 0
    },
    max: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      maxTimestamp: '',
      pickerRange: 0,
      pickerMinDate: '',
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          if (this.withinDays === 0) {
            return
          }
          if (minDate && this.pickerMinDate) {
            this.pickerMinDate = null
          } else if (minDate) {
            this.pickerMinDate = minDate.getTime()
          }
        },
        disabledDate: (time) => {
          if (this.min) {
            return time.getTime() < (this.min === 'today' ? dayjs().subtract(1, 'day').valueOf() : this.min)
          }
	        if (this.max === 'yesterday' && dayjs(time).valueOf() > this.maxTimestamp) {
            return true
          }
          if (this.withinDays === 0) {
            return false
          }
          if (this.pickerMinDate) {
            return (
              time.getTime() > this.pickerMinDate + this.pickerRange ||
              time.getTime() < this.pickerMinDate - this.pickerRange
            )
          }
          return false
        }
      },
      date: []
    }
  },
  watch: {
    end() {
      if (!this.date) {
        this.date = []
      }
      this.date = [this.start, this.end]
    }
  },
  computed: {
    style() {
      return {
        'max-width': this.width ? this.width : this.type === 'datetimerange' ? '320px' : '200px'
      }
    }
  },
  created() {
    if (this.max === 'yesterday') {
      this.maxTimestamp = dayjs(dayjs().format('YYYY-MM-DD')).subtract(1, 'day').valueOf()
    }
    this.pickerRange = (this.withinDays - 1) * 24 * 3600 * 1000
    if (this.start && this.end) {
      this.date = [this.start, this.end]
    }
  },
  methods: {
    onChanged(date) {
      date = date || []
      const dateJson = {
        start: '',
        end: ''
      }
      if (date.length > 1) {
        dateJson.start = date[0]
        dateJson.end = date[1]
      }
      if (this.format === 'yyyy-MM-dd' && date.length > 1 && date[1] !== '') {
        date[1] = dayjs(date[1]).format('YYYY-MM-DD 23:59:59')
        dateJson.end = date[1]
      }
      this.$emit('update:start', dateJson.start)
      this.$emit('update:end', dateJson.end)
      this.$emit('change', dateJson)
    }
  }
}
</script>

<style lang="scss" scoped>
.date-picker {
  width: 100%;
  /deep/ {
    .el-icon-date {
      &:before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        margin: auto;
        width: 16px;
        height: 16px;
        background-image: url('~@/assets/images/icon/date.png');
        background-size: 100% 100%;
      }
    }
    .el-range__icon {
      position: absolute;
      right: 7px;
      z-index: 1;
    }
    .el-icon-time {
      margin-top: 1px;
      right: 10px;
    }
    .el-range__close-icon {
      transition: none;
      z-index: 2;
      &::after {
        width: 20px;
      }
      &.el-icon-circle-close {
        height: 100%;
        line-height: 24px;
        vertical-align: middle;
        background-color: #fff;
        &::before {
          position: absolute;
          right: 10px;
          background-color: inherit;
        }
      }
    }
    .el-range-input {
      width: 40%;
      text-align: left;
    }
    .el-range-separator {
      line-height: 24px;
    }
  }
}
</style>
