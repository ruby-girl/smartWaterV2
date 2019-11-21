<template>
  <el-table
    :data="hisData"
    height="360"
    border
    style="width: 100%;"
    :header-cell-style="{'background-color': '#F0F2F5'}"
    :cell-style="rowClsass"
    :cell-class-name="moneyStyle"
    @sort-change="sortChanges"
  >
    <el-table-column type="index" width="50"></el-table-column>
    <el-table-column prop="CustomerName" :sortable="true" label="姓名" width="150"></el-table-column>
    <el-table-column prop="WaterMeterStyleStr" :sortable="true" label="水表样式" width="150"></el-table-column>
    <el-table-column prop="AlarmMoney" :sortable="true" label="报警金额（元）" width="150"></el-table-column>
    <el-table-column prop="PrepaidNum" :sortable="true" label="充值次数" width="150"></el-table-column>
    <el-table-column prop="GuaranteedAmount" :sortable="true" label="保底量（吨）" width="150"></el-table-column>
    <el-table-column prop="ReadDate" :sortable="true" label="最近一次数据采集" width="200"></el-table-column>
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
    rowClsass() {
      return "text-align: center;padding:7px 0";
    },
    moneyStyle() {
      return "text-align: right;";
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