<template>
  <div class="main-padding-20-y" id="table">
    <el-table
      :key="tableKey"
      :data="tableData"
      border
      fit
      :height="tableHeight"
      style="width: 100%;"
      :header-cell-style="{'background-color': '#F0F2F5'}"
      :cell-style="{'padding':'7px 0'}"
    >
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column fixed prop="CustomerName" label="姓名" width="150"></el-table-column>
      <el-table-column fixed prop="WaterMeterNo" label="水表编号" width="150"></el-table-column>
      <el-table-column fixed prop="WaterMeterStyleStr" label="水表样式" width="150"></el-table-column>
      <el-table-column fixed prop="MeterDiameter" label="口径" width="150"></el-table-column>
      <el-table-column fixed prop="StarReadNum" label="起始读数" width="150"></el-table-column>
      <el-table-column fixed prop="ReadNum" label="当前读数" width="150"></el-table-column>
      <el-table-column fixed prop="ReadDate" label="最近一次抄表日期" width="150"></el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="wachMeterData.page"
      :limit.sync="wachMeterData.limit"
    />
  </div>
</template>
<script>
export default {
  name: "WaterMeterHis"
};
</script>