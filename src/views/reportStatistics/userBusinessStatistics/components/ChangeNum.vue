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
    <el-table-column prop="WaterMeterTypeName" label="水表类型" width="150"></el-table-column>
    <el-table-column prop="OldWaterMeterNo" label="旧水表编号" width="150"></el-table-column>
    <el-table-column prop="OldReadNum" label="旧水表止数" width="150"></el-table-column>
    <el-table-column prop="NewWaterMeterNo" label="新水表编号" width="150"></el-table-column>
    <el-table-column prop="NewReadNum" label="新水表起数" width="150"></el-table-column>
    <el-table-column prop="OldBalance" label="换表前余额" width="150"></el-table-column>
    <el-table-column prop="NewBalance" label="换表后余额" width="150"></el-table-column>
    <el-table-column prop="ChangeMeterTypeName" label="换表类型" width="150"></el-table-column>
    <el-table-column prop="CreateUserName" label="换标操作员" width="200"></el-table-column>
    <el-table-column prop="ChangeMeterDate" label="换表日期" width="200"></el-table-column>
    <el-table-column prop="Remark" label="换表备注" width="200"></el-table-column>
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