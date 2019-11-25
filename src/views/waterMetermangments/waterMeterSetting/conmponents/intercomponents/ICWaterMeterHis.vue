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
    <el-table-column prop="WaterMeterStyleStr" label="水表样式" width="150"></el-table-column>
    <el-table-column prop="AlarmMoney" label="报警金额（元）" width="150"></el-table-column>
    <el-table-column prop="PrepaidNum" label="充值次数" width="150"></el-table-column>
    <el-table-column prop="GuaranteedAmount" label="保底量（吨）" width="150"></el-table-column>
    <el-table-column prop="ReadDate" label="最近一次数据采集" width="200"></el-table-column>
  </el-table>
</template>
<script>
export default {
  name: "ICWaterMeterHis",
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
    rowClsass({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 3) {
        return "text-align: right;padding:5px 0";
      } else {
        return "text-align: center;padding:5px 0";
      }
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