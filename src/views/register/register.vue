<template>
  <div class="register">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>注册</span>
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
          label="确认密码"
          prop="checkPass"
          :rules="[
            { required: true, message: '请输入密码', trigger: 'blur' },
            { validator: validatePass, trigger: 'blur' },
          ]"
        >
          <el-input
            type="password"
            v-model="form.checkPass"
            prefix-icon="el-icon-unlock"
            placeholder="请再次输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="邀请码">
          <el-input
            type="text"
            v-model="form.invitationcode"
            prefix-icon="el-icon-key"
            placeholder="请输入邀请码"
          ></el-input>
        </el-form-item>
        <slide-verify ref="slideblock" ></slide-verify>
        <el-form-item>
          <el-button type="primary" @click="prev">返回</el-button>
          <el-button type="primary" @click="confirm('form')">确认</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import Ribbons from "@/assets/js/ribbon_vue.js";
import dao1 from "@/api/dao1.js";
import slideVerify from "@/views/register/components/verifyCode.vue"
export default {
  components:{
        slideVerify,
  },
  name: "Register",
  data() {
    return {
      form: {
        username: "",
        password: "",
        checkPass: "",
        invitationcode: "",
      },
    };
  },
  mounted() {
    Ribbons.start();
  },
  methods: {
    validatePass(rule, value, callback) {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    },

    ribbons() {
      // 调用外部js中的jsTest1()方法
      ribbon();
    },
    prev() {
      Ribbons.stop();
      this.$router.push("./login");
    },
    confirm(form) {
      // console.log(this.form);
      const result_invitationcode = dao1.check_invitationcode();
      const result_username = dao1.check_username();
      this.$refs[form].validate((valid) => {
        if (result_username.message === "success") {
          if (this.form.invitationcode === "") {
            if (valid) {
              this.$confirm("是否确认注册?", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              })
                .then(() => {
                  this.$message({
                    message: "注册成功",
                    type: "success",
                  });
                  Ribbons.stop();
                  this.$router.push("./login");
                })
                .catch(() => {
                  this.$message({
                    type: "info",
                    message: "已取消注册",
                  });
                });
            }
          } else {
            if (result_invitationcode.message === "success") {
              if (valid) {
                this.$confirm("是否确认注册?", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning",
                })
                  .then(() => {
                    this.$message({
                      message: "注册成功",
                      type: "success",
                    });
                    Ribbons.stop();
                    this.$router.push("./login");
                  })
                  .catch(() => {
                    this.$message({
                      type: "info",
                      message: "已取消注册",
                    });
                  });
              }
            } else {
              alert("邀请码不存在");
            }
          }
        } else {
          alert("用户名重复");
        }
      });
    },
  },
};
</script>

<style lang="scss">
.register {
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
