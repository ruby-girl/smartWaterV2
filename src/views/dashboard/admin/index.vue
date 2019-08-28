<template>
  <div class="dashboard-editor-container totalHieght" style="height: 100%">
    <panel-group :panel-data="paneldata" />
    <el-row :gutter="16">
      <el-col :xs="24" :sm="12" :lg="12">
        <div class="chart-wrapper">
          <h2>
            <i />今日缴费开户简览
          </h2>
          <bar-chart :bar-data="paneldata" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="12">
        <div class="chart-wrapper">
          <h2>
            <i />近5日缴费开户简览
          </h2>
          <line-chart :chart-data="lineChartData" />
        </div>
      </el-col>
    </el-row>
    <div class="chart-wrapper" id="oprationBox" style="padding: 16px 16px 16px;margin-bottom: 0;">
      <h2>
        <i />操作员信息
      </h2>
      <ul class="userInfo">
        <li>
          所属公司
          <span class="fr">{{ user.CompanyNames || '-' }}</span>
        </li>
        <li>
          账号
          <span class="fr">{{ user.UserName || '-' }}</span>
        </li>
        <li>
          角色
          <span class="fr">{{ user.RoleNames || '-' }}</span>
        </li>
        <li>
          人员
          <span class="fr">{{ user.EmpName || '-' }}</span>
        </li>
        <li>
          上一次登录时间
          <span class="fr">{{ user.LastLoginTime || '-' }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>

import PanelGroup from "./components/PanelGroup";
import LineChart from "./components/LineChart";
import BarChart from "./components/BarChart";
import { getDictionaryItem } from "@/api/index"; //获取字典项
import {GetTodayData, GetNearly5DaysData, GetFirstPageRoleInfo} from "@/api/index"
import { getToken } from "@/utils/auth";

export default {
  name: "DashboardAdmin",
  components: {
    PanelGroup,
    LineChart,
    BarChart
  },
  data() {
    return {
      lineChartData: {
        data: [],
        pay: [],
        openAcount: [],
        closeAcount: []
      },
      paneldata:{
        TodayPayment:'',
        TodayOpenAccount:'',
        TodayCancelAccount:'',
      },
      user:{}
    };
  },

  created() {
    this.$store.dispatch("app/setDictionary")
    let token=getToken()
    let _this=this
    try {
      window.HeadEvent.ChangeHead(token,_this.common.basePath)
    } catch (error) {
      console.log('请在CS端操作')
    }
  },
  mounted() {
    this.$nextTick(() => {
      document.getElementById('oprationBox').style.height = (document.getElementsByClassName('totalHieght')[0].offsetHeight - document.getElementById('oprationBox').offsetTop) + 'px'
    })
    this.GetNearly5DaysData()
    this.GetTodayData()
    this.GetFirstPageRoleInfo()
  },
  methods: {
    /**
     * 获取近5日缴费开户简览
     * */
    GetNearly5DaysData() {
      GetNearly5DaysData().then(res => {
        if(res.code==0) {
          let datas = res.data
          for(let i=0;i < datas.length;i++){
            this.lineChartData.data.push(datas[i].Date)
            this.lineChartData.pay.push(datas[i].Payment)
            this.lineChartData.openAcount.push(datas[i].OpenAccount)
            this.lineChartData.closeAcount.push(datas[i].CancelAccount)
          }
        }else {
          this.$message({
            message: res.message,
            type: 'warning'
          });
        }
      })
    },
    /**
     * 获取缴费开户销户信息
     * */
    GetTodayData() {
      GetTodayData().then(res => {
        if(res.code==0) {
           this.paneldata = res.data;
        }else {
          this.$message({
            message: res.message,
            type: 'warning'
          });
        }
      })
    },
    /**
     * 获取操作员信息
     * */
    GetFirstPageRoleInfo() {
      GetFirstPageRoleInfo().then(res => {
        if(res.code==0) {
          this.user = res.data
          try {
             window.FXYB_WEB_CS_Account.SetAccount(res.data.UserName)
          } catch (error) {
            console.log('请在CS端操作')
          }
        }else {
          this.$message({
            message: res.message,
            type: 'warning'
          });
        }
      })
    },

  }
};
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 16px 16px 0 16px;
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
    margin-bottom: 16px;
    h2 {
      color: #00b3a1;
      font: bold 14px "MicrosoftYaHei";
      margin: 0;
      i {
        display: inline-block;
        background: #00b3a1;
        width: 3px;
        height: 12px;
        margin-right: 8px;
      }
    }
  }
  .userInfo {
    margin-top: 24px;
    border: solid 1px #e5ebf4;
    padding: 0;
    li {
      list-style: none;
      border-bottom: solid 1px #e5ebf4;
      padding: 14px 16px;
      font-size: 14px;
      color: #8a9299;
      span {
        color: #46494d;
      }
    }
    li:last-child {
      border: none;
    }
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
