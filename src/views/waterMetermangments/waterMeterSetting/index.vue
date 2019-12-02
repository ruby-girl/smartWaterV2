<template>
  <div class="section-container water-setting">
      <el-tabs v-model="typeCheck">
        <el-tab-pane label="机械水表" name="1">
          <mechanical-water :waterMeterList="waterMeterList" :openStatus="openStatus" />
        </el-tab-pane>
        <el-tab-pane label="IC卡表" name="2">
          <ic-water :waterMeterList="waterMeterList" :openStatus="openStatus" />
        </el-tab-pane>
        <el-tab-pane label="远传水表" name="3">
          <remoter-water :openStatus="openStatus" />
        </el-tab-pane>
        <el-tab-pane label="物联网水表" name="4">
          <internet-water />
        </el-tab-pane>
      </el-tabs>
  </div>
</template>
<script>
import "@/styles/waterMeter.scss";
import MechanicalWater from "./conmponents/MechanicalWater";
import InternetWater from "./conmponents/InternetWater";
import IcWater from "./conmponents/ICWater";
import RemoterWater from "./conmponents/RemoterWater";
import { getDictionaryOption } from "@/utils/permission"; //获取字典项
export default {
  name: "WaterMeterSetting",
  components: { MechanicalWater, InternetWater, IcWater, RemoterWater },
  data() {
    return {
      typeCheck: "1",
      waterMeterList: [],
      openStatus: []
    };
  },
  created() {
    this.waterMeterList = getDictionaryOption("水表样式");
    if (getDictionaryOption("水表样式")) {
      this.waterMeterList = getDictionaryOption("水表样式");
    } else {
      this.waterMeterList = [];
    }
    if (getDictionaryOption("用水用户状态")) {
      this.openStatus = getDictionaryOption("用水用户状态");
    } else {
      this.openStatus = [];
    }
  }
};
</script>   