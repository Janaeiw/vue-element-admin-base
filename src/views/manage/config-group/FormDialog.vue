<template>
  <el-dialog
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    :title="currentTitle"
    width="450px"
    :append-to-body="true"
    @close="onCloseDialog"
  >
    <el-form
      v-loading="loading"
      ref="form"
      :rules="rules"
      :model="form"
      label-width="70px"
      class="is-dialog"
    >
      <el-form-item label="名称" prop="title">
        <el-input v-model.trim="form.title" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item label="Key" prop="key">
        <el-input v-model.trim="form.key" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item label="Value" prop="value">
        <el-input v-model.trim="form.value" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio :label="1">开启</el-radio>
          <el-radio :label="0">关闭</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button :loading="loadingSubmit" type="primary" @click="handleSubmit">
        {{ loadingSubmit ? '保存中' : configGroupId === 0 ? '确 定' : '保 存' }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { createConfig, updateConfig, readConfig } from '@/api/config'
export default {
  name: 'FormDialog',
  data() {
    return {
      dialogFormVisible: false,
      loading: false,
      loadingSubmit: false,
      configGroupId: 0,
      form: {
        pid: 0,
        key: '',
        value: '',
        title: '',
        type: 6, // 固定为输入框
        status: 1
      },
      rules: {
        title: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        key: [{ required: true, message: '请输入变量名', trigger: 'blur' }],
        value: [{ required: true, message: '请输入变量值', trigger: 'blur' }]
      }
    }
  },
  computed: {
    currentTitle() {
      return this.configGroupId === 0 ? '添加配置组' : '编辑'
    },
    currentSuccessTips() {
      return this.configGroupId === 0 ? '添加成功' : '保存成功'
    }
  },
  methods: {
    open(id) {
      this.configGroupId = id || 0
      if (this.configGroupId) {
        this.loading = true
        readConfig(this.configGroupId).then((res) => {
          this.form.title = res.data.title
          this.form.key = res.data.key
          this.form.value = res.data.value
          this.form.status = res.data.status
          this.loading = false
        }).catch(err => {
          console.log(err)
          this.loading = false
        })
      }
      this.dialogFormVisible = true
    },
    onCloseDialog() {
      this.$refs.form.resetFields()
      this.configGroupId = 0
    },
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.saveConfigGroup()
        }
      })
    },
    async saveConfigGroup() {
      try {
        this.loadingSubmit = true
        if (this.configGroupId) {
          await updateConfig(this.configGroupId, this.form)
        } else {
          await createConfig(this.form)
        }
        this.$emit('submit')
        this.$message.success(this.currentSuccessTips)
        this.loadingSubmit = false
        this.dialogFormVisible = false
      } catch (err) {
        console.log(err)
        this.loadingSubmit = false
      }
    }
  }
}
</script>
