<template>
  <div>
    <div v-if="content && content.length > maxlength">
      <el-tooltip
        effect="dark"
        :content="content"
        placement="top"
      >
        <div slot="content" :style="{'width': tooltipWidth}">{{ content }}</div>
        <div>{{ content.substr(0, maxlength) + '...'}}</div>
      </el-tooltip>
    </div>
    <div v-else> {{ content }} </div>
  </div>
</template>

<script>
export default {
  name: 'TextTooltip',
  props: {
    content: {
      type: String,
      default: ''
    },
    maxlength: {
      type: Number,
      default: 20
    },
    tooltipWidth: {
      type: String,
      default: '250px'
    }
  }
}
</script>
