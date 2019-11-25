<template>
  <el-table
    :data="hisData"
    height="360"
    border
    style="width: 100%;"
    :header-cell-style="{'background-color': '#F0F2F5'}"
    :cell-style="rowClsass"
    @sort-change="sortChanges"
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
export default {
  name: "WaterMeterHis",
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
    sortChanges({ column, prop, order }) {
      let that = this;
      this.sortdata.filed = prop;
      this.sortdata.sort =
        order == "ascending" ? "ASC" : order == "descending" ? "DESC" : "";
      this.$emit("sortProp", this.sortdata);
    }
  }
};
</script>
<style scoped>
.cell {
  text-align: center;
}
</style>