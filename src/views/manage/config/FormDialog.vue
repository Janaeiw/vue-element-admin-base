<template>
  <el-dialog
    :title="title"
    width="450px"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :append-to-body="true"
    @close="onCloseDialog"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="90px"
      class="is-dialog"
    >
      <el-form-item label="分组" prop="pid">
        <el-select
          :loading="group.loading"
          v-model="form.pid"
          placeholder="请选择分组"
          :popper-append-to-body="false"
          clearable
        >
          <el-option
            v-for="group in group.options"
            :key="group.id"
            :label="group.title"
            :value="group.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select
          v-model="form.type"
          placeholder="请选择类型"
          clearable
          :popper-append-to-body="false"
          @change="handleTypeChange"
        >
          <el-option
            v-for="type in types"
            :key="type.vars"
            :label="type.title"
            :value="type.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio :label="1">开启</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="变量名" prop="key">
        <el-input v-model.trim="form.key" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item label="变量标题" prop="title">
        <el-input v-model.trim="form.title" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item label="变量值" prop="value">
        <el-radio-group v-if="form.type === 1" v-model="form.value">
          <el-radio label="1">开</el-radio>
          <el-radio label="0">关</el-radio>
        </el-radio-group>
        <el-input
          v-else
          v-model.trim="form.value"
          autocomplete="off"
          clearable
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button
        type="primary"
        :loading="loadingSubmit"
        @click="handleSubmit('form')"
      >
        {{ loadingSubmit ? '保存中' : '确 定' }}
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { createConfig, readAllConfigGroups } from '@/api/config'
export default {
  name: 'FormDialog',
  props: {
    groups: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      title: '添加配置',
      dialogVisible: false,
      group: {
        loading: false,
        options: []
      },
      loadingSubmit: false,
      types: [
        {
          id: 6,
          title: '单行文本',
          vars: 'input_xxx_xxx'
        },
        {
          id: 4,
          title: '多行文本',
          vars: 'textarea_xxx_xxx'
        },
        {
          id: 5,
          title: '时间',
          vars: 'time_xxx_xxx'
        },
        {
          id: 1,
          title: '开关',
          vars: 'switch_xxx_xxx'
        },
        {
          id: 2,
          title: '下拉框',
          vars: 'select_xxx_xxx'
        },
        {
          id: 3,
          title: '单选框',
          vars: 'radio_xxx_xxx'
        }
      ],
      form: {
        pid: '',
        type: '',
        status: 1,
        key: '',
        title: '',
        value: ''
      },
      rules: {
        pid: [{ required: true, message: '请选择分组', trigger: 'change' }],
        type: [{ required: true, message: '请选择类型', trigger: 'change' }],
        status: [{ required: true, message: '请选择限制', trigger: 'change' }],
        key: [{ required: true, message: '请输入变量名', trigger: 'blur' }],
        title: [{ required: true, message: '请输入变量标题', trigger: 'blur' }],
        value: [{ required: true, message: '请输入变量值', trigger: 'blur' }]
      }
    }
  },
  methods: {
    open() {
      this.dialogVisible = true
      this.group.loading = true
      readAllConfigGroups().then(res => {
        this.group.options = res.data
        this.group.loading = false
      }).catch(err => {
        console.log(err)
        this.group.loading = false
      })
    },
    onCloseDialog() {
      this.$refs.form.resetFields()
    },
    handleTypeChange(value) {
      const list = this.types.filter((type) => {
        return type.id === value
      })
      if (list.length > 0) {
        this.form.key = list[0].vars
      } else {
        this.form.key = ''
      }
      if (value === 1) { // 开关
        this.form.value = '1'
      } else {
        this.form.value = ''
      }
    },
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loadingSubmit = true
          createConfig(this.form).then(() => {
            this.$emit('submit', this.form.pid)
            this.loadingSubmit = false
            this.dialogVisible = false
          }).catch(err => {
            console.log(err)
            this.loadingSubmit = false
          })
        }
      })
    }
  }
}
</script>
