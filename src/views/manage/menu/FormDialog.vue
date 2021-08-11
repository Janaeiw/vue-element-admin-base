<template>
  <el-dialog
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    :append-to-body="true"
    title="基本信息"
    width="600px"
    @close="onCloseDialog"
  >
    <el-form
      ref="form"
      v-loading="loading"
      :rules="rules"
      :model="form"
      label-width="70px"
      class="is-dialog"
    >
      <el-form-item label="上级：" prop="pid">
        <el-cascader
          :key="Math.random()"
          v-model="pid"
          :options="currentRulesList"
          placeholder="请选择"
          :props="defaultProps"
          :append-to-body="false"
          @change="handlePidChange"
        />
      </el-form-item>
      <el-form-item label="名称：" prop="title">
        <el-input v-model.trim="form.title" clearable />
      </el-form-item>
      <el-form-item label="标识：" prop="name">
        <el-input v-model.trim="form.name" clearable />
      </el-form-item>
      <el-form-item label="图标：" prop="icon">
        <el-input v-model.trim="form.icon" clearable />
      </el-form-item>
      <el-form-item label="路径：" prop="path">
        <el-input v-model.trim="form.path" clearable />
      </el-form-item>
      <el-form-item label="组件：" prop="component">
        <el-input v-model.trim="form.component" clearable />
      </el-form-item>
      <el-form-item label="排序：" prop="sorts">
        <el-input
          v-model.trim="form.sorts"
          clearable
          oninput="value=value.replace(/[^\d]/g,'')"
        />
      </el-form-item>
      <el-form-item label="跳转：" prop="redirect">
        <el-input v-model.trim="form.redirect" clearable />
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio :label="1">正常</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="隐藏：" prop="hidden">
        <el-radio-group v-model="form.hidden">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="缓存：" prop="no_cache">
        <el-radio-group v-model="form.no_cache">
          <el-radio :label="0">是</el-radio>
          <el-radio :label="1">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="根路由：" prop="always_show">
        <el-radio-group v-model="form.always_show">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
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
        {{ loadingSubmit ? '保存中' : menuId === 0 ? '确 定' : '保 存' }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { createMenu, readMenu, updateMenu } from '@/api/menu'
import tree from '@/utils/tree'
export default {
  name: 'FormDialog',
  props: {
    menuList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: false,
      loadingSubmit: false,
      ruleTop: [{ id: 0, title: '顶级' }],
      pid: 0,
      menuId: 0,
      defaultProps: {
        label: 'title',
        value: 'id',
        checkStrictly: true,
        expandTrigger: 'hover'
      },
      form: {
        pid: '',
        title: '',
        name: '',
        status: 1,
        icon: '',
        path: '',
        component: 'layout',
        hidden: 0,
        no_cache: 0,
        always_show: 0,
        redirect: '',
        sorts: 0
      },
      dialogFormVisible: false,
      rules: {
        pid: [{ required: true, message: '请选择上级菜单', trigger: 'change' }],
        title: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
        name: [{ required: true, message: '请输入标识', trigger: 'blur' }],
        icon: [{ required: true, message: '请输入图标名称', trigger: 'blur' }],
        path: [{ required: true, message: '请输入组件路径', trigger: 'blur' }],
        component: [{ required: true, message: '请输入组件名称', trigger: 'blur' }],
        sorts: [{ required: true, message: '请输入排序', trigger: 'blur' }]
      }
    }
  },
  computed: {
    currentRulesList() {
      return this.ruleTop.concat(tree.toTree(this.menuList.map(item => {
        if (item.pid > 0) { // 禁止二级
          item.disabled = true
        }
        return item
      })))
    }
  },
  methods: {
    open(id) {
      this.menuId = id || 0
      if (this.menuId) {
        this.initUpdate(this.menuId)
      } else {
        this.initCreate()
      }
      this.dialogFormVisible = true
    },
    resetForm() {
      this.menuId = 0
      this.$refs.form.resetFields()
    },
    initCreate() {
      this.dialogFormVisible = true
      this.pid = []
    },
    initUpdate(id) {
      this.loading = true
      this.dialogFormVisible = true
      readMenu(id).then((response) => {
        if (response.status === 1) {
          this.form.sorts = response.data.sorts
          this.form.pid = response.data.pid
          this.form.title = response.data.title
          this.form.name = response.data.name
          this.form.status = response.data.status
          this.form.icon = response.data.icon
          this.form.path = response.data.path
          this.form.component = response.data.component
          this.form.hidden = response.data.hidden
          this.form.no_cache = response.data.no_cache
          this.form.always_show = response.data.always_show
          this.form.redirect = response.data.redirect
          this.pid = tree.getParentsIdListById(this.menuList, this.form.pid)
            .filter(item => item !== 0)
            .reverse()
            .concat(this.form.pid)
          this.loading = false
        }
      }).catch(err => {
        console.log(err)
        this.loading = false
      })
    },
    async saveMenu() {
      try {
        this.loadingSubmit = true
        this.form.type = 1 // 区分特殊类型的菜单
        const params = { ...this.form }
        if (this.menuId) {
          await updateMenu(this.menuId, params)
        } else {
          await createMenu(params)
        }
        this.$emit('submit')
        this.dialogFormVisible = false
        this.$message.success('保存成功')
        this.loadingSubmit = false
      } catch (err) {
        console.log(err)
        this.loadingSubmit = false
      }
    },
    saveData() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.saveMenu()
        }
      })
    },
    handlePidChange(value) {
      if (value.length) {
        this.form.pid = value[value.length - 1]
      }
    },
    onCloseDialog() {
      this.loading = false
      this.loadingSubmit = false
      this.resetForm()
    }
  }
}
</script>
