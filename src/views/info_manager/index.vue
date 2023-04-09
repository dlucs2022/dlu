<template>
  <div>
    <el-dialog title="收货地址" :visible.sync="dialogTableVisible">
      <Info></Info>
    </el-dialog>
    <!-- <AppHeader></AppHeader>

    <AppFooter></AppFooter> -->
  </div>
</template>

<script>
import AppHeader from "@/views/layout/components/AppHeader/index.vue";
import AppFooter from "@/views/layout/components/AppFooter/index.vue";
import Info from "./info/info.vue";
export default {
  components: { AppHeader, AppFooter, Info },
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
