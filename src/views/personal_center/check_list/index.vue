<template>
  <el-card class="check_lsit_card">
    <el-button
      type="danger"
      v-if="multipleSelection.length === this.tableData.length"
      size="mini"
      @click="rejectAll"
      style="float: right; margin-right: 30px"
      >全部拒绝</el-button
    >
    <el-button
      type="primary"
      v-if="multipleSelection.length === this.tableData.length"
      size="mini"
      @click="passAll"
      style="float: right; margin-right: 10px"
      >全部通过</el-button
    >
    <el-table
      :data="tableData"
      @select="handleSelect"
      @selection-change="handleSelectionChange"
      ref="multipleTable"
      style="width: 100%"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="name" label="姓名" align="center" sortable></el-table-column>
      <el-table-column
        prop="create_time"
        label="注册时间"
        align="center"
        sortable
      ></el-table-column>
      <el-table-column
        prop="status"
        label="审核状态"
        align="center"
        sortable
      ></el-table-column>

      <el-table-column label="审核" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="pass(scope.row)"
            >通过</el-button
          >
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="reject(scope.row)"
            >不通过</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      style="margin: 10px auto; width: 100%"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="itemsPerPage"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </el-card>
</template>

<script>
import dao from "@/api/dao";

export default {
  props: {
    userData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      multipleSelection: [],
      tableData: [],
      allSelected: false,
      user: {},
      itemsPerPage: 10, //每页记录数
      page: 1, //当前页
      total: 0,
    };
  },
  mounted() {
    // this.getTableData();
    const user = sessionStorage.getItem("user");
    if (user) {
      this.user = JSON.parse(user);
    } else {
      this.user = "";
    }
    console.log("user", this.user);

    this.getTableData();
  },
  methods: {
    ///////////////////////////
    /* 分页相关 */
    ///////////////////////////
    /* 改变每页记录数 */
    handleSizeChange(val) {
      /* 当"每页记录数"发生改变时 触发  val为更改后的每页记录数 */
      this.itemsPerPage = val;
      this.getTableData();
    },
    /* 当前页改变 激发 */
    handleCurrentChange(val) {
      this.page = val;
      this.getTableData();
    },

    // 选择事件
    handleSelect(selection, row) {
      console.log(row.status);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val; //存储选中的数据
      console.log(val);
    },
    async getTableData() {
      await dao
        .checkList(this.user.invite_code, this.page, this.itemsPerPage)
        .then((res) => {
          this.tableData = res.data.data.rows;
          this.total = res.data.data.total;
        });
      console.log("tableData", this.tableData);
    },

    checkAllSelected() {
      this.allSelected = this.tableData.every((row) => row.checked);
    },
    pass(row) {
      console.log("通过", row.name);
      dao.multiPass(row.name).then(() => {
        this.getTableData();
      });
    },
    reject(row) {
      console.log("不通过", row.name);
      dao.multiRefuse(row.name).then(() => {
        this.getTableData();
      });
    },
    rejectAll() {
      const names = this.multipleSelection.map((row) => row.name);
      // row.status = "通过";
      // console.log(names);
      dao.multiRefuse(names).then(() => {
        this.getTableData();
      });
    },
    passAll() {
      const names = this.multipleSelection.map((row) => row.name);
      // row.status = "通过";
      // console.log(names);
      dao.multiPass(names).then(() => {
        this.getTableData();
      });
    },
  },
};
</script>
<style lang="scss">
.check_lsit_card {
  margin-top: 50px;
  width: 1000px;
  margin: 50px auto;
}
</style>
