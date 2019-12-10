<template>
  <div class="int_static">
    <el-row :gutter="40">
      <el-col :span="2" style="padding-right:0" class="firstCl">
        <div class="fl" style="padding-left:10px;">
          <div class="num">{{ErrorData.AllMeterNumber}}</div>
          <div>共计</div>
          <div>（只）</div>
        </div>
        <div class="fl imgStyel" style="padding-right:10px;">
          <img :src="imgIcon" alt />
        </div>
      </el-col>
      <el-col :span="2">
        <div class="num">{{ErrorData.NormalMeterNumber}}</div>
        <div>正常水表</div>
        <div>（只）</div>
      </el-col>
      <el-col :span="2">
        <div class="num redColor">{{ErrorData.ValveAbNormalMeterNumber}}</div>
        <div>阀门异常</div>
        <div>（只）</div>
      </el-col>
      <el-col :span="3">
        <div class="num redColor">{{ErrorData.SingleDryReedPipeErrorNumber1}}</div>
        <div>单干簧管异常第一次</div>
        <div>（只）</div>
      </el-col>
      <el-col :span="3">
        <div class="num redColor">{{ErrorData.SingleDryReedPipeErrorNumber2}}</div>
        <div>单干簧管异常第二次</div>
        <div>（只）</div>
      </el-col>
      <el-col :span="2">
        <div class="num redColor">{{ErrorData.StrongMagnetErrorNumber}}</div>
        <div>强磁异常</div>
        <div>（只）</div>
      </el-col>
      <el-col :span="2">
        <div class="num redColor">{{ErrorData.LowTensionNumber1}}</div>
        <div>电池一级低压</div>
        <div>（只）</div>
      </el-col>
      <el-col :span="2">
        <div class="num redColor">{{ErrorData.LowTensionNumber2}}</div>
        <div>电池二级低压</div>
        <div>（只）</div>
      </el-col>
      <el-col :span="2">
        <div class="num redColor">{{ErrorData.MemorizerErrorNumber}}</div>
        <div>存储器异常</div>
        <div>（只）</div>
      </el-col>
      <el-col :span="3">
        <div class="num redColor">{{ErrorData.BatteryPoweredErrorNumber}}</div>
        <div>表端电池供电异常</div>
        <div>（只）</div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import imgIcon from "@/assets/imgs/ab_static.png";

export default {
  name: "internetWater",
  props: {
    ErrorList: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      imgIcon: imgIcon,
      ErrorData: {
        AllMeterNumber: "0",
        NormalMeterNumber: "0",
        ValveAbNormalMeterNumber: "0",
        SingleDryReedPipeErrorNumber1: "0",
        SingleDryReedPipeErrorNumber2: "0",
        StrongMagnetErrorNumber: "0",
        LowTensionNumber1: "0",
        LowTensionNumber2: "0",
        MemorizerErrorNumber: "0",
        BatteryPoweredErrorNumber: "0"
      }
    };
  },
  watch: {
    ErrorList() {
      this.ErrorData = this.ErrorList;
    }
  }
};
</script>
<style lang="scss" scoped>
@media only screen and (min-width: 1024px) {
  .imgStyel {
    padding-left: 0px;
    padding-right: 0!important;
    
  }
  .firstCl{
    padding-left: 8px!important;
  }
}
@media only screen and (min-width: 1440px) {
  .imgStyel {
    padding-left: 10px;
    
  }
  .firstCl{
    padding-left: 20px!important;
  }
}
@media only screen and (min-width: 1680px) {
  .imgStyel {
    padding-left: 20px;
  }
  .firstCl{
    padding-left: 20px!important;
  }
}
@media only screen and (min-width: 1920px) {
  .imgStyel {
    padding-left: 30px;
  }
  .firstCl{
    padding-left: 20px!important;
  }
}

</style>