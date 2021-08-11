<template>
  <Container>
    <FilterBar>
      <el-form :inline="true">
        <el-form-item>
          <Button type="refresh" @click="handleReset">刷新</Button>
          <Button v-auth:create type="create" @click="handleAdd">添加部门</Button>
        </el-form-item>
      </el-form>
    </FilterBar>
    <TableContainer
      :loading="loading"
      :show-default="getRulesList.length === 0"
    >
      <tree-table
        :data="getRulesList"
        :expand-all="true"
        :columns="columns"
        fit
        highlight-current-row
      >
        <el-table-column label="负责人" min-width="100px" align="center">
          <template slot-scope="scope">{{ scope.row.person }}</template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          min-width="120px"
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
    <FormDialog ref="fromRules" @submit="handleReset" />
  </Container>
</template>
<script>
import { readAllDepartments, delDepartment } from '@/api/department'
import Container from '@/components/Container/index.vue'
import FilterBar from '@/components/FilterBar/index.vue'
import Button from '@/components/Button/index.vue'
import TableContainer from '@/components/TableContainer/index.vue'
import FormDialog from './department/FormDialog'
import { confirm } from '@/utils/messageBox'
import tree from '@/utils/tree'
import treeTable from '@/components/TreeTable'

export default {
  name: 'ManageDepartment',
  components: {
    Container,
    FilterBar,
    Button,
    TableContainer,
    FormDialog,
    treeTable
  },
  data() {
    return {
      list: [],
      loading: true,
      columns: [
        {
          text: '名称',
          value: 'name',
          minWidth: '200'
        }
      ],
      dialogTitle: ''
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
      readAllDepartments({
        pid: -1
      }).then((res) => {
        this.list = res.data
        this.loading = false
      }).catch(err => {
        console.log(err)
        this.loading = false
      })
    },
    handleAdd() {
      this.$refs.fromRules.open()
    },
    handleUpdate(id) {
      this.$refs.fromRules.open(id)
    },
    handleReset() {
      this.fetchList()
    },
    handleDelete(id) {
      confirm({
        message: '此操作将永久删除该记录, 是否继续?'
      }).then(() => {
        this.loading = true
        delDepartment(id).then(() => {
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
