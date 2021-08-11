<template>
  <el-dialog
    ref="dialog"
    :title="currentTitle"
    width="500px"
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
      label-width="150px"
      class="is-dialog"
    >
      <el-form-item label="按钮类型" prop="map">
        <ButtonSelector v-model="form.map" />
      </el-form-item>
      <el-form-item label="菜单" prop="menu_id">
        <MenuCascader v-model="form.menu_id" />
      </el-form-item>
      <el-form-item label="所属接口权限配置" prop="api_url_id">
        <APIAuthCascader v-if="!loading" ref="apiAuthCascader" v-model="form.api_url_id" />
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
        {{ loadingSubmit ? '保存中' : buttonId === 0 ? '确 定' : '保 存' }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { readButton, createButton, updateButton } from '@/api/button'
import ButtonSelector from './ButtonSelector.vue'
import MenuCascader from '@/components/MenuCascader/index.vue'
import APIAuthCascader from './APIAuthCascader.vue'

export default {
  name: 'FormDialog',
  components: {
    ButtonSelector,
    MenuCascader,
    APIAuthCascader
  },
  data() {
    return {
      dialogVisible: false,
      loading: false,
      loadingSubmit: false,
      buttonId: 0,
      rules: {
        map: [
          {
            required: true,
            message: '请选择按钮类型',
            trigger: 'change'
          }
        ],
        menu_id: [
          {
            required: true,
            message: '请选择菜单',
            trigger: 'change'
          }
        ],
        api_url_id: [
          {
            required: true,
            message: '请选择接口权限配置',
            trigger: 'change'
          }
        ]
      },
      form: {
        map: '',
        menu_id: '',
        api_url_id: ''
      }
    }
  },
  computed: {
    currentTitle() {
      return this.buttonId === 0 ? '添加按钮' : '编辑按钮'
    },
    currentSuccessTips() {
      return this.buttonId === 0 ? '添加成功' : '保存成功'
    }
  },
  methods: {
    open(id) {
      this.buttonId = id || 0
      this.dialogVisible = true
      if (this.buttonId) {
        this.loading = true
        readButton(this.buttonId).then(res => {
          this.loading = false
          this.form.map = res.data.map.toLocaleLowerCase()
          this.form.menu_id = res.data.menu_id
          this.form.api_url_id = res.data.api_url_id
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
          menu_id: this.form.menu_id,
          map: this.form.map,
          api_url_id: this.form.api_url_id,
          status: 1
        }
        if (this.buttonId) {
          await updateButton(this.buttonId, params)
        } else {
          await createButton(params)
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

<style lang="scss" scoped>
.is-dialog {
  .el-select, .el-cascader {
    width: 80% !important;
  }
}
</style>
