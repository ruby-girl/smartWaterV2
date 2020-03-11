<template>
  <el-table
    :data="moreData"
    height="360"
    border
    style="width: 100%;"
    :header-cell-style="{'background-color': '#F0F2F5'}"
  >
    <el-table-column type="index" fixed="left" label="序号" width="60" align="center"></el-table-column>
    <el-table-column prop="WaterAmountAlarm" align="center" label="报警量(吨)" width="150"></el-table-column>
    <el-table-column prop="WaterAmountOverdraft" align="center" label="透支量(吨)" width="150"></el-table-column>
    <el-table-column prop="MonthCumulateWater" align="center" label="当月水量(吨)" width="150"></el-table-column>
    <el-table-column prop="TotalCumulateWater" align="center" label="累计水量(吨)" width="150"></el-table-column>
    <el-table-column prop="ErrorNo" align="center" label="剩余金额(元)" width="150"></el-table-column>
    <el-table-column prop="TotalCumulateWater" label="本月1阶">
      <el-table-column
        prop="UsedWaterAmountThisMonthStep1"
        align="center"
        label="水量(吨)"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="UsedWaterMoneyThisMonthStep1"
        align="center"
        label="水费(元)"
        width="120"
      ></el-table-column>
    </el-table-column>
    <el-table-column prop="TotalCumulateWater" align="center" label="本月2阶">
      <el-table-column
        prop="UsedWaterAmountThisMonthStep2"
        align="center"
        label="水量(吨)"
        width="120"
      ></el-table-column>
      <el-table-column prop="UsedWaterMoneyThisMonthStep2" align="center" label="水费(元)" width="120"></el-table-column>
    </el-table-column>
    <el-table-column prop="TotalCumulateWater" align="center" label="本月3阶">
      <el-table-column
        prop="UsedWaterAmountThisMonthStep3"
        align="center"
        label="水量(吨)"
        width="120"
      ></el-table-column>
      <el-table-column prop="UsedWaterMoneyThisMonthStep3" align="center" label="水费(元)" width="120"></el-table-column>
    </el-table-column>
    <el-table-column prop="TotalCumulateWater" align="center" label="本月4阶">
      <el-table-column
        prop="UsedWaterAmountThisMonthStep4"
        align="center"
        label="水量(吨)"
        width="120"
      ></el-table-column>
      <el-table-column prop="UsedWaterMoneyThisMonthStep4" align="center" label="水费(元)" width="120"></el-table-column>
    </el-table-column>
    <el-table-column prop="TotalCumulateWater" align="center" label="本月5阶">
      <el-table-column
        prop="UsedWaterAmountThisMonthStep5"
        align="center"
        label="水量(吨)"
        width="120"
      ></el-table-column>
      <el-table-column prop="UsedWaterMoneyThisMonthStep5" align="center" label="水费(元)" width="120"></el-table-column>
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  name: "WLWWaterMeterHis",
  props: {
    moreData: {
      default: [],
      type: Array
    }
  }
};
</script>
<style scoped>
.cell {
  text-align: center;
}
</style>