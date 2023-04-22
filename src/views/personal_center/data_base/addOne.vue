<template>
    <el-dialog
        v-if="dialogVisible"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        title="上传文件"
        :visible.sync="dialogVisible"
        :show-close="false"
        width="40%">
        <el-upload
            ref="upload"
            class="upload-demo"
            drag
            name="multipartFile"
            :limit="1"
            :headers="headers"
            :action="url"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :on-exceed="handleExceed"
            :auto-upload="false">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传,当前目录只允许上传1个文件</em></div>
        </el-upload>
        <div style="margin-top: 20px">
        <el-button icon="el-icon-upload2" type="success" @click="submit">提交</el-button>
        <el-button @click="close">取消</el-button>
        </div>
    </el-dialog>
        
    
</template>

<script>
export default {
    name: 'add',
    data() {
        return {
        dialogVisible: false,
        headers: {
            // 'Authorization': 'Bearer ' + getToken()
            'Authorization': 'Bearer ' 
        },
        url:'#'
        }
    },
    methods: {
        open() {
        this.dialogVisible = true
        },
        //文件改变调用
        handleExceed() {
            this.$message.error('当前目录只能上传一个文件!');
        },
        //上传成功
        uploadSuccess(res){
            this.$message({
                type: 'success',
                message: '上传成功!'
            });
            this.$parent.updateFileName(res.data.msg,res.data.id)
            this.dialogVisible = false
        },
        //上传失败
        uploadError(){
            this.$message.error('服务器异常请重试!');
        },
        //上传文件
        submit() {
            this.$refs.upload.submit();
        },
        close(){
            this.dialogVisible = false
            this.$parent.closeAddOne();
        }
    }
}
</script>