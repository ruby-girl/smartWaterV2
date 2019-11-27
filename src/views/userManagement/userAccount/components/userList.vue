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
    <el-table-column prop="ErrorNo" label="异常信息" width="150"></el-table-column>
    <el-table-column prop="TotalCumulateWater" label="水表总读数" width="150"></el-table-column>
    <el-table-column prop="RemainMoney" label="剩余金额" width="150"></el-table-column>
    <el-table-column prop="ReceiveTime" label="上报时间" width="200"></el-table-column>
  </el-table>
</template>