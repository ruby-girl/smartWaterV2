<template>
  <div class="int_static">
    <ul class="box_static">
      <li class="fl">
        <div class="fl" style="padding-left:10px;">
          <div class="num">{{ErrorData.Count?ErrorData.Count:0}}</div>
          <div>共计</div>
          <div>（只）</div>
        </div>
        <div class="fl imgStyel" style="padding-right:10px;">
          <img :src="imgIcon" alt />
        </div>
      </li>
      <li class="fl">
        <div class="num">{{ErrorData.NormalCount?ErrorData.NormalCount:0}}</div>
        <div>正常水表</div>
        <div>（只）</div>
      </li>
      <li class="fl">
        <div class="redColor num">{{ErrorData.ValveCount?ErrorData.ValveCount:0}}</div>
        <div>阀门异常</div>
        <div>（只）</div>
      </li>
      <li class="fl">
        <div class="redColor num">{{ErrorData.ReedSwitchCount?ErrorData.ReedSwitchCount:0}}</div>
        <div>单干簧管异常第一次</div>
        <div>（只）</div>
      </li>
      <li class="fl">
        <div class="redColor num">{{ErrorData.ReedSwitchCount2?ErrorData.ReedSwitchCount2:0}}</div>
        <div>单干簧管异常第二次</div>
        <div>（只）</div>
      </li>
      <li class="fl">
        <div class="redColor num">{{ErrorData.SensorCount?ErrorData.SensorCount:0}}</div>
        <div>传感器异常</div>
        <div>（只）</div>
      </li>
      <li class="fl">
        <div class="redColor num">{{ErrorData.OppositeCount?ErrorData.OppositeCount:0}}</div>
        <div>逆向告警</div>
        <div>（只）</div>
      </li>
      <li class="fl">
        <div class="redColor num">{{ErrorData.LowPressureCount?ErrorData.LowPressureCount:0}}</div>
        <div>电池一级低压</div>
        <div>（只）</div>
      </li>
      <li class="fl">
        <div class="redColor num">{{ErrorData.LowPressureCount2?ErrorData.LowPressureCount2:0}}</div>
        <div>电池二级低压</div>
        <div>（只）</div>
      </li>
      <li class="fl">
        <div class="redColor num">{{ErrorData.StorageCount?ErrorData.StorageCount:0}}</div>
        <div>储存器异常</div>
        <div>（只）</div>
      </li>
      <li class="fl">
        <div class="redColor num">{{ErrorData.PowerCount?ErrorData.PowerCount:0}}</div>
        <div>表端电池供电异常</div>
        <div>（只）</div>
      </li>
      <li class="fl">
        <div class="redColor num">{{ErrorData.HighFlowCount?ErrorData.HighFlowCount:0}}</div>
        <div>大流量告警</div>
        <div>（只）</div>
      </li>
      <li class="fl">
        <div class="redColor num">{{ErrorData.ContinuousFlow?ErrorData.ContinuousFlow:0}}</div>
        <div>持续流量告警</div>
        <div>（只）</div>
      </li>
      <li class="fl">
        <div class="redColor num">{{ErrorData.DerpressureCount?ErrorData.DerpressureCount:0}}</div>
        <div>高压力告警</div>
        <div>（只）</div>
      </li>
      <li class="fl">
        <div class="redColor num">{{ErrorData.UnderpressureCount?ErrorData.UnderpressureCount:0}}</div>
        <div>低压力告警</div>
        <div>（只）</div>
      </li>
      <li class="fl">
        <div class="redColor num">{{ErrorData.BLECount?ErrorData.BLECount:0}}</div>
        <div>蓝牙攻击异常</div>
        <div>（只）</div>
      </li>
      <li class="fl">
        <div class="redColor num">{{ErrorData.NBCount?ErrorData.NBCount:0}}</div>
        <div>NB攻击异常</div>
        <div>（只）</div>
      </li>
      <li class="fl">
        <div class="redColor num">{{ErrorData.PermeateCount?ErrorData.PermeateCount:0}}</div>
        <div >渗透异常告警</div>
        <div>（只）</div>
      </li>
    </ul>
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
    padding-right: 0 !important;
  }
  .firstCl {
    padding-left: 8px !important;
  }
}
@media only screen and (min-width: 1440px) {
  .imgStyel {
    padding-left: 10px;
  }
  .firstCl {
    padding-left: 20px !important;
  }
}
@media only screen and (min-width: 1680px) {
  .imgStyel {
    padding-left: 20px;
  }
  .firstCl {
    padding-left: 20px !important;
  }
}
@media only screen and (min-width: 1920px) {
  .imgStyel {
    padding-left: 30px;
  }
  .firstCl {
    padding-left: 20px !important;
  }
}
.int_static {
  overflow: auto;
}
.box_static {
  list-style: none;
  overflow: hidden;
  width: 2320px;
  margin: 0;
  padding: 0;
  li {
    margin-left: 40px;
  }
}
</style>