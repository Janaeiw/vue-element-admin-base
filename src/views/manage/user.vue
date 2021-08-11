<template>
  <Container>
    <FilterBar>
      <el-form :inline="true" :model="params" class="form-inline">
        <el-form-item label="用户名：">
          <el-input
            v-model.trim="params.username"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <el-form-item label="姓名：">
          <el-input
            v-model.trim="params.real_name"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <Button type="search" @click="handleSearch" />
        </el-form-item>
        <el-form-item>
          <Button v-auth:create type="create" @click="handleAdd">添加用户</Button>
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
        <el-table-column label="用户名" min-width="110px" align="center">
          <template slot-scope="scope">{{ scope.row.username }}</template>
        </el-table-column>
        <el-table-column label="姓名" min-width="110px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.real_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="所属部门" width="150px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.department_name || '' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="本系统角色" min-width="150px" align="center">
          <template slot-scope="scope">
            <el-tooltip v-if="scope.row.group.length > 2" class="item" effect="light" placement="top">
              <div slot="content" v-html="scope.row.group_name_more"></div>
              <span v-html="scope.row.group_name" />
            </el-tooltip>
            <span v-else v-html="scope.row.group_name" />
          </template>
        </el-table-column>
        <el-table-column label="登录时间" width="160px" align="center">
          <template slot-scope="scope">
            {{ scope.row.login_time | filterFormatDateOfTable }}
          </template>
        </el-table-column>
        <el-table-column label="注册时间" width="160px" align="center">
          <template slot-scope="scope">
            {{ scope.row.created_at | filterFormatDateOfTable }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="110px" align="center">
          <template slot-scope="scope">
            <StatusButton
              v-auth:change-status
              :status="scope.row.status"
              @click="handleModifyStatus(scope.row, scope.row.id, scope.row.status)"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="120px"
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

    <FormDialog ref="fromAdmin" @submit="handleRefreshList" />
  </Container>
</template>

<script>
import { readUsers, delUser, modifyUserStatus } from '@/api/user'
import Container from '@/components/Container/index.vue'
import FilterBar from '@/components/FilterBar/index.vue'
import Button from '@/components/Button/index.vue'
import Pagination from '@/components/Pagination/index.vue'
import StatusButton from '@/components/StatusButton/index.vue'
import TableContainer from '@/components/TableContainer/index.vue'
import FormDialog from './user/FormDialog'
import { confirm } from '@/utils/messageBox'

export default {
  name: 'ManageUser',
  components: {
    Container,
    FilterBar,
    Button,
    Pagination,
    TableContainer,
    FormDialog,
    StatusButton
  },
  data() {
    return {
      list: [],
      loading: true,
      params: {
        type: -1,
        page: 1,
        psize: 20,
        username: '',
        real_name: ''
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
      readUsers(this.params).then((res) => {
        this.list = res.data.data.map((item) => {
          const groups = item.group.map((_item) => {
            return _item.group_title
          })
          item.group_name_more = groups.join('<br/>')
          item.group_name = groups.splice(0, 2).join('<br/>')
          if (item.group.length > 2) {
            item.group_name += '<br>...'
          }
          return item
        })
        this.total = res.data.total
        this.loading = false
      }, () => {
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
    handleModifyStatus(row, id, status) {
      modifyUserStatus(id, {
        status: 1 - status
      }).then(() => {
        row.status = 1 - status
      })
    },
    handleAdd() {
      this.$refs.fromAdmin.open()
    },
    handleUpdate(id) {
      this.$refs.fromAdmin.open(id)
    },
    handleRefreshList() {
      this.fetchList()
    },
    handleDel(id) {
      confirm({
        message: '此操作将永久删除该记录, 是否继续?'
      }).then(() => {
        this.loading = true
        delUser(id).then(() => {
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
