<template>
    <el-footer height="30px" class="footer"> 
        <h4>版权所有©理大Ai-2022</h4>
        <address class="address"><i class="el-icon-location-outline"></i>大理白族自治州大理市大理镇弘圣路2号</address>
        <address class="address"><i class="el-icon-chat-dot-round"></i>779093440@qq.com</address>
    </el-footer>
</template>

<script>
export default {

}
</script>

<style scoped>
    .footer{
        background-color: #2d3a4b;
        display: flex;
        /* 内侧的h2和div一左一右排列 */
        justify-content: space-evenly;
        align-items: center;
        /* 设置文字颜色 */
        color:whitesmoke;
    }
    .address{
        color:rgb(169, 169, 169);
        font-size: 13px;
    }
</style>