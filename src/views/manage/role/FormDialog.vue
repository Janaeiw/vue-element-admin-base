<template>
  <el-dialog
    :title="currentTitle"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :append-to-body="true"
    width="600px"
    @close="onCloseDialog"
  >
    <el-form
      v-loading="loading"
      ref="form"
      :model="form"
      :rules="rules"
      label-width="95px"
      class="is-dialog"
    >
      <el-form-item label="角色名称：" prop="name">
        <Input
          v-model.trim="form.name"
          reg="\s+"
          maxlength="10"
	        show-word-limit
          clearable
          placeholder="请输入"
          style="max-width: 200px"
        />
      </el-form-item>
      <el-form-item label="备注说明：" prop="desc">
        <el-input
          type="textarea"
          v-model.trim="form.desc"
          maxlength="200"
          show-word-limit
          clearable
          placeholder="请输入内容"
        />
      </el-form-item>
      <el-row>
        <el-col :md="14" :xs="24">
          <el-form-item label="功能授权：" prop="rules">
            <MenuTree
              v-if="dialogVisible"
              ref="menuTree"
              is-slot
              v-model="form.rules"
              :buttonIds.sync="form.buttons"
            />
          </el-form-item>
        </el-col>
        <el-col :md="10" :xs="24">
          <el-form-item label="平台权限：">
            <PlatformCheckboxGroup
              v-model="form.platforms"
              class="flex flex-column flex-start mt-5"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" v-loading="loading" element-loading-spinner=" ">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :loading="loadingSubmit" @click="handleSubmit">
        {{ loadingSubmit ? '保存中' : roleId === 0 ? '确 定' : '保 存' }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { createRole, readRole, updateRole } from '@/api/role'
import MenuTree from '@/components/MenuTree/index.vue'
import Input from '@/components/Input/index.vue'
import PlatformCheckboxGroup from '@/components/PlatformCheckboxGroup/index.vue'

export default {
  name: 'RoleFormDialog',
  components: {
    Input,
    MenuTree,
    PlatformCheckboxGroup
  },
  data() {
    return {
      dialogVisible: false,
      loading: false,
      loadingSubmit: false,
      roleId: 0,
      type: 1,
      form: {
        name: '',
        desc: '',
        rules: '',
        platforms: '',
        buttons: ''
      },
      rules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        rules: [{ required: true, message: '请选择功能授权', trigger: 'blur' }]
      }
    }
  },
  computed: {
    currentTitle() {
      return this.roleId === 0 ? '添加角色' : '编辑'
    },
    currentSuccessTips() {
      return this.roleId === 0 ? '添加成功' : '保存成功'
    }
  },
  methods: {
    async open(id) {
      this.roleId = id || 0
      this.fetchInit()
      this.dialogVisible = true
    },
    onCloseDialog() {
      this.dialogVisible = false
      this.loadingSubmit = false
      this.loading = false
      this.roleId = 0
      this.form.name = ''
      this.form.desc = ''
      this.form.rules = ''
      this.form.platforms = ''
      this.form.buttons = ''
      this.$refs.form.clearValidate()
    },
    async fetchInit() {
      try {
        this.loading = true
        if (this.roleId) {
          const res = await readRole(this.roleId)
          this.form.name = res.data.title
          this.form.desc = res.data.desc
          this.form.rules = res.data.rules
          this.form.buttons = res.data.buttons
          this.form.platforms = res.data.platform_ids
        }
        this.loading = false
      } catch (err) {
        console.log(err)
        this.loading = false
      }
    },
    async fetchSubmit() {
      try {
        this.loadingSubmit = true
        if (this.roleId) {
          await updateRole(this.roleId, this.getParams())
        } else {
          await createRole(this.getParams())
        }
        this.$message.success(this.currentSuccessTips)
        this.$emit('submit')
        this.loadingSubmit = false
        this.dialogVisible = false
      } catch (err) {
        console.log(err)
        this.loadingSubmit = false
      }
    },
    getParams() {
      return {
        type: this.type,
        title: this.form.name,
        desc: this.form.desc,
        rules: this.$refs.menuTree.getCheckedKeys(),
        buttons: this.form.buttons,
        platform_ids: this.form.platforms
      }
    },
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.fetchSubmit()
        }
      })
    }
  }
}
</script>
