<template>
  <div
    v-loading="loading"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255)"
    class="menu-tree"
  >
    <el-tree
      :style="{ opacity: loading ? 0 : 1 }"
      ref="tree"
      :data="menus"
      :default-checked-keys="defaultChecked"
      :props="defaultProps"
      :expand-on-click-node="false"
      :default-expand-all="false"
      show-checkbox
      node-key="id"
      @check="onCheck"
    >
      <template v-if="isSlot" v-slot="{ data }">
        <div>
          <div>{{ data.title }}</div>
          <div v-if="data.button.length > 0">
            <el-checkbox-group v-model="buttonIdList" @change="onButtonIdListChange">
              <el-checkbox
                v-for="item in data.button"
                :key="item.id"
                :label="item.id"
              >
                {{item.map | filterButtonMapTitle}}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </template>
    </el-tree>
  </div>
</template>

<script>
import _ from 'lodash'
import tree from '@/utils/tree'
import { readAllMenusButton } from '@/api/menu'

export default {
  name: 'MenuTree',
  props: {
    value: {
      type: String,
      default: ''
    },
    buttonIds: {
      type: String,
      default: ''
    },
    isSlot: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      menus: [],
      selectedIdsList: [],
      pidList: [],
      defaultChecked: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      buttonIdList: [],
      buttonList: []
    }
  },
  watch: {
    value(ids) {
      let selectedIdsList = []
      if (ids !== '') {
        selectedIdsList = ids.split(',').map(id => {
          return Number(id)
        })
      }
      if (selectedIdsList.length > 0) {
        this.selectedIdsList = selectedIdsList
        if (this.menus.length > 0) {
          this.setCheckedKeys(selectedIdsList)
        }
      } else {
        this.selectedIdsList = []
        this.setCheckedKeys([])
      }
    },
    buttonIds(val) {
      if (val) {
        this.buttonIdList = val.split(',').map(item => {
          return Number(item)
        }).filter(id => {
          return !isNaN(id)
        })
      } else {
        this.buttonIdList = []
      }
    }
  },
  created() {
    this.fetchList()
  },
  methods: {
    fetchList() {
      this.loading = true
      readAllMenusButton()
        .then((res) => {
          if (res.data && res.data.length > 0) {
            this.menus = res.data
            this.pidList = tree.getParentsIdList(this.menus)
            this.buttonList = this.getButtonList(this.menus)
            this.setCheckedKeys(this.selectedIdsList)
          } else {
            this.menus = []
          }
          this.loading = false
        })
        .catch(err => {
          console.log(err)
          this.loading = false
        })
    },
    getChildrenById(list, id, property = 'children') {
      let data = {}
      function loop(list) {
        list.forEach(item => {
          // console.log(item.id)
          if (item.id === id) {
            data = item
          }
          if (item[property] && item[property].length > 0) {
            return loop(item[property])
          }
        })
        return data
      }
      return loop(list)
    },
    onCheck(data, checkedObject) {
      const checked = checkedObject.checkedKeys.includes(data.id)
      this.selectedIdsList = this.$refs.tree.getCheckedKeys(true)
      const buttonIdList = _.flatMapDeep(
        tree.getLowerChildrens(this.menus, data.id).map(item => item.button.map(item => item.id))
      )
      if (checked) {
        const flag = buttonIdList.some(id => id === this.buttonIdList[this.buttonIdList.length - 1])
        if (!flag) {
          this.buttonIdList = _.uniq(this.buttonIdList.concat(buttonIdList))
        }
      } else {
        buttonIdList.forEach(id => {
          this.buttonIdList.forEach((buttonId, index) => {
            if (buttonId === id) {
              this.buttonIdList.splice(index, 1)
            }
          })
        })
      }
      this.$emit('update:buttonIds', this.buttonIdList.join(','))
      this.$emit('input', this.getCheckedKeysList().join(','))
    },
    setCheckedKeys(idsList) {
      if (idsList.length > 0) {
        const list = idsList.filter((id) => !this.pidList.includes(id))
        this.$refs.tree.setCheckedKeys(list)
      } else {
        this.$refs.tree.setCheckedKeys([])
      }
    },
    getCheckedKeys() {
      const checkedNodes = this.$refs.tree.getCheckedNodes()
      const pidList = checkedNodes.filter(item => item.pid > 0).map(item => item.pid)
      return _.uniq(pidList.concat(this.getCheckedKeysList())).join(',')
    },
    getCheckedKeysList() {
      return this.$refs.tree.getCheckedKeys()
    },
    getButtonList(list) {
      return _.flattenDeep(list.map(item => {
        if (item.children.length > 0) {
          return this.getButtonList(item.children)
        }
        return item.button
      }).filter(item => item.length > 0))
    },
    onButtonIdListChange(buttonIdList) {
      for (const button of this.buttonList) {
        if (buttonIdList[buttonIdList.length - 1] === button.id) {
          if (!this.selectedIdsList.includes(button.menu_id)) {
            this.selectedIdsList.push(button.menu_id)
          }
          this.setCheckedKeys(this.selectedIdsList)
          break
        }
      }
      this.$emit('input', this.getCheckedKeysList().join(','))
      this.$emit('update:buttonIds', buttonIdList.join(','))
    }
  }
}
</script>

<style lang="scss" scoped>
.menu-tree {
  min-height: 100px;
  /deep/ {
    .el-tree-node__content {
      align-items: flex-start;
      height: auto;
    }
    .el-tree-node__content > .el-tree-node__expand-icon {
      padding: 10px;
    }
    .el-tree-node {
      white-space: normal;
    }
  }
}
</style>
