<template>
  <el-dialog
      v-if="dialogVisible"
      :modal-append-to-body="false"
      title="文件属性"
      :visible.sync="dialogVisible"
      width="30%">
    <div v-loading="loading">
      <el-descriptions border :labelStyle="{width:'90px'}" :column="1">
        <el-descriptions-item label="文件名">{{data.folderName}}</el-descriptions-item>
        <el-descriptions-item label="上传时间">{{data.createTime}}</el-descriptions-item>
        <el-descriptions-item label="文件大小">{{data.size}}</el-descriptions-item>
        <el-descriptions-item label="文件数量" v-if="type == 0">{{data.num + ' 个'}}</el-descriptions-item>
        <el-descriptions-item label="文件类型" v-if="type == 1">{{data.type}}</el-descriptions-item>
        <el-descriptions-item label="标记进度" v-if="type == 0">{{data.progress}}</el-descriptions-item>
        <el-descriptions-item label="上传用户" v-if="type == 0">{{data.createUser}}</el-descriptions-item>
      </el-descriptions>
    </div>
  </el-dialog>
</template>

<script>


export default {
  name: "fileAttribute",
  data(){
    return{
      dialogVisible:false,
      type:0,
      data:{},
      loading:false
    }
  },
  created() {

  },
  methods:{
    open(type,id){
      this.type = type
      this.dialogVisible = true
      this.loading = true
      setTimeout(() => {
        this.data = {folderName:'怒江数据',createTime:'2020-03-24 16:35',size:'1.42G',num:930,type:0,progress:850,createUser:'test'}
        this.loading = false
      }, 1000);
      /* getData('/folder/queryById/'+id+'/'+type).then(res=>{
        this.data = res.data
        this.loading = false
      }) */
    }
  }
}
</script>

<style scoped>

</style>
