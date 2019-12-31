<template>
  <div class="error_box">
    <el-tabs v-model="typeCLick" @tab-click="handleClick">
      <el-tab-pane label="长时间未缴费" name="1">
        <LongTImeUnpaid />
      </el-tab-pane>
      <el-tab-pane label="用水异常" name="2">配置管理</el-tab-pane>
      <el-tab-pane label="机械水表异常倍率统计" name="3">角色管理</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import LongTImeUnpaid from "./components/LongTImeUnpaid";
export default {
  name: "waterStatistics",
  components: { LongTImeUnpaid },
  data() {
    return {
      typeCLick: "1"
    };
  },
  methods: {
    handleClick(tab) {}
  }
};
</script>

<style lang="scss" scoped>
.error_box {
  padding: 0 11px;
  height: 100%;
  .el-tabs {
    background: #eff1f4;
    height: 100%;
  }
   /deep/.el-tabs__header{
    margin: 0;
  }
  /deep/.el-tabs__content {
    height: calc(100% - 40px);
    background: #fff;
    padding-bottom: 20px;
    >div{
       height:100%;
    }
  }
  
}
</style>
