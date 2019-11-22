<template>
  <div class="section-container">
    <div class="section-full-container">
        <el-radio-group v-model="typeCheck" class="typeChekTab">
          <el-radio :label="1">机械水表</el-radio>
          <el-radio :label="2">IC卡表</el-radio>
          <el-radio :label="3">远传水表</el-radio>
          <el-radio :label="4">物联网水表</el-radio>
        </el-radio-group>
        <mechanical-water v-if="typeCheck==1" :waterMeterList="waterMeterList" :openStatus="openStatus"/>
        <ic-water v-if="typeCheck==2" :waterMeterList="waterMeterList" :openStatus="openStatus"/>
        <remoter-water v-if="typeCheck==3"/>
        <internet-water v-if="typeCheck==4"/>
    </div>
  </div>
</template>
<script>
import "@/styles/waterMeter.scss";
import MechanicalWater  from "./conmponents/MechanicalWater";
import InternetWater  from "./conmponents/InternetWater";
import IcWater  from "./conmponents/ICWater";
import RemoterWater  from "./conmponents/RemoterWater";
import { getDictionaryOption } from "@/utils/permission";
export default {
  name: "WaterMeterSetting",
  components:{MechanicalWater,InternetWater,IcWater,RemoterWater},
  data() {
    return {
      typeCheck: 1,
      waterMeterList:[],
      openStatus:[],
    };
  },
  created(){
      this.waterMeterList = getDictionaryOption("水表样式");
      this.openStatus = getDictionaryOption("用水用户状态");
  }
};
</script>   