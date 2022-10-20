<template>
    <el-container class="section">
        <app-main></app-main>
    </el-container>
</template>

<script>
import AppMain from '../AppMain'
export default {
    components:{
        AppMain
    }
}
</script>

<style scoped>
    /* 设置主体部分 */
    .section{
        /* 默认项目是主侧边栏和主页，正好一左一右 */
        display: flex;
        flex:1;
    }
</style>