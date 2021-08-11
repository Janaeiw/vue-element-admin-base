<template>
  <el-dialog
    title="请输入验证码确认刷新AppSecret"
    :visible.sync="dialogVisible"
    width="500px"
    :append-to-body="true"
    @close="onCloseDialog"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="80px"
      inline
      class=""
    >
      <el-form-item label="验证码：" prop="code" style="margin-bottom: 30px">
        <el-input
          v-model="form.code"
          style="width: 200px"
          placeholder="请输入验证码"
          clearable
        />
      </el-form-item>
      <el-form-item style="margin-right: 0;">
        <Captcha
          ref="captcha"
          width="100px"
          height="32px"
          radius="4px"
          @change="onCaptchaChange"
        />
      </el-form-item>
      <el-form-item label=" " style="margin-bottom: 0">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          :loading="loadingSubmit"
          @click="handleSubmit('form')"
        >
          {{ loadingSubmit ? '保存中' : '确 定' }}
        </el-button>
      </el-form-item>
    </el-form>
    <!-- <span slot="footer" class="dialog-footer">
    </span> -->
  </el-dialog>
</template>

<script>
import { modifyPlatformSecret } from '@/api/platform'
import Captcha from '@/components/Captcha/index.vue'
import { validCaptcha } from '@/utils/validate'
export default {
  name: 'UpdateSecretDialog',
  components: {
    Captcha
  },
  data() {
    const validateCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'))
      } else if (!validCaptcha(value)) {
        callback(new Error('请输入正确的验证码'))
      } else {
        callback()
      }
    }
    return {
      dialogVisible: false,
      loadingSubmit: false,
      platformId: 0,
      appKey: '',
      form: {
        secret: 1, // 当SECRET为1时，将刷新SECRET值,不传该值不刷新SECRET值
        code: '',
        code_key: ''
      },
      rules: {
        code: [{ required: true, trigger: 'blur', validator: validateCode }]
      }
    }
  },
  methods: {
    open(id, appKey) {
      this.platformId = id
      this.appKey = appKey
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.captcha.init()
      })
    },
    onCloseDialog() {
      this.$refs.form.resetFields()
      this.$nextTick(() => {
        this.$refs.captcha.clear()
      })
    },
    onCaptchaChange(res) {
      this.form.code_key = res.key
    },
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loadingSubmit = true
          modifyPlatformSecret(this.platformId, this.form).then(() => {
            this.$emit('submit')
            this.loadingSubmit = false
            this.dialogVisible = false
          }).catch(err => {
            this.$refs.captcha.init()
            this.loadingSubmit = false
	  })
        }
      })
    }
  }
}
</script>
