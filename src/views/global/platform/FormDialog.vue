<template>
  <el-dialog
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    :append-to-body="true"
    :title="currentTitle"
    width="450px"
    @close="onCloseDialog"
  >
    <el-form
      ref="form"
      v-loading="loading"
      :rules="rules"
      :model="form"
      label-width="95px"
      class="is-dialog"
    >
      <el-form-item label="平台名称：" prop="name">
        <el-input
          v-model.trim="form.name"
          maxlength="10"
          show-word-limit
          clearable
        />
      </el-form-item>
      <el-form-item label="AppKey：" prop="key">
        <el-input
          v-model="form.key"
          maxlength="50"
          show-word-limit
          clearable
        />
      </el-form-item>
      <el-form-item label="备注：" prop="desc">
        <el-input
          v-model.trim="form.desc"
          type="textarea"
          maxlength="200"
          show-word-limit
          clearable
        />
      </el-form-item>
    </el-form>
    <div
      slot="footer"
      v-loading="loading"
      class="dialog-footer"
      element-loading-spinner=" "
    >
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button
        :loading="loadingSubmit"
        :disabled="loading"
        type="primary"
        @click="handleSubmit"
      >
        {{
          loadingSubmit ? '保存中' : this.platformId === 0 ? '确 定' : '保 存'
        }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { createPlatform, readPlatform, updatePlatform } from '@/api/platform'
export default {
  name: 'PlatformForm',
  data() {
    return {
      dialogFormVisible: false,
      loading: false,
      loadingSubmit: false,
      platformId: 0,
      form: {
        name: '',
        key: '',
        desc: ''
      },
      rules: {
        name: [{ required: true, message: '请输入平台名称', trigger: 'blur' }],
        key: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请输入AppKey'))
              } else if (!/^[a-zA-Z_]{10,50}$/.test(value)) {
                callback(
                  new Error('AppKey 必须是由字母或下划线组成，长度10-50位')
                )
              } else {
                callback()
              }
            }
          }
        ]
      }
    }
  },
  computed: {
    currentTitle() {
      return this.platformId === 0 ? '添加平台' : '编辑'
    },
    currentSuccessTips() {
      return this.platformId === 0 ? '添加成功' : '保存成功'
    }
  },
  methods: {
    open(id) {
      this.platformId = id || 0
      if (this.platformId) {
        this.loading = true
        readPlatform(id).then((res) => {
          this.loading = false
          this.form.name = res.data.name
          this.form.key = res.data.key
          this.form.desc = res.data.desc
        }).catch(err => {
          consle.log(err)
	  this.loading = false
	})
      }
      this.dialogFormVisible = true
    },
    onCloseDialog() {
      this.platformId = 0
      this.loading = false
      this.loadingSubmit = false
      this.$refs.form.resetFields()
    },
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.savePlatform()
        }
      })
    },
    getParams() {
      return {
        name: this.form.name,
        key: this.form.key,
        desc: this.form.desc || undefined
      }
    },
    async savePlatform() {
      try {
        this.loadingSubmit = true
        if (this.platformId) {
          await updatePlatform(this.platformId, this.getParams())
        } else {
          await createPlatform(this.getParams())
        }
        this.$emit('submit', this.platformId)
        this.dialogFormVisible = false
        this.loadingSubmit = false
        this.$message.success(this.currentSuccessTips)
      } catch (err) {
        console.log(err)
        this.loadingSubmit = false
      }
    }
  }
}
</script>
