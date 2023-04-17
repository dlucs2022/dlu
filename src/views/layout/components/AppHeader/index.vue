<template>
  <el-header height="60px" class="header">
    <h3 class="title">
      <!-- <img src="../../../../assets/etoak_logo.png" class="logo"> -->
      智拣AI
    </h3>

    <div class="menu">
      <el-menu
        :router="true"
        :default-active="$route.path"
        class="el-menu-demo"
        mode="horizontal"
      >
        <!-- @select="handleSelect"
          @open="handleOpen"
          @close="handleClose" -->
        <!-- background-color="#2d3a4b" -->
        <!-- <el-submenu index="1">
                      <template slot="title"> <i class="el-icon-s-home"></i>关于我们</template>
                      <el-menu-item index="/layout/system_introduce">系统功能</el-menu-item>
                      <el-menu-item index="1-2">团队风采</el-menu-item>
                      <el-menu-item index="1-3">联系我们</el-menu-item>
                      <el-submenu index="1-4">
                      <template slot="title">选项4</template>
                      <el-menu-item index="1-4-1">选项1</el-menu-item>
                      <el-menu-item index="1-4-2">选项2</el-menu-item>
                      <el-menu-item index="1-4-3">选项3</el-menu-item>
                      </el-submenu>git config --global http.proxy http://127.0.0.1:1080
                  </el-submenu> -->
        <el-menu-item index="/layout/system_introduce">主页</el-menu-item>
        <el-menu-item index="/layout/image_classification"
          ><i class="el-icon-picture-outline"></i> 图片分拣</el-menu-item
        >
        <el-submenu index="3">
          <template slot="title"> <i class="el-icon-user"></i>个人中心 </template>
          <el-menu-item index="3-1"
            ><i class="el-icon-edit-outline"></i> 信息修改</el-menu-item
          >
          <el-menu-item index="/layout/person_center/check_list"
            ><i class="el-icon-document"></i> 审核列表</el-menu-item
          >
          <el-menu-item index="3-1"
            ><i class="el-icon-cloudy"></i> 云端数据库</el-menu-item
          >
        </el-submenu>
      </el-menu>
    </div>

    <div class="info">
      <span class="show" v-show="this.user.name">{{ this.user.name }}欢迎您回来</span>
      <el-button
        type="text"
        v-if="!user"
        @click="$router.push('/login')"
        style="margin-left: 20px"
      >
        <i class="el-icon-user-solid"></i> 登录
      </el-button>

      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          操作<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item icon="el-icon-edit-outline" command="a"
            >信息管理</el-dropdown-item
          >
          <el-dropdown-item icon="el-icon-edit" command="b">修改密码</el-dropdown-item>
          <el-dropdown-item icon="el-icon-close" command="c">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script>
import checkList from "@/views/personal_center/check_list/index.vue";

export default {
  components: {
    checkList,
  },
  data() {
    return {
      user: "",
    };
  },
  mounted() {
    // this.getTableData();
    const user = sessionStorage.getItem("user");
    if (user) {
      this.user = JSON.parse(user);
    } else {
      this.user = null;
    }
    this.username = this.$route.query.username;
  },
  methods: {
    // getInfo(){
    //     /* JSON.parse一定要写 不然拿不出来 */
    //     const user = JSON.parse(localStorage.getItem('et2111elementui'))
    //     if(!user){
    //         this.$message({
    //             type:'error',
    //             message:'还没登录呐！！！！！！！！'
    //         })
    //         setTimeout(()=>{
    //             this.$router.push('/')
    //         },1500)
    //         return
    //     }
    //     this.user = user
    // },
    // /* 这里的command对应  <el-dropdown-item command="对应这里">*/
    handleCommand(command) {
      switch (command) {
        case "a":
          this.dialogFormVisible = true;
          break;
        case "c":
          sessionStorage.removeItem("user");
          this.user = "";
          this.$router.push("/");
          location.reload();
          break;
        default:
          break;
      }
    },
    created() {
      // this.getInfo()
    },
  },
};
</script>

<style scoped>
/* 设置页眉 */
.header {
  /* background-color: #2d3a4b; */
  display: flex;
  /* 内侧的h2和div一左一右排列 */
  justify-content: space-between;
  align-items: center;
  /* 设置文字颜色 */
  color: #2d3a4b;
}

/* 微调页眉 */
.header .logo {
  width: 30px;
  margin-left: 40px;
  vertical-align: middle;
}
.header .info {
  margin-right: 30px;
}
.el-dropdown {
  margin-left: 20px;
}
.el-dropdown-link {
  color: #2d3a4b;
  cursor: pointer;
  font-weight: bolder;
}
.menu {
  height: 100%;
  color: #2d3a4b;
}
.el-menu {
  height: 100%;
  border: 0px;
}
</style>
