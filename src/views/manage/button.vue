<template>
  <Container>
    <FilterBar>
      <el-form :inline="true" :model="params" class="form-inline">
        <el-form-item label="按钮类型：">
          <ButtonSelector v-model="params.map" />
        </el-form-item>
        <el-form-item label="菜单：">
          <MenuCascader v-model="params.menu_id" />
        </el-form-item>
        <el-form-item>
          <Button type="search" @click="handleSearch" />
          <Button type="refresh" @click="handleReset" />
        </el-form-item>
        <el-form-item>
          <Button v-auth:create type="create" @click="handleAdd">添加按钮</Button>
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
        <el-table-column label="ID" min-width="150px" align="center">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="按钮名称" align="center" min-width="150px">
          <template slot-scope="scope">
            {{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column label="菜单名称" align="center" min-width="150px">
          <template slot-scope="scope">
            {{ scope.row.menu_title }}
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
import { readButtons, delButton } from '@/api/button'
import Container from '@/components/Container/index.vue'
import FilterBar from '@/components/FilterBar/index.vue'
import Button from '@/components/Button/index.vue'
import Pagination from '@/components/Pagination/index.vue'
import TableContainer from '@/components/TableContainer/index.vue'
import FormDialog from './button/FormDialog.vue'
import ButtonSelector from './button/ButtonSelector.vue'
import MenuCascader from '@/components/MenuCascader/index.vue'
import { confirm } from '@/utils/messageBox'

export default {
  name: 'ManageButton',
  components: {
    Container,
    FilterBar,
    Button,
    Pagination,
    TableContainer,
    FormDialog,
    ButtonSelector,
    MenuCascader
  },
  data() {
    return {
      loading: false,
      list: [],
      total: 0,
      params: {
        map: '',
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
        menu_id: this.params.menu_id === '' ? -1 : this.params.menu_id,
        map: this.params.map || undefined
      }
    },
    fetchList() {
      this.loading = true
      readButtons(this.getParams()).then((res) => {
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
      this.params.map = ''
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
      this.$refs.formDialog.open(id, {
        name: config.name,
        status: config.status
      })
    },
    handleDel(id) {
      confirm({
        message: '此操作将永久删除该记录, 是否继续?'
      }).then(() => {
        this.loading = true
        delButton(id).then(() => {
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
