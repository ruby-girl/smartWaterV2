<template>
  <div class="clMeterBox">
    <el-tabs v-model="typeCheck" @tab-click="handleClick">
      <el-tab-pane label="按抄表计划搜索" name="1">
        <plan ref="planChild1" v-if="plan"></plan>
      </el-tab-pane>
      <el-tab-pane label="按抄表日期搜索" name="2">
        <plan ref="planChild2" v-if="date"></plan>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import "@/styles/organization.scss";
import plan from "./components/plan";

export default {
  name: "meterQuery",
  components: { plan },
  data() {
    return {
      typeCheck: "1",
      plan: true,
      date: true
    };
  },
  watch: {
    $route(){//监听抄表设置 查看历史记录跳转
      if(this.$route.query.CustomerInfo||this.$route.query.planInfo){
        this.typeCheck = "1"
        this.$refs.planChild1.typeCheck = this.typeCheck;
        this.$refs.planChild1.$refs.childSelect.setparams(
          parseInt(this.typeCheck)
        );
      }
    }
  },
  methods: {
    handleClick() {
      if (this.typeCheck == "1") {
        this.$refs.planChild1.typeCheck = this.typeCheck;
        this.$refs.planChild1.$refs.childSelect.setparams(
          parseInt(this.typeCheck)
        );
      } else {
        this.$refs.planChild2.typeCheck = this.typeCheck;
        this.$refs.planChild2.$refs.childSelect.setparams(
          parseInt(this.typeCheck)
        );
      }
    }
  }
};
</script>
<style lang="scss">
.clMeterBox {
  width: 100%;
  position: relative;
  .cl-operation1 {
    margin: 35px 0 6px 0;
  }
  height: 100%;
  .el-tabs {
    background: #eff1f4;
    height: 100%;
  }
  .el-tabs__header {
    margin: 0 !important;
  }
  .el-tabs__content {
    height: calc(100% - 40px);
    background: #fff;
    padding-bottom: 20px;
  }
  padding: 2px 16px 0 16px;
  > div {
    background: #fff;
  }
  .cl-container > div:first-child {
    height: auto;
    padding: 0;
    width: 100%;
    position: relative;
  }
}
</style>
