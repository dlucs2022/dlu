<template>
  <div class="update-info">
    <h1>修改密码</h1>
    <el-form :model="form" ref="updateInfo">
      <el-form-item
        prop="oldpassword"
        class="form-group"
        :rules="[
          { required: true, message: '请输入旧密码', trigger: 'blur' },
          { validator: checkOldPassword, trigger: 'blur' },
        ]"
      >
        <label>输入旧密码:</label>
        <el-input placeholder="请输入旧密码" v-model="form.oldpassword" show-password />
      </el-form-item>

      <el-form-item
        prop="password"
        class="form-group"
        :rules="[
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 12, message: '密码长度应为6-12个字符', trigger: 'blur' },
        ]"
      >
        <label>输入新密码:</label>
        <el-input placeholder="请输入新密码" v-model="form.password" show-password />
      </el-form-item>

      <el-form-item
        prop="confirmpassword"
        class="form-group"
        :rules="[
          { required: true, message: '请确认新密码', trigger: 'blur' },
          { validator: checkConfirmPassword, trigger: 'blur' },
        ]"
      >
        <label>确认新密码:</label>
        <el-input
          placeholder="请确认新密码"
          v-model="form.confirmpassword"
          show-password
        />
      </el-form-item>

      <el-button type="primary" icon="el-icon-check" @click="confirm()">确认</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        oldpassword: "",
        password: "",
        confirmpassword: "",
      },
      // user: JSON.parse(sessionStorage.getItem("user")),
    };
  },
  methods: {
    checkOldPassword(rule, value, callback) {
      // if (value !== this.user.password) {
      if (value !== "123456") {
        callback(new Error("旧密码不正确"));
      } else {
        callback();
      }
    },
    checkConfirmPassword(rule, value, callback) {
      if (value !== this.form.password) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    },
    confirm() {
      this.$refs.updateInfo.validate((valid) => {
        if (valid) {
          // 表单验证通过，执行密码更新操作
          // 在这里添加你的密码更新代码
          this.$confirm("是否确认修改密码?", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.$message({
                message: "修改密码成功",
                type: "success",
              });
              this.$router.push("/login");
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消修改密码",
              });
            });
        } else {
          // 表单验证失败，不执行密码更新操作
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.update-info {
  background-color: white;
  max-width: 500px;
  margin: 0 auto;
  margin-top: 5%;
  padding: 20px;
  border: 1px solid white;
  border-radius: 5px;
  box-shadow: 5px 5px 10px rgba(128, 127, 127, 0.2);
  .update-info:hover {
    box-shadow: 10px 10px 20px rgba(128, 127, 127, 0.4);
  }
  .el-button {
    display: block;
    margin-right: 50px;
    margin-left: auto;
    padding: 10px;
    border-radius: 5px;
    font-size: 16px;
  }
  .el-input {
    width: 300px;
    opacity: 0.5;
    transition: opacity 0.2s ease-in-out;
  }

  .el-input:hover {
    opacity: 1;
  }
}

.form-group {
  margin-left: 50px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
}

label {
  /* display: block; */
  margin-bottom: 5px;
  font-weight: bold;
  color: darkgray;
}
</style>
