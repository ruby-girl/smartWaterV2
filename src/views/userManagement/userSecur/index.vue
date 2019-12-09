<template>
  <div class="section-container secur-setting">
    <el-tabs v-model="typeCheck">
      <el-tab-pane label="低保户管理" name="1">
        <user-secur-mangment />
      </el-tab-pane>
      <el-tab-pane label="历史记录 " name="2">
        <user-secur-order />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import UserSecurMangment from "./components/UserSecurMangment";
import UserSecurOrder from "./components/UserSecurOrder";
export default {
  name: "UserSecur",
  components: { UserSecurMangment, UserSecurOrder },
  data() {
    return {
      typeCheck: "1"
    };
  }
};
</script>
<style lang="scss" scoped>
.secur-setting {
  .el-tabs {
    background: #fff;
    height: 100%;
    /deep/.el-tabs__header {
      background: #eee;
      margin: 0;
    }
    /deep/.el-tabs__content {
      padding: 14px 12px;
    }
  }
}
</style>