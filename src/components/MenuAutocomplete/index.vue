<!--
 * @Author: Ten
 * @Date: 2021/06/30 17:24
 * @LastEditTime: 2021/07/02 19:35
 * @LastEditors: Ten
 * @Description: 菜单输入建议列表
-->
<template>
  <div class="menu-autocomplete" :class="{'menu-autocomplete__fold': fold}">
    <el-autocomplete
      v-show="!fold"
      v-model="keyword"
      ref="menuAutocomplete"
      :fetch-suggestions="querySearch"
      :trigger-on-focus="false"
      :placeholder="placeholder"
      suffix-icon="el-icon-search"
      @select="handleSelect"
    />
    <i
      v-show="fold"
      class="el-icon-search"
      @click="handleUnfold"
    />
  </div>
</template>

<script>
import { flatten } from '@/utils/tree'
import { mapGetters } from 'vuex'

export default {
  name: 'MenuAutocomplete',
  props: {
    placeholder: {
      type: String,
      default: '请输入菜单名称'
    },
    fold: { // 是否折叠
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      keyword: '',
      queryRoutes: []
    }
  },
  computed: {
    ...mapGetters({
      permissionsRoutes: 'permissions/routes'
    })
  },
  created() {
    // 过滤不在菜单显示的路由
    const routes = this.permissionsRoutes.filter(route => !route.hidden)
    // 扁平化数组
    const flattenRoutes = flatten(routes)
    // 获取最低层路由
    const lowerLevelRoutes = flattenRoutes.filter(item => {
      return (!item.children || (item.children && item.children.length === 0)) && item.meta && item.meta.title
    })
    // 格式化autocomplete路由
    this.queryRoutes = lowerLevelRoutes.map(item => {
      return {
        value: item.meta.title,
        name: item.name
      }
    })
  },
  methods: {
    /**
     * 查询菜单
     * @param {string} keyword 关键字
     * @param {function} callback 回调
     * @return {void}
     * @Author: Ten
     * @Date: 2021/06/30 19:55
     */
    querySearch(keyword, callback) {
      callback(keyword ? this.queryRoutes.filter(item => item.value.includes(keyword)) : this.queryRoutes)
    },
    /**
     * 搜索结果菜单选中事件
     * @param {object} route 选中的菜单
     * @return {void}
     * @Author: Ten
     * @Date: 2021/06/30 19:56
     */
    handleSelect(route) {
      this.keyword = ''
      if (this.$route.name === route.name) {
        return
      }
      this.$router.push({
        name: route.name
      })
    },
    /**
     * 点击搜索图标展开
     * @return {void}
     * @Author: Ten
     * @Date: 2021/07/02 15:32
     */
    handleUnfold() {
      this.$emit('fold', false)
      setTimeout(() => {
        this.$refs.menuAutocomplete.focus()
      }, 0)
    }
  }
}
</script>

<style lang="scss" scoped>
.menu-autocomplete {
  padding: 5px 10px;
  &.menu-autocomplete__fold {
    /deep/ {
      .el-icon-search {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: auto;
        margin-right: auto;
        width: 32px;
        height: 32px;
        font-size: 12px;
        color: $menu-text-color;
        &:hover {
          cursor: pointer;
          color: $menu-text-color--active;
        }
      }
    }
  }
}
</style>
