<template>
  <el-table
    :data="moreData"
    height="360"
    border
    style="width: 100%;"
    :header-cell-style="{'background-color': '#F0F2F5'}"
  >
    <el-table-column type="index" fixed="left" label="序号" width="60" align="center">
     
    </el-table-column>
    <el-table-column prop="TotalPositiveWater" align="center" label="正向累计水量(吨)" width="150"></el-table-column>
    <el-table-column prop="TotalReverseWater" align="center" label="反向累计水量(吨)" width="150"></el-table-column>
  </el-table>
</template>
<script>
export default {
  name: "WLWWaterMeterHis",
  props: {
    moreData: {
      default: [],
      type: Array
    },
    
  }
};
</script>
<style scoped>
.cell {
  text-align: center;
}
</style>