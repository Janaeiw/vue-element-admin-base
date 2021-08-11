<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      class="login__form"
      autocomplete="on"
      label-position="left"
    >
      <div class="login__title-container">
        <div class="login__title">登录{{ appName }}</div>
      </div>

      <div class="login__body">
        <el-form-item prop="username">
          <el-input
            ref="username"
            v-model.trim="loginForm.username"
            placeholder="请输入账号"
            name="username"
            type="text"
            tabindex="1"
            autocomplete="on"
          >
            <template #prefix>
              <span class="login-icon login-icon--username"></span>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            :key="passwordType"
            ref="password"
            v-model.trim="loginForm.password"
            :type="passwordType"
            placeholder="请输入密码"
            name="password"
            tabindex="2"
            autocomplete="on"
          >
            <template #prefix>
              <span class="login-icon login-icon--password"></span>
            </template>
            <template #suffix>
              <span class="login__show-pwd" @click="showPwd">
                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
              </span>
            </template>
          </el-input>
        </el-form-item>
        <div class="login__forget">忘记密码请联系管理员</div>

        <div class="login__captcha-container">
          <el-form-item prop="code" >
            <el-input
              ref="code"
              v-model.trim="loginForm.code"
              type="text"
              placeholder="验证码"
              name="code"
              tabindex="3"
              maxlength="4"
              autocomplete="off"
              @keyup.enter.native="handleLogin"
            >
              <template #prefix>
                <span class="login-icon login-icon--captcha"></span>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <Captcha
              ref="captcha"
              class="login__captcha"
              width="100%"
              height="40px"
              radius="4px"
              @change="onCaptchaChange"
            />
          </el-form-item>
        </div>

        <el-button
          :loading="loading"
          type="primary"
          size="large"
          class="login__submit"
          :disabled="!enableLoginButton"
          @click.native.prevent="handleLogin"
        >
          {{ loading ? '登录中' : '登录' }}
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { appName } from '@/settings'
import { validCaptcha } from '@/utils/validate'
import Captcha from '@/components/Captcha'

export default {
  name: 'Login',
  components: {
    Captcha
  },
  data() {
    return {
      appName,
      loginForm: {
        username: '',
        password: '',
        code_key: '',
        code: ''
      },
      passwordType: 'password',
      loading: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  computed: {
    enableLoginButton() {
      return !!(this.loginForm.username && this.loginForm.password && this.loginForm.code)
    }
  },
  created() {
    const query = this.$route.query
    if (query) {
      this.redirect = query.redirect
      this.otherQuery = this.getOtherQuery(query)
    }
    this.$nextTick(() => {
      this.getCaptcha()
    })
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    getCaptcha() {
      this.$refs.captcha.init()
    },
    onCaptchaChange(res) {
      this.loginForm.code_key = res.key
    },
    handleLogin() {
      if (this.loading) {
        return
      }
      if (this.loginForm.username === '') {
        this.$message.error('请输入账号')
        return
      }
      if (this.loginForm.password === '') {
        this.$message.error('请输入密码')
        return
      }
      if (this.loginForm.code === '') {
        this.$message.error('请输入验证码')
        return
      }
      if (!validCaptcha(this.loginForm.code)) {
        this.$message.error('验证码格式不正确，请重新输入')
        return
      }
      this.loading = true
      this.$store.dispatch('user/login', this.loginForm).then(() => {
        this.$router.push({
          path: this.redirect || '/',
          query: this.otherQuery
        }, () => {
          this.loading = false
        }, (error) => {
          this.loading = false
          console.info(error.message)
        })
      }, () => {
        this.loginForm.code = ''
        this.getCaptcha()
        this.loading = false
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  background-color: #00417a;
  background-image: url('~@/assets/images/bg--login.jpg');
  background-size: cover;
  .login__title-container {
    position: relative;
    border-bottom: 1px solid rgba($border-color--base, .45);
    .login__title {
      padding: 15px 0;
      font-size: 22px;
      color: #fff;
      text-align: center;
      font-weight: bold;
    }
  }
  .login__form {
    position: relative;
    margin: auto;
    max-width: 600px;
    width: 95%;
    background-color: rgba(0, 45, 105, 0.4);
    box-shadow: 0 0 10px 0 rgba(39, 149, 255, 0.1);
    border-radius: $border-radius--base;
    overflow: hidden;
    .login__show-pwd {
      display: flex;
      align-items: center;
      margin-right: 5px;
      height: 100%;
      font-size: 16px;
      color: #889aa4;
      user-select: none;
      &:hover {
        cursor: pointer;
      }
    }
    .login__submit {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 40px;
      font-size: 18px;
    }
  }
  .login__body {
    margin-left: auto;
    margin-right: auto;
    padding-top: 40px;
    padding-bottom: 40px;
    max-width: 350px;
    width: 80%;
    /deep/ {
      .el-form-item__content {
        display: flex;
        align-items: center;
      }
      .el-form-item--mini.el-form-item {
        margin-bottom: 32px;
      }
      .el-input__prefix {
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .el-form-item {
        margin-bottom: 32px;
        border: 1px solid rgba(#093D79, .4);
        border-radius: 4px;
      }
      .el-input {
        flex: 1;
        height: 40px;
        border: 1px solid rgba($border-color--base, .45);
        border-radius: 4px;
        .el-input__inner {
          padding-left: 36px;
          height: 100%;
          border: 0;
          background-color: #083978;
          color: #fff;
          caret-color: #fff;
          &:focus {
            box-shadow: none;
          }
          &:-webkit-autofill {
            box-shadow: 0 0 0 10000px #083978 inset !important;
            -webkit-text-fill-color: #fff !important;
          }
        }
      }
    }
    .login-icon {
      display: inline-block;
      margin-left: 10px;
      margin-right: 10px;
      width: 16px;
      height: 16px;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      background-position: center center;
      &.login-icon--username {
        background-image: url('~@/assets/images/login/icon-username.png');
      }
      &.login-icon--password {
        background-image: url('~@/assets/images/login/icon-password.png');
      }
      &.login-icon--captcha {
        background-image: url('~@/assets/images/login/icon-captcha.png');
      }
    }
    .login__captcha-container {
      display: flex;
      .el-form-item {
        flex: 1;
        margin-right: 10px;
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
  .login__forget {
    margin-top: -25px;
    padding-bottom: 10px;
    text-align: right;
    font-size: 12px;
    color: #5EB0FF;
  }
}
</style>
