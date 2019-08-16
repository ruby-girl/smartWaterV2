<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <div class="title-container">
        <img src="../../assets/imgs/logo.png" alt>
      </div>

      <el-form-item prop="username">
        <span class="svg-container iconfont iconzhanghu" />
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="请输入您的登录账号"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container iconfont iconmima" />
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="请输入您的登录密码"
            name="password"
            tabindex="2"
            autocomplete="off"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>

      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-top:25px;"
        @click.native.prevent="handleLogin"
      >Login</el-button>
    </el-form>
  </div>
</template>

<script>

import RSA from "rsa-js-java";
import { getKey } from "@/api/user";
import { getToken } from '@/utils/auth'
import '@/utils/jquery-1.6.4.js'
import '@/utils/jquery.signalR-2.4.1.js'
import '@/utils/hubs'

export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error("不能为空"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error("不能为空"));
      } else if (value.length < 6 || value.length > 20) {
        callback(new Error("长度6-18"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        password: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword }
        ]
      },
      passwordType: "password",
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === "") {
      this.$refs.username.focus();
    } else if (this.loginForm.password === "") {
      this.$refs.password.focus();
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (
          (shiftKey && (key >= "a" && key <= "z")) ||
          (!shiftKey && (key >= "A" && key <= "Z"))
        ) {
          this.capsTooltip = true;
        } else {
          this.capsTooltip = false;
        }
      }
      if (key === "CapsLock" && this.capsTooltip === true) {
        this.capsTooltip = false;
      }
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          let postData = {
            LoginName: this.loginForm.username,
            LoginPwd: "",
            privateKeyId: ""
          };
          getKey().then(res => {
            RSA.setMaxDigits(129);
            let key =new RSA.RSAKeyPair(res.data.publicKeyExponent, "", res.data.publicKeyModulus);//密码加密
            let pwd = RSA.encryptedString(key, this.loginForm.password);
            postData.LoginPwd=pwd
            postData.privateKeyId=res.data.privateKeyId
            this.$store
              .dispatch("user/login", postData)
              .then(() => {
                this.getSingle()
                this.$router.push({
                  path: this.redirect || "/",
                  query: this.otherQuery
                });
                this.loading = false;

              })
              .catch(() => {
                this.loading = false;
              });
          });
        } else {
          return false;
        }
      });
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    },
    getSingle() {
      var token = getToken(); //登录成功后后端返回的Token
      let _this = this
      $.connection.hub.url = this.baseUrl + '/signalr';

      var chat = $.connection.FXYBHub;

      //后端请求前端的连接
      chat.client.message = function (code) {

        switch (code) {
          case '100'://Token失效
            _this.$message({
              message: 'Token已失效，请重新登陆',
              type: 'warning'
            });
            _this.$router.push({ path: "/login"});
            break
          case '101'://已在其他电脑登录
            _this.$message({
              message: '该账户已在其他电脑登录，请重新登陆',
              type: 'warning'
            });
            _this.$router.push({ path: "/login"});
            break
          case '102'://账户权限发生变化，需重新登录
            _this.$message({
              message: '账户权限发生变化，请重新登陆',
              type: 'warning'
            });
            _this.$router.push({ path: "/login"});
            break
        }
      }

      //启动链接
      $.connection.hub.start({jsonp:true}).done(function () {
        //请求后端的连接
        chat.server.login(token); //注册signalr连接 ,Token 登录成功后后端返回的Token
      });
    }
  },

};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */

$bg: #fff;
$light_gray: #fff;
$cursor: #283443;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  width: 350px;
  .el-input {
    display: inline-block;
    height: 36px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 0 5px 0 15px;
      color: $cursor;
      height: 27px;
      caret-color: $cursor;
      margin-top: 3px;
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid #d8e2e7;
    //background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
  .el-form-item__content {
    line-height: 24px;
  }
}
</style>

<style lang="scss" scoped>
$bg: #fff;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  height: 460px;
  background-color: $bg;
  overflow: hidden;
  background-image: url("../../assets/imgs/logo_bg.png");
  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 27px 35px 47px 35px;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 6px 6px 7px;
    color: $dark_gray;
    vertical-align: middle;
    width: 36px;
    display: inline-block;
    border-right: 1px solid #d8e2e7;
    font-size: 24px;
  }

  .title-container {
    position: relative;
    text-align: center;
    margin-bottom: 44px;
    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }
  .el-form-item {
    margin-bottom: 44px;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
