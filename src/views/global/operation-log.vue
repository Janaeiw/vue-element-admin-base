<template>
  <Container>
    <FilterBar>
      <el-form :inline="true" :model="params" class="demo-form-inline">
        <el-form-item label="操作人：">
          <el-input v-model.trim="params.name" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="操作日期：">
          <DatePicker :start.sync="params.start_time" :end.sync="params.end_time" />
        </el-form-item>
        <el-form-item>
          <Button type="search" @click="handleSearch" />
          <Button type="refresh" @click="handleReset" />
        </el-form-item>
        <el-form-item>
          <Button v-auth:export type="export" @click="handleExport" />
        </el-form-item>
      </el-form>
    </FilterBar>
    <TableContainer
      :loading="loading"
      :show-default="list.length === 0"
    >
      <el-table
        ref="table"
        :data="list"
        stripe
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          align="center"
          width="55"
          fixed
        />
        <el-table-column label="序号" align="center" width="55" fixed>
          <template slot-scope="scope">
            {{ scope.$index | filterForamtSerialNumber(params.page, params.psize) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="操作人"
          align="center"
          min-width="200"
        />
        <el-table-column
          prop="msg"
          label="操作动作"
          align="center"
          min-width="200"
        />
        <el-table-column
          prop="sys_user"
          label="操作对象"
          header-align="center"
          min-width="400"
        >
          <template v-if="scope.row.data" slot-scope="scope">
            <div
              class="json-viewer-container"
              @click="handleOpenJsonViewer($event, scope.column, scope.$index)"
            >
              <json-viewer
                v-if="!loading"
                :value="scope.row.data.sys_user | filterObjectJSON"
                copyable
                :expand-depth="0"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="ip"
          label="操作IP"
          align="center"
          min-width="200"
        />
        <el-table-column
          prop="created_at"
          label="操作时间"
          align="center"
          min-width="200"
        >
          <template slot-scope="scope">
            {{ scope.row.created_at | filterFormatDateOfTable }}
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
  </Container>
</template>

<script>
import { readLogs, exportLogs } from '@/api/log'
import Container from '@/components/Container/index.vue'
import JsonViewer from 'vue-json-viewer'
import download from '@/utils/download'
import FilterBar from '@/components/FilterBar/index.vue'
import DatePicker from '@/components/DatePicker/index.vue'
import Button from '@/components/Button/index.vue'
import Pagination from '@/components/Pagination/index.vue'
import TableContainer from '@/components/TableContainer/index.vue'

export default {
  name: 'GlobalOperationLog',
  components: {
    Container,
    FilterBar,
    DatePicker,
    JsonViewer,
    Button,
    Pagination,
    TableContainer
  },
  filters: {
    filterObjectJSON(value) {
      if (typeof value === 'object') {
        return value
      }
      return {}
    }
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
      list: [],
      selectedList: []
    }
  },
  created() {
    this.fetchLogList()
  },
  methods: {
    async fetchLogList() {
      if (this.list.length > 0) {
        this.$nextTick(() => {
          this.$refs.table.$refs.fixedBodyWrapper.querySelectorAll('tr').forEach((item) => {
            item.style.height = 'unset'
          })
        })
      }
      this.loading = true
      readLogs(this.params).then((res) => {
        this.list = res.data.data || []
        this.total = res.data.total || 0
        this.loading = false
      }).catch(err => {
        console.log(err)
        this.loading = false
      })
    },
    handleSearch() {
      this.params.page = 1
      this.fetchLogList()
    },
    handleReset() {
      this.params.name = ''
      this.params.start_time = ''
      this.params.end_time = ''
      this.params.page = 1
      this.params.psize = 20
      this.total = 0
      this.fetchLogList()
    },
    handleExport() { // 导出
      const params = {}
      const selectedIdsList = this.selectedList.map((item) => {
        return item.id
      })
      if (selectedIdsList.length === 0) {
        params.name = this.params.name
        params.start_time = this.params.start_time
        params.end_time = this.params.end_time
      } else {
        params.ids = selectedIdsList.join(',')
      }
      exportLogs(params).then((res) => {
        download(res)
      })
    },
    handleSelectionChange(selectedList) {
      this.selectedList = selectedList
    },
    handleOpenJsonViewer(e, column, index) {
      this.$nextTick(() => {
        try { // 同步固定列中的行高度
          const item = this.$refs.table.$refs.bodyWrapper.querySelectorAll('tr')[index]
          if (item) {
            const height = item.offsetHeight
            this.$refs.table.$refs.fixedBodyWrapper.querySelectorAll('tr')[index].style.height = `${height}px`
          }
        } catch (err) {
          console.log(err)
        }
      })
    },
    onSizeChange(size) {
      this.params.page = 1
      this.params.psize = size
      this.fetchLogList()
    },
    onCurrentChange(page) {
      this.params.page = page
      this.fetchLogList()
    }
  }
}
</script>

<style lang="scss" scoped>
.json-viewer-container {
  /deep/ {
    .jv-container {
      &.jv-light {
        background-color: transparent;
      }
      .jv-tooltip {
        right: 0;
        top: 0;
      }
      .jv-code {
        padding: 0;
      }
      .jv-button {
        padding: 0;
      }
    }
  }
}
</style>
