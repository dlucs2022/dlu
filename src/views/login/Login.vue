<template>
  <div class="login">
    <transition name="el-zoom-in-center">
      <el-card v-show="show_card" class="box-card">
        <div slot="header" class="clearfix">
          <span>登录</span>
        </div>
        <el-form
          :model="form"
          ref="form"
          label-width="80px"
          @keyup.enter.native="login('form')"
        >
          <el-form-item
            label="用户名"
            prop="username"
            :rules="[
              { required: true, message: '请输入用户名', trigger: 'blur' },
              { min: 1, max: 10, message: '长度必须为4-10之间', trigger: 'blur' },
            ]"
          >
            <el-input
              type="text"
              v-model="form.username"
              prefix-icon="el-icon-user"
              placeholder="请输入用户名"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="密码"
            prop="password"
            :rules="[
              { required: true, message: '请输入密码', trigger: 'blur' },
              { min: 5, max: 12, message: '长度必须为6-12之间', trigger: 'blur' },
            ]"
          >
            <el-input
              type="password"
              v-model="form.password"
              prefix-icon="el-icon-unlock"
              placeholder="请输入密码"
              show-password
            ></el-input>
          </el-form-item>

          <el-form-item
            label="验证码"
            prop="verificationcode"
            :inline="true"
            :rules="[
              { required: true, message: '请输入验证码', trigger: 'blur' },
              { type: 'number', message: '验证码必须为数字', trigger: 'blur' },
            ]"
          >
            <el-input
              type="text"
              v-model.number="form.verificationcode"
              prefix-icon="el-icon-message"
              placeholder="请输入验证码"
            >
              <template slot="append">
                <img :src="codeUrl" @click="getCode" style="margin-top: 3px" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="register('form')">注册</el-button>
            <el-button type="primary" @click="login('form')">登录</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </transition>
  </div>
</template>

<script>
import Ribbons from "@/assets/js/ribbon_vue";
import dao from "@/api/dao";
export default {
  Ribbons,
  name: "Login",
  data() {
    return {
      form: {
        username: "",
        password: "",
        verificationcode: "",
      },
      codeUrl: "",
      show_card: false,
    };
  },
  mounted() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    Ribbons.start();
    this.getCode();
    setTimeout((this.show_card = true), 1000);
  },
  methods: {
    login(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          dao
            .login(this.form.username, this.form.password, this.form.verificationcode)
            .then((res) => {
              if (res.data.message === "success") {
                sessionStorage.setItem("user", JSON.stringify(res.data.data));
                this.$notify({
                  title: "成功",
                  message: "登录成功",
                  type: "success",
                });
                this.$router.push("../layout/image_classification");
              } else {
                this.$alert(res.data.message, "警告", {
                  confirmButtonText: "确定",
                  callback: (action) => {
                    this.$message({
                      type: "warning",
                      message: `请重试`,
                      duration: "1000",
                    });
                    this.getCode();
                  },
                });
              }
            });
        } else {
          console.error(this.form);
        }
      });
    },
    register(form) {
      this.$router.push("./register");
    },
    getCode() {
      //点击的时候就图片就请求 图片就换了
      dao.getCode().then((res) => {
        if (res.status == 200) {
          this.codeUrl = window.URL.createObjectURL(res.data);
          // this.codeUrl = "data:image/gif;base64," + res.data; //
        }
        //这边我简单判断了下 根据自己需求 进行判断 catch...啥的
      });
    },
  },
  beforeDestroy() {
    Ribbons.stop();
  },
};
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  position: absolute;
  .box-card {
    border-radius: 25px;
    border: none;
    box-shadow: 0px 2px 12px 0px rgba(105, 105, 105, 0.07);
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: saturate(150%) blur(15px);
    -webkit-backdrop-filter: saturate(150%) contrast(50%) blur(4px);
    background-image: linear-gradient(
      196deg,
      hsla(0, 0%, 100%, 0.1),
      hsla(0, 0%, 100%, 0) 23%,
      hsla(0, 0%, 100%, 0) 62%,
      hsla(0, 0%, 100%, 0.3)
    );
    width: 450px;
    margin: 200px auto;

    .el-card__header {
      text-align: center;
      margin-bottom: 20px;
      font-weight: bold;
      color: #606266;
      font-size: 34px;
    }
    .el-button {
      margin-top: 10px;
      margin-right: 30px;
      margin-left: 15px;
      width: 30%;
    }
    .el-input {
      margin-bottom: 15px;
    }
  }
}
</style>
