<template>
  <Container>
    <FilterBar>
      <el-form :inline="true">
        <el-form-item>
          <Button type="refresh" @click="handleReset">刷新</Button>
          <Button v-auth:create type="create" @click="handleAdd">添加配置</Button>
        </el-form-item>
      </el-form>
    </FilterBar>
    <ExplainPanel>
      <strong>描述说明</strong>
      <ol>
        <li>
          白名单IP 列表有多个时，变量值以英文逗号 , 分割，如
          127.0.0.1,192.168.1.1
        </li>
        <li>
          添加时间类型变量值填写的开始时间和结束时间之间用英文逗号隔开，如
          2018-02-20 23:23:23,2018-02-20 23:23:29
        </li>
        <li>
          添加下拉框或单选框类型时，需要添加多个选项，每个选项包括 label、value
          和 checked 三个属性，其中 checked 属性为选中该选项，完整格式如下<br/>
          [{"label": "选项1的名称", "value": "选项1的值", "checked": true}, {"label":
          "选项2的名称","value": "选项2的值", "checked": false}]
        </li>
        <li>
          变量名格式如下
          <ul>
            <li>单行文本类型：input_xxx_xxx</li>
            <li>多行文本类型：textarea_xxx_xxx</li>
            <li>时间类型：time_xxx_xxx</li>
            <li>开关类型：switch_xxx_xxx</li>
            <li>下拉框类型：select_xxx_xxx</li>
            <li>单选框类型：radio_xxx_xxx</li>
          </ul>
        </li>
      </ol>
    </ExplainPanel>
    <div v-loading="loading" v-auth:edit="'area'" class="flex flex-column flex-1">
      <el-tabs v-model="config" class="config__tabs">
        <el-tab-pane
          v-for="item in configsTabs"
          :key="item.key"
          :label="item.title"
          :name="item.key"
        />
      </el-tabs>
      <div
        v-if="currentConfigs && currentConfigs.config"
      >
        <el-form
          ref="configForm"
          :model="currentConfigs"
        >
          <el-table
            :data="filterDelConfigs(currentConfigs.config)"
            stripe
            style="width: 100%"
          >
            <el-table-column
              label="变量标题（变量名）"
              width="400"
              align="center"
            >
              <template slot-scope="scope">
                {{ scope.row.title }}（{{ scope.row.key }}）
              </template>
            </el-table-column>
            <el-table-column
              prop="value"
              label="变量值"
              align="center"
              min-width="180"
            >
              <template slot-scope="scope">
                <el-form-item
                  :key="scope.row.key"
                  :rules="configRule"
                  :prop="'config.' + scope.$index + '.value'"
                  style="margin-bottom: 0"
                >
                  <el-switch
                    v-if="scope.row.type === 1"
                    active-value="1"
                    inactive-value="0"
                    v-model="scope.row.value"
                    @change="onFormChange(scope.row)"
                  />
                  <el-select
                    v-if="scope.row.type === 2"
                    v-model="scope.row.value"
                    clearable
                    :popper-append-to-body="false"
                    @change="onFormChange(scope.row)"
                  >
                    <el-option
                      v-for="item in scope.row.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                  <el-radio-group
                    v-if="scope.row.type === 3"
                    v-model="scope.row.value"
                    @change="onFormChange(scope.row)"
                  >
                    <el-radio
                      v-for="item in scope.row.options"
                      :key="item.value"
                      :label="item.value"
                    >
                      {{ item.label }}
                    </el-radio>
                  </el-radio-group>
                  <el-input
                    v-if="scope.row.type === 4"
                    type="textarea"
                    v-model="scope.row.value"
                    clearable
                    @change="onFormChange(scope.row)"
                  />
                  <DatePicker
                    v-if="scope.row.type === 5"
                    type="datetimerange"
                    :start.sync="scope.row.start_time"
                    :end.sync="scope.row.end_time"
                    format="yyyy-MM-dd HH:mm:ss"
                    width="400px"
                    @change="onFormChange(scope.row)"
                  />
                  <el-input
                    v-if="scope.row.type === 6"
                    v-model="scope.row.value"
                    clearable
                    @change="onFormChange(scope.row)"
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="禁用" width="150" align="center">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.status"
                  :active-value="0"
                  :inactive-value="1"
                  @change="onFormChange(scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="150"
              align="center"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                  title="点击删除"
                  type="text"
                  @click="handleDelConfig(scope.row, scope.$index)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
        <div class="mt-15 tx-c">
          <el-button
            v-auth:edit
            type="primary"
            style="width: 180px"
            :disabled="isDisableSubmit"
            @click="handleSubmit('configForm')"
          >
            保 存
          </el-button>
        </div>
      </div>
      <Default v-else />
    </div>
    <FormDialog
      ref="configFormDialog"
      :groups="currentGroups"
      @submit="onConfigFormSubmit"
    />
  </Container>
</template>

