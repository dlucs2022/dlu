<template>
  <div style="background-color: white">
    <el-container style="height: 800px; border: 1px solid #eee">
      <el-aside width="200px" style="margin-top: 1%">
        <div style="width: 190px; background-color: white; padding: 5px; margin: auto">
          <p style="margin: 0 auto; text-align: center">{{ user.name }}</p>
        </div>

        <el-menu :default-openeds="['1', '2']">
          <el-submenu index="1">
            <template slot="title"><i class="el-icon-message"></i>用户中心</template>
            <el-menu-item-group>
              <router-link class="alink" to="/layout/person_center/userInfo"
                ><el-menu-item index="1-1">个人信息</el-menu-item></router-link
              >
              <router-link class="alink" to="/layout/person_center/update_info"
                ><el-menu-item index="1-2">修改密码</el-menu-item></router-link
              >
              <router-link class="alink" to="/layout/person_center/check_list"
                ><el-menu-item index="1-3" :disabled="this.user.power !== '1'"
                  >审核列表</el-menu-item
                ></router-link
              >
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title"><i class="el-icon-menu"></i>云端数据库</template>
            <el-menu-item-group>
              <router-link class="alink" to="/space/bokelist"
                ><el-menu-item index="2-1">云数据</el-menu-item></router-link
              >
              <router-link class="alink" to="/space/wirterboke"
                ><el-menu-item index="2-2">云照片</el-menu-item></router-link
              >
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-container style="background-color: white">
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { MessageBox } from "element-ui";
export default {
  name: "Space",
  components: {},
  // beforeRouteEnter: (to, from, next) => {
  //   let islogin = sessionStorage.getItem("user");
  //   if (!islogin) {
  //     // 弹出提示框
  //     MessageBox.alert("请先登录", "提示", {
  //       confirmButtonText: "确定",
  //       callback: () => {
  //         next({ path: "/login" });
  //       },
  //     });
  //   }
  //   next();
  // },
  data() {
    return {
      user: JSON.parse(sessionStorage.getItem("user")),
    };
  },
  mounted() {
    if (!this.user) {
      this.$alert("请先登录", "提示", {
        confirmButtonText: "确定",
        callback: () => {
          this.$router.push("/login");
        },
      });
    }
  },
};
</script>

<style scoped>
.el-header {
  background-color: whitesmoke;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
.alink {
  text-decoration: none;
}
</style>
