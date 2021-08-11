<template>
  <Container>
    <FilterBar>
      <el-form :inline="true">
        <el-form-item>
          <Button type="refresh" @click="handleReset">刷新</Button>
          <Button v-auth:create type="create" @click="handleAdd">添加配置组</Button>
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
        <el-table-column label="ID" min-width="100px" align="center">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="配置名称" min-width="150px" align="center">
          <template slot-scope="scope">
            {{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="150px" align="center">
          <template slot-scope="scope">
            {{ scope.row.created_at }}
          </template>
        </el-table-column>
        <el-table-column label="更新时间" min-width="150px" align="center">
          <template slot-scope="scope">
            {{ scope.row.updated_at }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="110px" align="center">
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
          width="150px"
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
    <FormDialog ref="formDialog" @submit="onConfigGroupFromSubmit" />
  </Container>
</template>

<script>
import { readConfigGroups, delConfig, modifyConfigGroupStatus } from '@/api/config'
import Container from '@/components/Container/index.vue'
import FilterBar from '@/components/FilterBar/index.vue'
import Button from '@/components/Button/index.vue'
import Pagination from '@/components/Pagination/index.vue'
import TableContainer from '@/components/TableContainer/index.vue'
import StatusButton from '@/components/StatusButton/index.vue'
import FormDialog from './config-group/FormDialog.vue'
import { confirm } from '@/utils/messageBox'

export default {
  name: 'ConfigGroup',
  components: {
    Container,
    FilterBar,
    Button,
    Pagination,
    TableContainer,
    StatusButton,
    FormDialog
  },
  data() {
    return {
      loading: false,
      list: [],
      total: 0,
      params: {
        page: 1,
        psize: 20
      }
    }
  },
  created() {
    this.fetchList()
  },
  methods: {
    getParams() {
      return this.params
    },
    fetchList() {
      this.loading = true
      readConfigGroups(this.getParams()).then(res => {
        this.total = res.data.total
        this.list = res.data.data || []
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
      this.$refs.formDialog.open()
    },
    handleModifyStatus(index, id, status) {
      modifyConfigGroupStatus(id, {
        status: 1 - status
      }).then(() => {
        console.log('dd')
        this.list[index].status = 1 - status
      })
    },
    handleEdit(id) {
      this.$refs.formDialog.open(id)
    },
    handleDel(id) {
      confirm({
        message: '此操作将永久删除该记录, 是否继续?'
      }).then(() => {
        this.loading = true
        delConfig(id).then(() => {
          this.$message.success('删除成功')
          this.fetchList()
        }).catch(err => {
          console.log(err)
          this.loading = false
        })
      })
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
    onConfigGroupFromSubmit() {
      this.fetchList()
    }
  }
}
</script>
