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
        <label>报警量</label>
        <span>{{ waterData.WaterAmountAlarm }}</span>
      </p>
      <p>
        <label>透支量</label>
        <span>{{ waterData.WaterAmountOverdraft  }}</span>
      </p>
    </li>
    <li class="clearfix">
      <p>
        <label>当前读数</label>
        <span>{{ waterData.TotalCumulateWater }}</span>
      </p>
      <p>
        <label>水表样式</label>
        <span>{{ waterData.WaterMeterStyle=='1701'?'立式水表': '水平水表' }}</span>
      </p>
      <p>
        <label>水表口径</label>
        <span>{{ waterData.MeterDiameter }}</span>
      </p>
    </li>
    <li class="clearfix one-third">
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
    props: ['waterData'],
    name: "WlMeter"
  }
</script>
