<template>
  <div>
    <el-button v-if="isAllSelected" type="primary" size="mini" @click="passAll"
      >全部通过</el-button
    >
    <el-button v-if="isAllSelected" type="danger" size="mini" @click="rejectAll"
      >全部不通过</el-button
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
  </div>
</template>

<script>
// import x from ''
export default {
  components: {},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {},
};
</script>
<style lang="scss" scoped></style>
