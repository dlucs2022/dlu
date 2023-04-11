<template>
    <el-card class="check_lsit_card">
        <el-button type="danger" size="mini" @click="rejectAll" style="float: right"
        >全部不通过</el-button
      >
      <el-button type="primary" size="mini" @click="passAll" style="float: right"
        >全部拒绝</el-button
      >
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="姓名" align="center"></el-table-column>
        <el-table-column
          prop="create_time"
          label="注册时间"
          align="center"
        ></el-table-column>
        <el-table-column prop="status" label="审核状态" align="center"></el-table-column>

        <el-table-column label="审核" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="updateInfo(scope.row)"
              >通过</el-button
            >
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="del(scope.row)"
              >不通过</el-button
            >
          </template></el-table-column
        >
      </el-table>
    </el-card>
</template>

<script>
import dao1 from '@/api/dao1'
export default {
    data(){
        return{
            tableData: [],
            allSelected: false,
        }
    },
    mounted() {
        this.getTableData()
    },
    methods: {
        async getTableData() {
            const res = await dao1.checkList();
            this.tableData = res.data;
        },
        checkAllSelected() {
            this.allSelected = this.tableData.every((row) => row.checked);
        },
        rejectAll(){

        },
        passAll(){

        }
    },
}
</script>
<style lang="scss">
    .check_lsit_card{
        margin-top: 50px;
        width: 1000px;
        margin:50px auto;
    }
</style>