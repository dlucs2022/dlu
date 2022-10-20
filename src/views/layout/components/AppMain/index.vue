<template>
    <el-main class="content">
        <router-view>
            
        </router-view>
        <!-- 设置路由出口 -->
    </el-main>
</template>

<script>
export default{
}
</script>

<style scoped>
  /* 设置主页 */
    .content{
        flex:1;
        background-color: whitesmoke;
        padding: 0;
        margin: 0;
    }
</style>