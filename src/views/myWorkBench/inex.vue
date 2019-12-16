<template>
  <div class="section-container secur-setting">
    <el-tabs v-model="typeCheck" @tab-click>
      <el-tab-pane label="我提交的" name="1">11111</el-tab-pane>
      <el-tab-pane label="待我审核 " name="2">222222</el-tab-pane>
      <el-tab-pane label="我已审核 " name="3">333333</el-tab-pane>
      <el-tab-pane label="审核查询 " name="4">444444</el-tab-pane>
    </el-tabs>
    <secur-dataile ref="detaile" :detaileData="detaileData" />
  </div>
</template>
<script>
export default {
  name: "BusinessAduit",
  data() {
    return {
      typeCheck: "1"
    };
  }
};
</script>