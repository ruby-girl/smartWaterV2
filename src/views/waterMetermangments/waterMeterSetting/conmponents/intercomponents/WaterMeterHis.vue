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
    <el-table-column prop="CustomerName" label="姓名" width="150"></el-table-column>
    <el-table-column prop="WaterMeterNo" label="水表编号" width="150"></el-table-column>
    <el-table-column prop="WaterMeterStyleStr" label="水表样式" width="150"></el-table-column>
    <el-table-column prop="MeterDiameter" label="口径" width="150"></el-table-column>
    <el-table-column prop="StarReadNum" label="起始读数" width="150"></el-table-column>
    <el-table-column prop="ReadNum" label="当前读数" width="150"></el-table-column>
    <el-table-column prop="ReadDate" label="最近一次抄表日期" width="200"></el-table-column>
  </el-table>
</template>
<script>
import Pagination from "@/components/Pagination/index"; //分页
export default {
  name: "WaterMeterHis",
  components: { Pagination },
  props: {
    hisData: {
      default: [],
      type: Array
    }
  },
  methods:{
  rowClsass(){

    return 'text-align: center;padding:7px 0'
  }
  }
};
</script>
<style scoped>
    .cell{
      text-align: center
    }
</style>