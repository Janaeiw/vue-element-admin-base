<template>
  <Container>
    <FilterBar>
      <el-form :inline="true">
        <el-form-item>
          <Button type="refresh" @click="handleReset">刷新</Button>
          <Button v-auth:create type="create" @click="handleAdd">添加菜单</Button>
          <Button v-auth:delete :loading="deleting" type="delete" @click="handleDeleteList" />
        </el-form-item>
      </el-form>
    </FilterBar>

    <TableContainer
      :loading="loading"
      :show-default="getRulesList.length === 0"
    >
      <tree-table
        :key="tableKey"
        :data="getRulesList"
        :expand-all="expandAll"
        :columns="columns"
        fit
        highlight-current-row
        :visible="visible"
        @selection-change="handleSelectionChange"
      >
        <el-table-column label="标识" min-width="150px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="图标" min-width="120px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.icon }}</span>
          </template>
        </el-table-column>
        <el-table-column label="路径" min-width="150px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.path }}</span>
          </template>
        </el-table-column>
        <el-table-column label="组件" min-width="200px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.component }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="80px" align="center">
          <template slot-scope="scope">
            <StatusButton
              v-auth:change-status
              :status="scope.row.status"
              @click="handleModifyStatus(scope.row.id, scope.row.status)"
            />
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          align="center"
          min-width="150px"
          class-name="small-padding"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              v-auth:edit
              title="点击编辑"
              type="text"
              @click="handleUpdate(scope.row.id)"
            >
              编辑
            </el-button>
            <el-button
              v-auth:delete
              title="点击删除"
              type="text"
              @click="handleDelete(scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </tree-table>
    </TableContainer>
    <FormDialog ref="fromMenu" :menu-list="list" @submit="handleRefreshList" />
  </Container>
</template>

<script>
import { readAllMenus, modifyMenuStatus, delMenu, delMenus } from '@/api/menu'
import Container from '@/components/Container/index.vue'
import FilterBar from '@/components/FilterBar/index.vue'
import Button from '@/components/Button/index.vue'
import StatusButton from '@/components/StatusButton/index.vue'
import TableContainer from '@/components/TableContainer/index.vue'
import FormDialog from './menu/FormDialog'
import { confirm } from '@/utils/messageBox'
import tree from '@/utils/tree'
import treeTable from '@/components/TreeTable'

export default {
  name: 'ManageMenu',
  components: {
    Container,
    FilterBar,
    Button,
    StatusButton,
    TableContainer,
    FormDialog,
    treeTable
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: '禁用',
        1: '正常'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: [],
      selectedRows: [],
      loading: true,
      expandAll: true,
      columns: [
        {
          text: '名称',
          value: 'title',
          minWidth: '200'
        }
      ],
      deleting: false,
      visible: true
    }
  },
  computed: {
    getRulesList() {
      return tree.toTree(this.list, 0, 'id', 'pid', 'children', {
        delete: false
      })
    }
  },
  created() {
    this.fetchList()
  },
  methods: {
    fetchList() {
      this.loading = true
      readAllMenus().then((res) => {
        this.list = res.data
        this.loading = false
      }).catch(err => {
        console.log(err)
        this.loading = false
      })
    },
    handleReset() {
      this.fetchList()
    },
    handleAdd() {
      this.$refs.fromMenu.open()
    },
    handleUpdate(id) {
      this.$refs.fromMenu.open(id)
    },
    handleSelectionChange(val) {
      this.selectedRows = val
    },
    handleModifyStatus(id, status) {
      const params = { status: 1 - status }
      modifyMenuStatus(id, params).then(() => {
        this.list.forEach((item) => {
          if (item.id === id) {
            item.status = 1 - status
          }
        })
      })
    },
    handleRefreshList() {
      this.fetchList()
    },
    handleDelete(id) {
      confirm({
        message: '此操作将永久删除该记录, 是否继续?'
      }).then(() => {
        this.loading = true
        delMenu(id).then((res) => {
          this.$message.success('删除成功')
          this.fetchList()
        }).catch(err => {
          console.log(err)
          this.loading = false
        })
      })
    },
    handleDeleteList() {
      if (this.selectedRows.length === 0) {
        this.$message.error('请选择要删除的数据')
        return
      }
      confirm({
        message: '此操作将永久删除该记录, 是否继续?'
      }).then(() => {
        this.deleting = true
        const ids = this.selectedRows.map(item => item.id).join(',')
        delMenus(ids).then(() => {
          this.$message.success('删除成功')
          this.fetchList()
          this.deleting = false
        }).catch(err => {
          console.log(err)
          this.deleting = false
        })
      })
    }
  }
}
</script>
