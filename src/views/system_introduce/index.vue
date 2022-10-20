<template>
    <div class="system_introduce">
        <div class="test1">
            欢迎11
        </div>

        <el-upload
            class="upload-demo"
            :multiple="true"
            ref="upload"
            action="#"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            :auto-upload="false">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
    </div>
</template>

<script>
export default {
    data() {
        return {
           fileList:[], 
        }
    },
    methods: {
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        }
    }
}
</script>

<style>
    .system_introduce {
        display: flex;
        flex: 1;
        justify-content: center;
        align-items: center;
        font-size: 50px;
        color: rgb(31, 194, 164);
        height: 100%;
    }
</style>