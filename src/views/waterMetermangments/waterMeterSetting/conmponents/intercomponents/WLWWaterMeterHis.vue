<template>
  <el-table
    :data="hisData"
    height="360"
    border
    style="width: 100%;"
    :header-cell-style="{'background-color': '#F0F2F5'}"
    :cell-style="rowClsass"
  >
    <el-table-column type="index" fixed="left" label="序号" width="60" align="center">
      <template slot-scope="scope">
        <span>{{(parms.page - 1) * parms.limit+ scope.$index + 1}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="CustomerName" label="姓名" width="150"></el-table-column>
    <el-table-column prop="IMSI" label="IMSI" width="150"></el-table-column>
    <el-table-column prop="SignalStrength" label="信号强度" width="150"></el-table-column>
    <el-table-column prop="BatteryVoltage" label="电池电压" width="150"></el-table-column>
    <el-table-column prop="ErrorStr" label="异常信息" width="150"></el-table-column>
    <el-table-column prop="TotalCumulateWater" label="水表总读数" width="150"></el-table-column>
    <el-table-column prop="RemainMoney" label="剩余金额" width="150"></el-table-column>
    <el-table-column prop="ReportingTime" label="上报时间" width="200"></el-table-column>
  </el-table>
</template>
<script>
export default {
  name: "WLWWaterMeterHis",
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
      parms: {
        page: 1,
        limit: 10
      }
    };
  },
  methods: {
    rowClsass() {
      return "text-align: center;padding:5px 0";
    }
  }
};
</script>
<style scoped>
.cell {
  text-align: center;
}
</style>