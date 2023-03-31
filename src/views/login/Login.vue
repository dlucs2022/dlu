<template>
  <div class="login">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>登录</span>
      </div>
      <el-form :model="form" ref="form" label-width="80px">
        <el-form-item
          label="用户名"
          prop="username"
          :rules="[
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 4, max: 10, message: '长度必须为4-10之间', trigger: 'blur' },
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
            { min: 6, max: 12, message: '长度必须为6-12之间', trigger: 'blur' },
          ]"
        >
          <el-input
            type="password"
            v-model="form.password"
            prefix-icon="el-icon-unlock"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="验证码"
          prop="verificationcode"
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
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="register('form')">注册</el-button>
          <el-button type="primary" @click="login('form')">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import Ribbons from "@/assets/js/ribbon_vue";
import dao1 from "@/api/dao1";
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
    };
  },
  mounted() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    Ribbons.start();
  },
  methods: {
    login(form) {
      // console.log(this.form);
      this.$refs[form].validate((valid) => {
        if (valid) {
          var user = dao1.login(form.username, form.password);
          // var a = JSON.stringify(res.user);
          sessionStorage.setItem("user", JSON.stringify(user));

          this.$router.push("../layout/image_classification");
        } else {
          console.error(this.form);
        }
      });
    },
    register(form) {
      this.$router.push("./register");
    },
  },
  beforeDestroy() {
    Ribbons.stop();
  },
};
</script>

<style lang="scss">
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
      margin-left: 30px;
      width: 30%;
    }
    .el-input {
      margin-bottom: 15px;
    }
  }
}
</style>
