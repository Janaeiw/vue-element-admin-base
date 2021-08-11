<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :append-to-body="true"
    width="600px"
    :title="currentTitle"
    @close="onCloseDialog"
  >
    <el-form
      ref="form"
      v-loading="loading"
      :rules="rules"
      :model="form"
      label-width="65px"
      class="is-dialog"
    >
      <el-form-item label="角色：" prop="group_ids">
        <RoleSelector
          v-if="dialogVisible"
          :type="-1"
          style="width: 100%"
          v-model="form.group_ids"
        />
      </el-form-item>
      <el-form-item label="账号：" prop="username">
        <el-input
          v-model.trim="form.username"
          clearable
        />
      </el-form-item>
      <el-form-item label="密码：" prop="password">
        <el-input
          v-model.trim="form.password"
          clearable
          type="password"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="部门：" prop="department_id">
        <DepartmentCascader v-model="form.department_id" />
      </el-form-item>
      <el-form-item label="昵称：" prop="nick_name">
        <el-input
        v-model.trim="form.nick_name"
        maxlength="10"
        show-word-limit
        clearable
      />
      </el-form-item>
      <el-form-item label="姓名：" prop="real_name">
        <el-input
          v-model.trim="form.real_name"
          maxlength="10"
          show-word-limit
          clearable
        />
      </el-form-item>
      <el-form-item label="状态：">
        <el-radio-group v-model="form.status">
          <el-radio :label="1">正常</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
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
        {{ loadingSubmit ? '保存中' : userId === 0 ? '确 定' : '保 存' }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { createUser, readUser, updateUser } from '@/api/user'
import { validEmail, validUsername, validPassword } from '@/utils/validate'
import RoleSelector from '@/components/RoleSelector/index.vue'
import DepartmentCascader from '@/components/DepartmentCascader/index.vue'
import tree from '@/utils/tree'

export default {
  name: 'FormDialog',
  components: {
    RoleSelector,
    DepartmentCascader
  },
  data() {
    const checkUsername = (rule, value, callback) => {
      if (validEmail(value)) {
        callback()
      } else if (validUsername(value)) {
        callback()
      } else {
        return callback(new Error())
      }
    }
    const checkPassword = (rule, value, callback) => {
      if (!value || validPassword(value)) {
        callback()
      } else {
        return callback(new Error())
      }
    }
    return {
      loading: false,
      loadingSubmit: false,
      roles: {},
      userId: 0,
      form: {
        department_id: '',
        group_ids: [],
        role_id: [],
        username: '',
        password: '',
        real_name: '',
        nick_name: '',
        status: 1
      },
      dialogVisible: false,
      rules: {
        department_id: [
          { required: true, message: '请选择部门', trigger: 'change' }
        ],
        nick_name: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
        real_name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          {
            validator: checkUsername,
            message: '账号格式是字母，数字，下划线，长度6-18位',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            validator: checkPassword,
            message: '格式错误：6-16个字符，至少包含大小写字母、数字中的两种',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    currentTitle() {
      return this.userId === 0 ? '添加用户' : '编辑'
    },
    departmentTreeList() {
      return tree.toTree(this.department)
    }
  },
  methods: {
    open(id) {
      this.userId = id || 0
      if (this.userId) {
        this.initUpdate(this.userId)
      } else {
        this.initCreate()
      }
      this.dialogVisible = true
    },
    onCloseDialog() {
      this.loading = false
      this.loadingSubmit = false
      this.resetForm()
    },
    resetForm() {
      this.userId = 0
      this.$refs.form.resetFields()
    },
    handleChange(value) {
      if (value.length > 0) {
        this.form.department_id = value[value.length - 1]
      }
    },
    async initCreate() {
      this.rules.password[0].required = true
    },
    async initUpdate(id) {
      try {
        this.rules.password[0].required = false
        this.loading = true
        const res = await readUser(id)
        const {
          username,
          real_name: realName,
          nick_name: nickName,
          group,
          status,
          department_id: departmentId,
          role_id: roleId
        } = res.data
        this.form.group_ids = group.map((item) => {
          return item.group_id
        })
        this.form.role_id = roleId
        this.form.department_id = departmentId
        this.form.username = username
        this.form.real_name = realName
        this.form.nick_name = nickName
        this.form.status = status
        this.form.password = ''
        this.loading = false
      } catch (err) {
        console.log(err)
        this.loading = false
      }
    },
    async saveUser() {
      try {
        this.loadingSubmit = true
        const params = { ...this.form }
        params.group_ids = params.group_ids.join(',')
        if (this.userId) {
          if (!params.password) {
            params.password = undefined
          }
          await updateUser(this.userId, params)
        } else {
          await createUser(params)
        }
        this.$emit('submit')
        this.dialogVisible = false
        this.loadingSubmit = false
        this.$message.success('保存成功')
      } catch (err) {
        console.log(err)
        this.loadingSubmit = false
      }
    },
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.saveUser()
        }
      })
    }
  }
}
</script>
