<template>
  <el-table
    :data="hisData"
    height="360"
    border
    style="width: 100%;"
    :header-cell-style="{'background-color': '#F0F2F5'}"
    :cell-style="rowClsass"
  >
    <el-table-column type="index" width="50"></el-table-column>
    <el-table-column prop="CustomerName" :sortable="true" label="姓名" width="150"></el-table-column>
    <el-table-column prop="IMSI" label="IMSI" :sortable="true" width="150"></el-table-column>
    <el-table-column prop="SignalStrength" label="信号强度" :sortable="true" width="150"></el-table-column>
    <el-table-column prop="BatteryVoltage" label="电池电压" :sortable="true" width="150"></el-table-column>
    <el-table-column prop="ErrorNo" label="异常信息" :sortable="true" width="150"></el-table-column>
    <el-table-column prop="TotalCumulateWater" label="水表总读数" :sortable="true" width="150"></el-table-column>
    <el-table-column prop="RemainMoney" label="剩余金额" :sortable="true" width="150"></el-table-column>
    <el-table-column prop="ReceiveTime" label="上报时间" :sortable="true" width="200"></el-table-column>
  </el-table>
</template>
<script>
export default {
  name: "WLWWaterMeterHis",
  props: {
    hisData: {
      default: [],
      type: Array
    }
  },
  data() {
    return {
      sortdata: {
        sort: "", // 排序方式 ASC或DESC ,
        filed: "" // 排序字段 ,
      }
    };
  },
  methods: {
    rowClsass() {
      return "text-align: center;padding:5px 0";
    },
   
  }
};
</script>
<style scoped>
.cell {
  text-align: center;
}
</style>