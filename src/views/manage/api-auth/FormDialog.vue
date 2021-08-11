<template>
  <el-dialog
    ref="dialog"
    :title="currentTitle"
    width="450px"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :append-to-body="true"
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
      <el-form-item label="名称：" prop="name">
        <el-input v-model.trim="form.name" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item label="菜单：" prop="menu_id">
        <MenuCascader v-model="form.menu_id" />
      </el-form-item>
      <el-form-item label="接口地址：" prop="api_url">
        <el-input v-model.trim="form.api_url" autocomplete="off" placeholder="api/user/POST" clearable />
      </el-form-item>
      <el-form-item label="所属类型：" prop="type">
        <URLTypeSelector v-model="form.type" />
      </el-form-item>
      <el-form-item label="备注：" prop="desc">
        <el-input v-model.trim="form.desc" type="textarea" clearable />
      </el-form-item>
    </el-form>
    <div slot="footer" v-loading="loading" element-loading-spinner=" ">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button
        :loading="loadingSubmit"
        :disabled="loading"
        type="primary"
        @click="handleSubmit"
      >
        {{ loadingSubmit ? '保存中' : apiURLId === 0 ? '确 定' : '保 存' }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { readAPIURL, createAPIURL, updateAPIURL } from '@/api/api-url'
import URLTypeSelector from './URLTypeSelector.vue'
import MenuCascader from '@/components/MenuCascader/index.vue'
export default {
  name: 'FormDialog',
  components: {
    URLTypeSelector,
    MenuCascader
  },
  data() {
    return {
      dialogVisible: false,
      loading: false,
      loadingSubmit: false,
      apiURLId: 0,
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择配置类型', trigger: 'change' }],
        menu_id: [{ required: true, message: '请选择菜单', trigger: 'change' }],
        api_url: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请输入请求URL'))
              } else if (!/(^[a-z])[A-Za-z0-9_-]{0,}(\/[A-Za-z0-9_-]+){1,}\/(POST|PUT|DELETE|GET)$/.test(value)) {
                callback(new Error('请输入正确的请求URL'))
              } else {
                callback()
              }
            }
          }
        ]
      },
      form: {
        name: '',
        type: '',
        menu_id: '',
        api_url: '',
        desc: ''
      }
    }
  },
  computed: {
    currentTitle() {
      return this.apiURLId === 0 ? '添加配置' : '编辑配置'
    },
    currentSuccessTips() {
      return this.apiURLId === 0 ? '添加成功' : '保存成功'
    }
  },
  methods: {
    open(id) {
      this.apiURLId = id || 0
      this.dialogVisible = true
      if (this.apiURLId) {
        this.loading = true
        readAPIURL(this.apiURLId).then(res => {
          this.loading = false
          this.form.name = res.data.name
          this.form.type = res.data.type
          this.form.menu_id = res.data.menu_id
          this.form.api_url = res.data.api_url
          this.form.desc = res.data.desc
        }).catch(err => {
          console.log(err)
          this.loading = false
        })
      }
    },
    onCloseDialog() {
      this.loading = false
      this.loadingSubmit = false
      this.$refs.form.resetFields()
    },
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.saveButton()
        }
      })
    },
    async saveButton() {
      try {
        this.loadingSubmit = true
        const params = {
          name: this.form.name,
          menu_id: this.form.menu_id,
          api_url: this.form.api_url,
          type: this.form.type,
          desc: this.form.desc,
          status: 1
        }
        if (this.apiURLId) {
          await updateAPIURL(this.apiURLId, params)
        } else {
          await createAPIURL(params)
        }
        this.$emit('submit')
        this.dialogVisible = false
        this.loadingSubmit = false
        this.$message.success('保存成功')
      } catch (err) {
        console.log(err)
        this.loadingSubmit = false
      }
    }
  }
}
</script>
