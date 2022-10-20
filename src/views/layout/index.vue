<template>
<!-- 设置内部元素排列方向 vertical 和 horizontal -->
    <el-container direction="vertical" class="layout-container">
        
        <app-header></app-header>
        <app-section></app-section>
        <app-footer></app-footer>
    </el-container>
</template>

<script>
/* 引入子组件   (子组件的文件夹！！！！) */
import AppHeader from '@/views/layout/components/AppHeader'
import AppSection from './components/AppSection'
import AppFooter from './components/AppFooter'

export default {    
    components:{
        AppHeader,
        AppSection,
        AppFooter
    }
}
</script>

<style>
    .layout-container{
        margin: 0;
        padding: 0;
        /* 此处使用了额布局容器 必须使用vh和wh 不能使用百分比 */
        height: 100vh;
    }
</style>