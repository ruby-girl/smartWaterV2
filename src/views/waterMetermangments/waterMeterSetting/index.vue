<template>
  <div class="section-container">
    <div class="section-full-container">
        <el-radio-group v-model="typeCheck" class="typeChekTab">
          <el-radio :label="1">机械水表</el-radio>
          <el-radio :label="2">IC卡表</el-radio>
          <el-radio :label="3">远传水表</el-radio>
          <el-radio :label="4">物联网水表</el-radio>
        </el-radio-group>
        <mechanical-water v-if="typeCheck==1"/>
    </div>
  </div>
</template>
<script>
import "@/styles/waterMeter.scss";
import MechanicalWater  from "./conmponents/MechanicalWater";
export default {
  name: "WaterMeterSetting",
  components:{MechanicalWater},
  data() {
    return {
      typeCheck: 1
    };
  }
};
</script>   