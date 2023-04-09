<template>
  <div class="studentList">
    <!-- 表格内容 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="name" label="姓名" align="center"> </el-table-column>
      <el-table-column prop="time" label="注册时间" align="center"> </el-table-column>
      <el-table-column label="审核" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="passAudit(scope.row)"
            >通过审核</el-button
          >
          <el-button type="danger" size="mini" @click="failAudit(scope.row)"
            >不通过审核</el-button
          >
        </template></el-table-column
      >
    </el-table>
    <!-- 新增信息弹窗 -->
  </div>
</template>

<script>
export default {
  name: "studentsList",
  data() {
    return {
      rules: {
        name: [{ required: true, message: "请输入姓名" }],
      },
      formInline: {
        name: "",
        number: "",
      },
      tableData: [],
      state: true,
      dialogFormVisible: false,
      form: {
        name: "",
      },
      formLabelWidth: "80px",
    };
  },
  methods: {
    addStudent() {
      this.dialogFormVisible = true;
    },
    find() {
      console.log(this.form);
    },
    sure(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          // 调用新增信息的接口
          console.log(this.form);
          this.tableData.push(this.form);
          this.dialogFormVisible = false;
          this.form = {};
          if (this.state) {
            // 调用添加接口
            this.service.post("students");
          } else {
            // 调用修改接口
          }
        } else {
          console.error(this.form);
        }
      });
    },
    updateInfo(row) {
      this.state = false;
      this.dialogFormVisible = true;
      this.form = row;
    },
    del(row) {
      console.log(row);
    },
  },
};
</script>

<style lang="scss" scoped>
.studentList {
  .demo-form-inline,
  .el-form-item {
    text-align: left;
  }
  .el-select {
    width: 100%;
  }
  .dialog-footer {
    // text-align: center;
  }
}
</style>
