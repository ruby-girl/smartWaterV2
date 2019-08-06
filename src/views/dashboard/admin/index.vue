<template>
  <div class="dashboard-editor-container">
    <panel-group @handleSetLineChartData="handleSetLineChartData" />
    <el-row :gutter="16">
      <el-col :xs="24" :sm="12" :lg="12">
        <div class="chart-wrapper">
          <h2><i></i>今日缴费开户简览</h2>
          <bar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="12">
        <div class="chart-wrapper">
          <h2><i></i>近5日缴费开户简览</h2>
          <line-chart :chart-data="lineChartData" />
        </div>
      </el-col>
    </el-row>
    <div class="chart-wrapper" style="padding: 16px 16px 16px">
      <h2><i></i>操作员信息</h2>
      <ul class="userInfo">
        <li>所属公司 <span class="fr">四川府星仪表有限公司成都分公司</span></li>
        <li>账号 <span class="fr">admin</span></li>
        <li>角色 <span class="fr">管理员</span></li>
        <li>人员 <span class="fr">管理员</span></li>
        <li>上一次登录时间 <span class="fr">2018-07-22 13:52</span></li>
      </ul>
    </div>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: 'DashboardAdmin',
  components: {
    // GithubCorner,
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 16px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
    h2 {
      color: #00B3A1;font: bold 14px '';margin: 0;
      i{display: inline-block;background: #00B3A1;width: 3px;height: 12px;margin-right: 8px;}
    }
  }
  .userInfo {
    border: solid 1px #E5EBF4;padding: 0;
    li {
      list-style: none;border-bottom: solid 1px #E5EBF4;padding: 13px 16px;font-size: 14px;color: #8A9299;
      span {color: #46494D}
    }
    li:last-child{border: none}
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