<script>
import { readConfigsTree, updateConfigs, delConfigs } from '@/api/config'
import Container from '@/components/Container/index.vue'
import DatePicker from '@/components/DatePicker/index.vue'
import FilterBar from '@/components/FilterBar/index.vue'
import Button from '@/components/Button/index.vue'
import ExplainPanel from '@/components/ExplainPanel/index.vue'
import Default from '@/components/Default/index.vue'
import FormDialog from './config/FormDialog'

export default {
  name: 'ManageConfig',
  components: {
    Container,
    DatePicker,
    FilterBar,
    Button,
    ExplainPanel,
    Default,
    FormDialog
  },
  data() {
    return {
      loading: false,
      config: '',
      configs: [],
      configRule: [
        { required: true, message: '请输入配置值', trigger: 'blur' }
      ],
      cache: {
        updateIdsList: [],
        delIdsList: []
      }
    }
  },
  computed: {
    configsTabs() {
      return this.configs.filter((item) => {
        return item.config.length > 0
      })
    },
    currentGroups() {
      if (this.configs.length > 0) {
        return this.configs.map(({ id, value }) => {
          return {
            id,
            title: value
          }
        })
      } else {
        return []
      }
    },
    currentConfigs() {
      if (this.configs.length > 0) {
        return this.configs.filter((item) => {
          return item.key === this.config
        })[0]
      } else {
        return {}
      }
    },
    isDisableSubmit() {
      return (
        this.cache.updateIdsList.length === 0 &&
        this.cache.delIdsList.length === 0
      )
    }
  },
  created() {
    this.fetchConfigs()
  },
  methods: {
    fetchConfigs() {
      const lastConfig = this.config
      this.config = ''
      this.cache.updateIdsList = []
      this.cache.delIdsList = []
      this.configs = []
      this.loading = true
      return readConfigsTree()
        .then((res) => {
          const data = res.data || []
          data.forEach((groups) => {
            groups.config.forEach((item) => {
              delete item.config
              if (item.type === 2 || item.type === 3) { // 处理下拉框和单选框选项问题
                try {
                  item.value = JSON.parse(item.value)
                  let value = ''
                  if (item.value.length > 0) {
                    item.options = item.value
                    item.value.forEach((opt) => {
                      if (opt.checked) {
                        value = opt.value
                      }
                    })
                    item.value = value
                  }
                } catch (error) {
                  console.log(error)
                }
              } else if (item.type === 5) {
                const time = item.value.split(',')
                if (time.length > 1) {
                  item.start_time = time[0]
                  item.end_time = time[1]
                }
              }
            })
          })
          this.configs = data
          if (this.configs.length > 0) {
            const hasData = this.configs.some(item => item.key === lastConfig && item.config.length > 0)
            if (hasData) {
              this.config = lastConfig
            } else {
              const item = this.configs.find(item => item.config.length > 0)
              if (item) {
                this.config = item.key
              }
            }
          }
          this.loading = false
        }).catch(err => {
          console.log(err)
          this.loading = false
        })
    },
    filterDelConfigs(configs) {
      return configs.filter(item => {
        return !this.cache.delIdsList.includes(item.id)
      })
    },
    handleReset() {
      this.fetchConfigs()
    },
    handleAdd() {
      this.$refs.configFormDialog.open()
    },
    onConfigFormSubmit(pid) {
      this.config = this.configs.find(item => item.id === pid).key || '' // 新增时切换到新增的配置组
      this.fetchConfigs()
    },
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          Promise.all([this.fetchDelConfigs(), this.fetchUpdateConfigs()]).then(
            () => {
              this.$message.success('保存成功')
              this.fetchConfigs()
            }
          )
        }
      })
    },
    fetchDelConfigs() {
      if (this.cache.delIdsList.length > 0) {
        return delConfigs(this.cache.delIdsList.join(','))
      } else {
        return Promise.resolve()
      }
    },
    fetchUpdateConfigs() {
      const list = this.currentConfigs.config.filter((item) => {
        return this.cache.updateIdsList.includes(item.id)
      })
      // console.log(list)
      if (list.length > 0) {
        return updateConfigs({
          data: JSON.stringify(list)
        })
      } else {
        return Promise.resolve()
      }
    },
    onFormChange(data) {
      if (data.type === 5) { // 日期类型
        data.value = `${data.start},${data.end}`
      }
      if (!this.cache.updateIdsList.includes(data.id)) {
        this.cache.updateIdsList.push(data.id)
        // console.log(this.cache.updateIdsList)
      }
    },
    handleDelConfig(data, index) {
      this.cache.delIdsList.push(data.id)
      this.currentConfigs.config.splice(index, 1)
      const item = this.configsTabs.find(item => item.key === this.config)
      if (!item && this.configsTabs.length > 0) {
        this.config = this.configsTabs[0].key
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.config__tabs {
  margin-top: 15px;
  margin-bottom: 10px;
  /deep/ {
    .el-tabs__item {
      min-width: 100px;
      text-align: center;
    }
  }
}
</style>
