<template>
  <Container class="personal-info">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="238px"
    >
      <Section>
        <template #header>基础信息</template>
        <template>
          <el-form-item label="上传头像：">
            <ImageUploader ref="avatarUploader" :imgPath="form.image_path" />
          </el-form-item>
          <el-form-item label="账号：">{{ username }}</el-form-item>
          <el-form-item label="昵称：" prop="nick_name">
            <el-input
              v-model.trim="form.nick_name"
              maxlength="10"
              clearable
            />
          </el-form-item>
          <el-form-item label="真实姓名：" prop="real_name">
            <el-input
              v-model.trim="form.real_name"
              maxlength="10"
              clearable
            />
          </el-form-item>
          <el-form-item label="手机号码：" prop="phone">
            <Input
              type="number"
              maxlength="11"
              v-model="form.phone"
              clearable
            />
          </el-form-item>
        </template>
      </Section>
      <Section>
        <template #header>密码设置</template>
        <template>
          <el-form-item label="原密码：" prop="original_password">
            <el-input
              type="password"
              v-model.trim="form.original_password"
              clearable
            />
          </el-form-item>
          <el-form-item label="新密码：" prop="password">
            <el-input
              type="password"
              v-model.trim="form.password"
              clearable
            />
          </el-form-item>
          <el-form-item label="确认新密码：" prop="newPassword">
            <el-input
              type="password"
              v-model.trim="form.newPassword"
              clearable
            />
          </el-form-item>
          <el-form-item style="margin-top: 30px">
            <div class="button--submit">
              <el-button
                type="primary"
                :loading="loadingSubmit"
                @click="handleSubmit"
              >
                {{ loadingSubmit ? '保存中' : '保 存' }}
              </el-button>
            </div>
          </el-form-item>
        </template>
      </Section>
    </el-form>
  </Container>
</template>

<script>
import { mapGetters } from 'vuex'
import { updateUserSelf } from '@/api/user'
import { validPhone, validPassword } from '@/utils/validate'
import Container from '@/components/Container/index.vue'
import Section from '@/components/Section/index.vue'
import Input from '@/components/Input/index.vue'
import ImageUploader from '@/components/ImageUploader/index.vue'

export default {
  name: 'PersonalInfo',
  components: {
    Container,
    Section,
    Input,
    ImageUploader
  },
  data() {
    return {
      loadingSubmit: false,
      form: {
        nick_name: '',
        real_name: '',
        original_password: '',
        password: '',
        newPassword: '',
        phone: '',
        image_path: ''
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入昵称',
            trigger: 'blur'
          }
        ],
        nick_name: [
          {
            required: true,
            message: '请输入昵称',
            trigger: 'blur'
          }
        ],
        real_name: [
          {
            required: true,
            message: '请输入真实姓名',
            trigger: 'blur'
          }
        ],
        phone: [
          {
            required: true,
            message: '请输入手机号码',
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              if (!validPhone(value)) {
                callback(new Error('请输入正确的手机号码'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        original_password: [
          {
            validator: (rule, value, callback) => {
              if (value || this.form.password || this.form.newPassword) {
                if (!value) {
                  callback(new Error('请输入原密码'))
                } else if (value && !validPassword(value)) {
                  callback(new Error('6-16个字符，至少包含大小写字母、数字中的两种'))
                } else {
                  callback()
                }
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        password: [
          {
            validator: (rule, value, callback) => {
              if (this.form.original_password || this.form.newPassword) {
                if (!value) {
                  callback(new Error('请输入新密码'))
                } else if (!validPassword(value)) {
                  callback(new Error('6-16个字符，至少包含大小写字母、数字中的两种'))
                } else {
                  callback()
                }
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        newPassword: [
          {
            validator: (rule, value, callback) => {
              if (this.form.original_password || this.form.newPassword) {
                if (!value) {
                  callback(new Error('请再次输入新密码'))
                } else if (!validPassword(value)) {
                  callback(new Error('6-16个字符，至少包含大小写字母、数字中的两种'))
                } else if (
                  this.form.original_password === this.form.newPassword
                ) {
                  callback(new Error('新密码不可与原密码一致，请重新输入'))
                } else if (this.form.newPassword !== this.form.password) {
                  callback(new Error('确认新密码与新密码不一致，请重新输入'))
                } else {
                  callback()
                }
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters({
      username: 'user/name',
      userId: 'user/id'
    })
  },
  created() {
    this.form.image_path = this.$store.getters['user/avatar']
    this.form.phone = this.$store.getters['user/phone']
    this.form.real_name = this.$store.getters['user/realname']
    this.form.nick_name = this.$store.getters['user/nickname']
  },
  methods: {
    async fetchSubmit() {
      try {
        this.loadingSubmit = true
        this.form.image_path = await this.$refs.avatarUploader.upload()
        const submitForm = { ...this.form }
        if (!submitForm.original_password || !submitForm.password) {
          delete submitForm.original_password
          delete submitForm.password
        }
        delete submitForm.newPassword
        await updateUserSelf(this.userId, submitForm)
        this.$store.dispatch('user/setAvatar', this.form.image_path)
        this.$store.dispatch('user/setNickname', this.form.nick_name)
        this.$store.dispatch('user/setRealname', this.form.real_name)
        this.$store.dispatch('user/setPhone', this.form.phone)
        this.form.original_password = ''
        this.form.password = ''
        this.form.newPassword = ''
        this.$message.success('保存成功')
        this.loadingSubmit = false
      } catch (err) {
        console.log(err)
        this.loadingSubmit = false
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

<style lang="scss" scoped>
.personal-info {
  .button--submit {
    max-width: 230px;
    text-align: center;
  }
  /deep/ {
    .el-input {
      max-width: 230px;
    }
    @media screen and (max-width: 768px) {
      .el-form-item__label {
        width: 100px !important;
      }
      .el-form-item__content {
        margin-left: 100px !important;
      }
    }
  }
}
</style>
