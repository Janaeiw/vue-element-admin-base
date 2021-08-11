<template>
  <el-dialog
    :title="currentTitle"
    width="450px"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    :append-to-body="true"
    @close="onCloseDialog"
  >
    <el-form
      ref="form"
      v-loading="loading"
      :model="form"
      :rules="rules"
      label-width="95px"
      class="is-dialog"
    >
      <el-form-item label="上级部门" prop="pid" :label-width="formLabelWidth">
        <DepartmentCascader
          v-model="form.pid"
          :default-list="defaultDepartmentList"
        />
      </el-form-item>
      <el-form-item label="部门名称" :label-width="formLabelWidth" prop="name">
        <el-input v-model.trim="form.name" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item label="负责人" :label-width="formLabelWidth" prop="person">
        <el-input v-model.trim="form.person" autocomplete="off" clearable />
      </el-form-item>
    </el-form>
    <div
      slot="footer"
      v-loading="loading"
      element-loading-spinner=" "
      class="dialog-footer"
    >
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" :loading="loadingSubmit" @click="saveData">
        {{ loadingSubmit ? '保存中' : departmentId === 0 ? '确 定' : '保 存' }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  createDepartment,
  readDepartment,
  updateDepartment
} from '@/api/department'
import DepartmentCascader from '@/components/DepartmentCascader/index.vue'

export default {
  name: 'DepartmentForm',
  components: {
    DepartmentCascader
  },
  data() {
    return {
      loading: false,
      loadingSubmit: false,
      departmentId: 0,
      form: {
        pid: '',
        name: '',
        person: ''
      },
      dialogFormVisible: false,
      formLabelWidth: '90px',
      defaultDepartmentList: [{ id: 0, name: '顶级' }],
      rules: {
        pid: [{ required: true, message: '请选择上级部门', trigger: 'change' }],
        name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
        person: [
          { required: true, message: '请输入负责人姓名', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    currentTitle() {
      return this.departmentId === 0 ? '添加部门' : '编辑'
    },
    currentSuccessTips() {
      return this.departmentId === 0 ? '添加成功' : '保存成功'
    }
  },
  methods: {
    open(id) {
      this.departmentId = id || 0
      this.dialogFormVisible = true
      if (this.departmentId) {
        this.loading = true
        readDepartment(this.departmentId).then((res) => {
          const { name, person, pid } = res.data
          this.form.pid = pid
          this.form.name = name
          this.form.person = person
          this.loading = false
        }).catch(err => {
          console.log(err)
          this.loading = false
        })
      }
    },
    onCloseDialog() {
      this.resetForm()
    },
    resetForm() {
      this.departmentId = 0
      this.$refs.form.resetFields()
    },
    async saveDepartment() {
      try {
        this.loadingSubmit = true
        const params = { ...this.form }
        if (this.departmentId) {
          await updateDepartment(this.departmentId, params)
        } else {
          await createDepartment(params)
        }
        this.$emit('submit')
        this.dialogFormVisible = false
        this.$message.success(this.currentSuccessTips)
        this.loadingSubmit = false
      } catch (err) {
        console.log(err)
        this.loadingSubmit = false
      }
    },
    saveData() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.saveDepartment()
        }
      })
    }
  }
}
</script>
