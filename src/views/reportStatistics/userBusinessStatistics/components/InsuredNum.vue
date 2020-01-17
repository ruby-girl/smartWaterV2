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
    <el-table-column prop="CustomerName" label="姓名" width="150"></el-table-column>
    <el-table-column prop="WaterWorksName" label="水厂" width="150"></el-table-column>
    <el-table-column prop="AreaName" label="所属区域" width="150"></el-table-column>
    <el-table-column prop="WaterMeterTypeName" label="水表类型" width="150"></el-table-column>
    <el-table-column prop="UseWaterTypeName" label="用水性质" width="150"></el-table-column>
    <el-table-column prop="UserTypeName" label="用户类型" width="150"></el-table-column>
    <el-table-column prop="Tel" label="电话" width="150"></el-table-column>
    <el-table-column prop="CustomerStateName" label="用户状态" width="150"></el-table-column>
    <el-table-column prop="CreateUserName" label="操作人" width="150"></el-table-column>
    <el-table-column prop="OperAccountDate" label="操作日期" width="200"></el-table-column>
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