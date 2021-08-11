<template>
  <Container>
    <FilterBar>
      <el-form :inline="true" :model="params" class="form-inline">
        <el-form-item label="菜单：">
          <MenuCascader v-model="params.menu_id" />
        </el-form-item>
        <el-form-item>
          <Button type="search" @click="handleSearch" />
          <Button type="refresh" @click="handleReset" />
        </el-form-item>
        <el-form-item>
          <Button v-auth:create type="create" @click="handleAdd">添加配置</Button>
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
        <el-table-column label="ID" align="center" width="100px">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="名称" align="center">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="菜单名称" align="center">
          <template slot-scope="scope">
            {{ scope.row.menu_title }}
          </template>
        </el-table-column>
        <el-table-column label="接口地址" align="center">
          <template slot-scope="scope">
            {{ scope.row.api_url}}
          </template>
        </el-table-column>
        <el-table-column label="所属类型" align="center">
          <template slot-scope="scope">
            {{ scope.row.type | filterURLTypeTitle }}
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center">
          <template slot-scope="scope">
            {{ scope.row.desc}}
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
              @click="handleEdit(scope.row.id, scope.row)"
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
    <FormDialog ref="formDialog" @submit="onFormDialogSubmit" />
  </Container>
</template>

<script>
import { readAPIURLs, delAPIURL } from '@/api/api-url'
import Container from '@/components/Container/index.vue'
import FilterBar from '@/components/FilterBar/index.vue'
import Button from '@/components/Button/index.vue'
import Pagination from '@/components/Pagination/index.vue'
import TableContainer from '@/components/TableContainer/index.vue'
import FormDialog from './api-auth/FormDialog.vue'
import MenuCascader from '@/components/MenuCascader/index.vue'
import { confirm } from '@/utils/messageBox'

export default {
  name: 'ManageAPIAuth',
  components: {
    Container,
    FilterBar,
    Button,
    Pagination,
    TableContainer,
    FormDialog,
    MenuCascader
  },
  data() {
    return {
      loading: false,
      list: [],
      total: 0,
      params: {
        menu_id: -1,
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
      return {
        ...this.params,
        menu_id: this.params.menu_id === '' ? -1 : this.params.menu_id
      }
    },
    fetchList() {
      this.loading = true
      readAPIURLs(this.getParams()).then((res) => {
        this.loading = false
        this.list = res.data.data || []
        this.total = res.data.total || 0
      }).catch(err => {
        console.log(err)
        this.loading = false
      })
    },
    handleSearch() {
      this.params.page = 1
      this.fetchList()
    },
    handleReset() {
      this.params.menu_id = -1
      this.params.page = 1
      this.params.psize = 20
      this.total = 0
      this.fetchList()
    },
    handleAdd() {
      this.$refs.formDialog.open()
    },
    handleEdit(id, config) {
      this.$refs.formDialog.open(id)
    },
    handleDel(id) {
      confirm({
        message: '此操作将永久删除该记录, 是否继续?'
      }).then(() => {
        this.loading = true
        delAPIURL(id).then(() => {
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
    onFormDialogSubmit() {
      this.fetchList()
    }
  }
}
</script>
