<template>
  <Container>
    <FilterBar>
      <el-form :inline="true" :model="params">
        <el-form-item label="平台：">
          <el-input v-model.trim="params.name" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="添加日期：">
          <DatePicker :start.sync="params.start_time" :end.sync="params.end_time" />
        </el-form-item>
        <el-form-item>
          <Button type="search" @click="handleSearch" />
          <Button type="refresh" @click="handleReset" />
        </el-form-item>
        <el-form-item>
          <Button v-auth:create type="create" @click="handleAdd">添加平台</Button>
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
        tooltip-effect="dark"
      >
        <el-table-column label="序号" align="center" min-width="70" fixed>
          <template slot-scope="scope">
            {{ scope.$index | filterForamtSerialNumber(params.page, params.psize) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="平台"
          align="center"
          min-width="200"
        />
        <el-table-column
          label="备注"
          align="center"
          min-width="200"
        >
          <template slot-scope="scope">
            <TextTooltip :content="scope.row.desc" />
          </template>
        </el-table-column>
        <el-table-column
          prop="appid"
          label="APPID"
          align="center"
          min-width="150"
        />
        <el-table-column
          prop="key"
          label="AppKey"
          align="center"
          min-width="150"
        />
        <el-table-column label="AppSecret" align="center" min-width="400">
          <template slot-scope="scope">
            {{ scope.row.secret }}
            <i
              title="点击刷新AppSecret"
              class="el-icon-refresh secret-btn"
              @click="handleUpdateSecret(scope.row.id)"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="created_at"
          label="添加时间"
          align="center"
          min-width="200"
        >
          <template slot-scope="scope">
            {{ scope.row.created_at | filterFormatDateOfTable }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120" fixed="right">
          <template slot-scope="scope">
            <el-button v-auth:edit type="text" @click="handleEditPlatform(scope.row.id)">
              编辑
            </el-button>
            <el-button v-auth:delete type="text" @click="handleDel(scope.row.id)">
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
    <PlatformFormDialog ref="platformFormDialog" @submit="handleRefreshList" />
    <SecretFormDialog ref="secretFormDialog" @submit="handleRefreshList" />
  </Container>
</template>

<script>
import { readPlatforms, delPlatform } from '@/api/platform'
import { confirm } from '@/utils/messageBox'
import Container from '@/components/Container/index.vue'
import FilterBar from '@/components/FilterBar/index.vue'
import DatePicker from '@/components/DatePicker/index.vue'
import Button from '@/components/Button/index.vue'
import Pagination from '@/components/Pagination/index.vue'
import TableContainer from '@/components/TableContainer/index.vue'
import TextTooltip from '@/components/TextTooltip/index.vue'
import PlatformFormDialog from './platform/FormDialog.vue'
import SecretFormDialog from './platform/SecretFormDialog.vue'

export default {
  name: 'GlobalPlatform',
  components: {
    Container,
    FilterBar,
    DatePicker,
    Button,
    Pagination,
    TableContainer,
    TextTooltip,
    PlatformFormDialog,
    SecretFormDialog
  },
  data() {
    return {
      loading: false,
      params: {
        name: '',
        start_time: '',
        end_time: '',
        page: 1,
        psize: 20
      },
      total: 0,
      list: []
    }
  },
  created() {
    this.fetchList()
  },
  methods: {
    async fetchList() {
      this.loading = true
      readPlatforms(this.getParams())
        .then((res) => {
          this.list = res.data.data || []
          this.total = res.data.total || 0
          this.loading = false
        }).catch(err => {
          console.log(err)
          this.loading = false
        })
    },
    getParams() {
      return this.params
    },
    resetParms() {
      this.date = []
      this.params.name = ''
      this.params.start_time = ''
      this.params.end_time = ''
      this.params.page = 1
      this.params.psize = 20
      this.total = 0
    },
    handleSearch() {
      this.params.page = 1
      this.fetchList()
    },
    handleRefreshList(id) {
      if (!id) {
        this.resetParms()
      }
      this.fetchList()
    },
    handleReset() {
      this.resetParms()
      this.fetchList()
    },
    handleAdd() {
      this.$refs.platformFormDialog.open()
    },
    handleEditPlatform(platformId) {
      this.$refs.platformFormDialog.open(platformId)
    },
    handleDel(platformId) {
      confirm({
        message: '是否确认将该平台删除?',
        forever: true
      }).then(() => {
        this.loading = true
        delPlatform(platformId).then(() => {
          this.$message.success('删除成功')
          this.fetchList()
        }).catch(err => {
          console.log(err)
          this.loading = false
        })
      })
    },
    onSizeChange(size) {
      this.params.page = 1
      this.params.psize = size
      this.fetchList()
    },
    onCurrentChange(page) {
      this.params.page = page
      this.fetchList()
    },
    handleUpdateSecret(platformId) {
      this.$refs.secretFormDialog.open(platformId)
    }
  }
}
</script>

<style lang="scss" scoped>
.secret-btn {
  vertical-align: middle;
  font-size: 16px;
  font-weight: bold;
  color: #409eff;
  &:hover {
    cursor: pointer;
  }
}
</style>
