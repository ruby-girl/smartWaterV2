<template>
  <ul class="detail-table-info">
    <li class="clearfix">
      <p>
        <label>水表类型</label>
        <span>{{ waterData.WaterMeterTypeStr }}</span>
      </p>
      <p>
        <label>水表编号</label>
        <span>{{ waterData.WaterMeterNo }}</span>
      </p>
      <p>
        <label>水表样式</label>
        <span>{{ waterData.WaterMeterStyle=='1701'?'立式水表': '水平水表' }}</span>
      </p>
      <p>
        <label>口径（mm）</label>
        <span>{{ waterData.MeterDiameter }}</span>
      </p>
    </li>
    <li class="clearfix one-third">
      <p v-show="!ifIcWter">
        <label>起始读数</label>
        <span>{{ waterData.StarReadNum }}</span>
      </p>
      <p v-show="ifIcWter">
        <label>报警金额</label>
        <span>{{ waterData.WaterYield }}</span>
      </p>
      <p>
        <label>安装位置</label>
        <span>{{ waterData.InstallAddress }}</span>
      </p>
    </li>
    <li class="clearfix whole">
      <p>
        <label>备注</label>
        <span>{{ waterData.Remark }}</span>
      </p>
    </li>
  </ul>
</template>

<script>
  import "@/styles/workBench.scss";

  export default {
    name: "MechanicsMater",
    props:['waterData','ifIcWter'],
    data() {
      return {
        //ifIC:false,//为true时Ic卡显示
      }
    }
  }
</script>
