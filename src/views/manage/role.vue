<template>
  <Container>
    <FilterBar>
      <el-form :inline="true" :model="params" class="form-inline">
        <el-form-item label="角色名称：">
          <el-input
            v-model.trim="params.title"
            placeholder="请输入"
            maxlength="10"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <Button type="search" @click="handleSearch" />
        </el-form-item>
        <el-form-item>
          <Button v-auth:create type="create" @click="handleAdd">添加角色</Button>
        </el-form-item>
      </el-form>
    </FilterBar>

    <TableContainer
      :loading="loading"
      :show-default="list.length === 0"
    >
      <el-table
        :data="list"
        stripe
        fit
        highlight-current-row
      >
        <el-table-column label="角色名称" min-width="150px" align="center">
          <template slot-scope="scope">
            {{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="110px" align="center">
          <template slot-scope="scope">
            <StatusButton
              v-auth:change-status
              :status="scope.row.status"
              @click="handleModifyStatus(scope.$index, scope.row.id, scope.row.status)"
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
              @click="handleEdit(scope.row.id)"
            >
              编辑
            </el-button>
            <el-button
              v-auth:delete
              title="点击删除"
              type="text"
              @click="handleDel(scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </TableContainer>
    <Pagination
      :loading="loading"
      :total="total"
      :page="params.page"
      :psize="params.psize"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
    />

    <FormDialog ref="fromRoles" @submit="handleRefreshList" />
  </Container>
</template>

<script>
import { readRoles, modifyRoleStatus, delRole } from '@/api/role'
import Container from '@/components/Container/index.vue'
import FilterBar from '@/components/FilterBar/index.vue'
import Button from '@/components/Button/index.vue'
import Pagination from '@/components/Pagination/index.vue'
import StatusButton from '@/components/StatusButton/index.vue'
import TableContainer from '@/components/TableContainer/index.vue'
import FormDialog from './role/FormDialog'
import { confirm } from '@/utils/messageBox'

export default {
  name: 'ManageRole',
  components: {
    Container,
    FilterBar,
    Button,
    Pagination,
    StatusButton,
    TableContainer,
    FormDialog
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
      list: [],
      loading: true,
      params: {
        page: 1,
        psize: 20,
        status: -1,
        title: ''
      },
      total: 0
    }
  },
  created() {
    this.fetchList()
  },
  methods: {
    fetchList() {
      this.loading = true
      if (this.params.status === -1) {
        this.params.status = undefined
      }
      readRoles(this.params).then((res) => {
        this.list = res.data.data
        this.total = res.data.total
        this.loading = false
      }).catch(err => {
        console.log(err)
        this.loading = false
      })
    },
    handleSearch() {
      this.params.page = 1
      this.fetchList()
    },
    onSizeChange(val) {
      this.params.page = 1
      this.params.psize = val
      this.fetchList()
    },
    onCurrentChange(val) {
      this.params.page = val
      this.fetchList()
    },
    handleModifyStatus(index, id, status) {
      modifyRoleStatus(id, {
        status: 1 - status
      }).then(() => {
        this.list[index].status = 1 - status
      })
    },
    handleAdd() {
      this.$refs.fromRoles.open()
    },
    handleEdit(id) {
      this.$refs.fromRoles.open(id)
    },
    handleRefreshList() {
      this.fetchList()
    },
    handleDel(id) {
      confirm({
        message: '此操作将永久删除该记录, 是否继续?'
      }).then(() => {
        this.loading = true
        delRole(id).then(() => {
          this.$message.success('删除成功')
          this.fetchList()
        }).catch(err => {
          console.log(err)
          this.loading = false
        })
      })
    }
  }
}
</script>
