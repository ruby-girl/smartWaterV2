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
    <el-table-column type="index" fixed="left" label="序号" width="60" align="center">
      <template slot-scope="scope">
        <span>{{(parms.page - 1) * parms.limit+ scope.$index + 1}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="CustomerNo" label="用户编号" width="150"></el-table-column>
    <el-table-column prop="CustomerName" label="用户姓名" width="150"></el-table-column>
    <el-table-column prop="OldWaterMeterTypeName" label="原水表类型" width="150"></el-table-column>
    <el-table-column prop="OldSA_WaterMeterNo" label="原水表编号" width="150"></el-table-column>
    <el-table-column prop="OldMeterBalance" label="原表端金额" width="150"></el-table-column>
    <el-table-column prop="OldAccountBalance" label="原账户金额" width="150"></el-table-column>
    <el-table-column prop="NewWaterMeterTypeName" label="升级后水表类型" width="150"></el-table-column>
    <el-table-column prop="NewSA_WaterMeterNo" label="升级后水表编号" width="150"></el-table-column>
    <el-table-column prop="NewMeterBalance" label="升级后表端余额" width="150"></el-table-column>
    <el-table-column prop="NewAccountBalance" label="升级后账户余额" width="150"></el-table-column>
    <el-table-column prop="UpgradeDate" label="升级日期" width="200"></el-table-column>
    <el-table-column prop="CreateUserName" label="操作员" width="150"></el-table-column>
  </el-table>
</template>
<script>
export default {
  name: "WaterMeterHis",
  props: {
    hisData: {
      default: [],
      type: Array
    },
    meterReadListParam: {
      default: {},
      type: Object
    }
  },
  created() {
    this.parms.page = this.meterReadListParam.page;
    this.parms.limit = this.meterReadListParam.limit;
  },
  watch: {
    meterReadListParam: {
      handler() {
        this.parms.page = this.meterReadListParam.page;
        this.parms.limit = this.meterReadListParam.limit;
      },
      deep: true
    }
  },
  data() {
    return {
      sortdata: {
        sort: "", // 排序方式 ASC或DESC ,
        filed: "" // 排序字段 ,
      },
      parms: {}
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