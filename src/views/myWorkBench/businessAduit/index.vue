<template>
  <div class="section-container secur-setting">
    <el-tabs v-model="typeCheck" @>
      <el-tab-pane label="我提交的" name="1">
        <sub-mitted />
      </el-tab-pane>
      <el-tab-pane label="待我审核" name="2">
        <div>2</div>
      </el-tab-pane>
      <el-tab-pane label="我已审核" name="3">
        <div>2</div>
      </el-tab-pane>
      <el-tab-pane label="审核查询" name="4">
        <div>2</div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import SubMitted from "./components/SubMitted";
export default {
  name: "businessAduit",
  components: { SubMitted },
  data() {
    return {
      typeCheck: "1"
    };
  }
};
</script>