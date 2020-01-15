<template>
  <div class="section-container">
    <div class="section-full-container">
      <div ref="formHeight">
        <select-head :searchWidth="searchWidth" @getText="getText" ref="seachChild" />
      </div>
      <div class="contanier">
        <search-tips :tipsData="tipsData" ref="searchTips" @delTips="delTips" @excel="excel" />
        <div class="main-padding-20-y" id="table">
          <el-table
            :data="tableData"
            border
            fit
            :height="tableHeight"
             :summary-method="getSummaries"
    show-summary
            style="width: 100%;"
            :header-cell-style="{'background-color': '#F0F2F5'}"
          >
            <el-table-column type="index" fixed="left" label="#" width="60" align="center"></el-table-column>
            <el-table-column prop="WaterFactoryName" label="水厂" align="center"></el-table-column>
            <el-table-column prop="CreateUserName" label="操作员" align="center"></el-table-column>
            <el-table-column prop="AccountsNum" label="开户数" align="center">
              <template slot-scope="scope">
                <span class="colorStyle" @click="AccountsNum(scope.row.CreateUserId)">{{scope.row.AccountsNum}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="TransferNum" label="过户数" align="center">
              <template slot-scope="scope">
                <span class="colorStyle" @click="TransferNum">{{scope.row.TransferNum}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="AccountCancellationNum" label="销户数" align="center">
              <template slot-scope="scope">
                <span
                  class="colorStyle"
                  @click="AccountCancellationNum"
                >{{scope.row.AccountCancellationNum}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="ChangeNum" label="换表数" align="center">
              <template slot-scope="scope">
                <span class="colorStyle" @click="ChangeNum">{{scope.row.ChangeNum}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="UpgradeNum" label="水表升级数" align="center">
              <template slot-scope="scope">
                <span class="colorStyle" @click="UpgradeNum">{{scope.row.UpgradeNum}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="InsuredNum" label="低保户办理数" align="center">
              <template slot-scope="scope">
                <span class="colorStyle" @click="InsuredNum">{{scope.row.InsuredNum}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="Total" label="总计" align="center"></el-table-column>
          </el-table>
        </div>
      </div>
      <el-dialog
      :title="dialTitle"
      :visible.sync="viewWaterHistory"
      top="20vh"
      width="836px"
      hight="432px"
      center
      :close-on-click-modal="false"
    >
       <accounts-num  :meterReadListParam="selectHead" :hisData="accounData" />

      <pagination
        v-show="histotal>0"
        :total="histotal"
        :page.sync="selectHead.page"
        :limit.sync="selectHead.limit"
        @pagination=""
      />
    </el-dialog>
    
    </div>
  </div>
</template>

<script>
import SelectHead from "./components/SelectHead";
import SearchTips from "@/components/SearchTips/index";
import AccountsNum from "./components/AccountsNum";//开户
import Pagination from "@/components/Pagination/index"; //分页
import { delTips, getText, pushItem } from "@/utils/projectLogic"; //搜索条件面包屑
import {
  GetReportBusiness,
  ExcelReportBusiness,
  GetReportOpen,
  GetReportTransfer,
  GetReportAccount,
  GetReportChange,
  GetReportUpgrade,
  GetReportInsured
} from "@/api/reports";
export default {
  name: "userBusinessStatistics",
  components: { SelectHead, SearchTips,AccountsNum,Pagination  },
  data() {
    return {
      selectHead: {
        page:1,limit:10,
        waterFactoryId: "", //水厂
        waterFactoryName: "", //水厂
        createUserId: "-1", //操作人
        createUserName: "全部", //操作人
        userType: -1, //用户类型
        userTypeName: "全部",
        waterMeterType: -1, //水表类型
        waterMeterTypeName: "全部", //水表类型
        createStartTime: "",
        createEndTime: ""
      },
      detaileselectHead:{},
      tableHeight: null,
      tableData: [], //表格数据
      tipsData: [], //传入子组件的值
      tipsDataCopy: [], //表单变化的值
      searchWidth: 1024,
      histotal:0,
      accounData:[],
      viewWaterHistory:false,
      dialTitle:""
    };
  },
  methods: {
    //开户
    AccountsNum(CreateUserId) {
      this.selectHead.createUserId=CreateUserId
      GetReportOpen(this.selectHead).then(res => {
        console.log(res);
        this.dialTitle="开户详情"
        this.viewWaterHistory=true
        this.accounData=res.data
        this.histotal=res.count
      });
    },
    //过户
    TransferNum() {
      GetReportTransfer(this.selectHead).then(res => {
        console.log(res);
        this.dialTitle="过户详情"

      });
    },
    //销户
    AccountCancellationNum() {
      GetReportAccount(this.selectHead).then(res => {
        console.log(res);
        this.dialTitle="销户详情"
      });
    },
    //换表
    ChangeNum() {
      GetReportChange(this.selectHead).then(res => {
        console.log(res);this.dialTitle="换表详情"
      });
    },
    //升级
    UpgradeNum() {
      GetReportUpgrade(this.selectHead).then(res => {
        console.log(res);
        this.dialTitle="升级详情"
      });
    },
    //低保户
    InsuredNum() {
      GetReportInsured(this.selectHead).then(res => {
        console.log(res);
        this.dialTitle="低保户详情"
      });
    },
    getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] ;
          } else {
            sums[index] = '/';
          }
        });

        return sums;
      
    },
    delTips(val) {
      if (val == "dateArr") {
        //当返回的model 为时间数组  置空 时间
        this.selectHead.createStartTime = "";
        this.selectHead.createStartTime = "";
        this.$refs.seachChild.dateArr = [];
      }
      this.tipsDataCopy = delTips(val, this, this.tipsDataCopy, "selectHead");
      this.searchTableList();
    },
    getText(val, model, arr, name) {
      let obj = getText(val, model, arr, this.tipsDataCopy, this, name);
      console.log(obj);
      this.tipsDataCopy.push(obj);
    },

    //导出
    excel() {
      if (this.tableData.length == 0) {
        this.$message({
          message: "当前列表暂无数据，不可导出！",
          duration: 5 * 1000,
          type: "warning"
        });
        return false;
      }
      this.$refs.seachChild.getName();

      ExcelReportBusiness(this.selectHead).then(res => {
        if (res.code == 0) {
          window.location.href = `${this.common.excelPath}${res.data}`;
        } else {
          this.$message({
            type: "warning",
            msg: res.msg ? res.msg : "导出失败  "
          });
        }
      });
    },
    //查询
    searchTableList() {
      GetReportBusiness(this.selectHead).then(res => {
          // this.detaileselectHead=
        this.tableData = res.data;
        this.tableData.pop()
        this.tipsData = pushItem(this.tipsDataCopy);
      });
    }
  },
  mounted() {
    this.searchWidth = this.$refs.formHeight.clientWidth;
    this.$nextTick(() => {
      this.tableHeight =
        document.getElementsByClassName("section-full-container")[0]
          .offsetHeight -
        document.getElementById("table").offsetTop -
        4;

      this.$refs.searchTips.showTabBtn = false;
    });
  }
};
</script>

<style lang="scss" scoped>
.section-full-container {
  padding: 0;
}
.contanier {
  padding: 14px;
  padding-top: 0;
}
.colorStyle {
  font-size: 13px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  line-height: 31px;
  color: rgba(0, 178, 161, 1);
  text-decoration: underline;
  cursor: pointer;
}
</style>
