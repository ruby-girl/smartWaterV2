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
        <remoter-water :openStatus="openStatus"  ref="remoterChild"/>
      </el-tab-pane>
      <el-tab-pane label="物联网水表" name="4" >
        <internet-water ref="interChild"/>
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
    },
    beforeRouteLeave(to, from, next) {
      if (document.getElementsByClassName('v-modal')[0])
        document.getElementsByClassName('v-modal')[0].style.display = 'block'
      next()
    },
    mounted() {
      if (document.getElementsByClassName('v-modal')[0])
        document.getElementsByClassName('v-modal')[0].style.display = 'none'
      this.typeCheck = this.$route.query.type
      this.$nextTick(() => {
        if (this.$route.query.type == 3) {
          this.$refs.remoterChild.YCMeterQueryParam.CustomerQueryValue = this.$route.query.CustomerQueryValue
          this.$refs.remoterChild.searchYCWaterList();
        } else if (this.$route.query.type == 4) {
          this.$refs.interChild.WLWQueryParam.WaterMeterNo = this.$route.query.CustomerQueryValue
          this.$refs.interChild.searchWLWMeterInfo();
        }
      })

    }
  };
</script>
