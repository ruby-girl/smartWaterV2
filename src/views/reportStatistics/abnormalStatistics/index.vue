<template>
  <div class="error_box">
    <el-tabs v-model="typeCLick" @tab-click="handleClick">
      <el-tab-pane label="长时间未缴费" name="1">
        <LongTImeUnpaid v-if="long" />
      </el-tab-pane>
      <el-tab-pane label="用水异常" name="2">
        <WaterUseMal v-if="use" />
      </el-tab-pane>
      <el-tab-pane label="机械水表异常倍率统计" name="3">
        <WaterMetermal v-if="water" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import LongTImeUnpaid from "./components/LongTImeUnpaid";
import WaterMetermal from "./components/WaterMetermal";
import WaterUseMal from "./components/WaterUseMal";
export default {
  name: "abnormalStatistics",
  components: { LongTImeUnpaid, WaterMetermal, WaterUseMal },
  data() {
    return {
      typeCLick: "1",
      long: true,
      water: false,
      use: false
    };
  },
  methods: {
    handleClick(tab) {
      if (this.typeCLick == "1") {
        this.long = true;
        this.water = false;
        this.use = false;
      } else if (this.typeCLick == "2") {
        this.long = false;
        this.use = true;
        this.water = false;
      } else {
        this.long = false;
        this.water = true;
        this.use = false;
      }
    }
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
  /deep/.el-tabs__header {
    margin: 0;
  }
  /deep/.el-tabs__content {
    height: calc(100% - 40px);
    background: #fff;
    padding-bottom: 20px;
    > div {
      height: 100%;
    }
  }
}
</style>
