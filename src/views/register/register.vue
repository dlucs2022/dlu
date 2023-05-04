<template>
  <div class="register">
    <el-dialog title="人机验证" :visible.sync="verifyDialogVisible" width="30%">
      <!-- :before-close="handleClose" -->
      <div>
        <!-- @putIsVerify="getIsVerify"  : 接收子组件传值 -->
        <slide-verify ref="slideblock" @putIsVerify="getIsVerify"></slide-verify>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="verifyDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <transition name="el-zoom-in-center">
      <el-card v-show="show_card" class="box-card">
        <div slot="header" class="clearfix">
          <span>注册</span>
        </div>

        <el-form :model="form" ref="form" label-width="80px">
          <el-form-item
            label="用户名"
            prop="name"
            :rules="[
              { required: true, message: '请输入用户名', trigger: 'blur' },
              { min: 4, max: 10, message: '长度必须为4-10之间', trigger: 'blur' },
            ]"
          >
            <el-input
              type="text"
              v-model="form.name"
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
              show-password
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
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item label="邀请码">
            <el-input
              type="text"
              v-model="form.invite_code"
              prefix-icon="el-icon-key"
              placeholder="请输入邀请码(可不填写)"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="prev">返回</el-button>
            <el-button type="primary" @click="confirm('form')">确认</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </transition>
  </div>
</template>

<script>
import Ribbons from "@/assets/js/ribbon_vue.js";
import dao from "@/api/dao.js";
import slideVerify from "@/views/register/components/verifyCode.vue";
export default {
  components: {
    slideVerify,
  },
  name: "Register",
  data() {
    return {
      form: {
        name: "",
        password: "",
        checkPass: "",
        invite_code: "",
      },
      isVerify: false,
      verifyDialogVisible: false,
      show_card: false,
    };
  },
  mounted() {
    Ribbons.start();
    setTimeout((this.show_card = true), 1000);
  },
  methods: {
    getIsVerify(value) {
      this.isVerify = value;
      if (this.isVerify) {
        this.verifyDialogVisible = false;
        this.$message({
          message: "校验通过！",
          type: "success",
        });
      }
    },
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
    async confirm(form) {
      //异步
      const that = this;
      // console.log(this.form);
      let invitationPass = false;
      let userNamePass = false;

      if (!this.form.invite_code) {
        await dao.check_invitationcode(this.form.invite_code).then((res) => {
          invitationPass = res.data.message == "success";
        });
      }
      await dao.check_username(this.form.name).then((res) => {
        //await：等待
        userNamePass = res.data.message == "success";
      });

      this.$refs[form].validate((valid) => {
        if (userNamePass) {
          if (this.form.invite_code === "") {
            if (valid) {
              this.$confirm("是否确认注册?", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              })
                .then(() => {
                  //还没验证？开启人机校验
                  if (!this.isVerify) {
                    this.verifyDialogVisible = true;
                    this.$refs.slideblock.handleClick();
                  } else {
                    this.userRegister();
                  }
                })
                .catch(() => {
                  this.$message({
                    type: "info",
                    message: "已取消注册",
                  });
                });
            }
          } else {
            if (invitationPass) {
              if (valid) {
                this.$confirm("是否确认注册?", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning",
                })
                  .then(() => {
                    //还没验证？开启人机校验
                    if (!this.isVerify) {
                      this.verifyDialogVisible = true;
                      this.$refs.slideblock.handleClick();
                    } else {
                      this.userRegister();
                    }
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
    userRegister() {
      dao.register(this.form).then((res) => {
        if (res.data.message == "success") {
          Ribbons.stop();
          this.$message({
            message: "注册成功",
            type: "success",
          });
          this.$router.push("./login");
        }
      });
    },
  },
  watch: {
    verifyDialogVisible(newValue, oldValue) {
      if (newValue) {
        //newValue==true 也就是打开了对话框的时候
        // console.log(newValue);
        this.getIsVerify(false);
      }
    },
    isVerify(newValue, oldValue) {
      if (newValue) {
        //验证通过的时候  进行注册
        this.userRegister();
      }
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
