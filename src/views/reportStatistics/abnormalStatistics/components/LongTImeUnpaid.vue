<template>
  <div class="onBox">
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
          style="width: 100%;"
          :header-cell-style="{'background-color': '#F0F2F5'}"
         
        >
          <el-table-column type="index" fixed="left" label="#" width="60" align="center">
            <template slot-scope="scope">
              <span>{{(selectHead.page - 1) * selectHead.limit+ scope.$index + 1}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="SA_WaterFactory_Name" label="水厂" width="180"></el-table-column>
          <el-table-column align="center" prop="CustomerNo" label="用户编号" width="180"></el-table-column>
          <el-table-column align="center" prop="CustomerName" label="姓名" width="180"></el-table-column>
          <el-table-column align="center" prop="Tel" label="电话" width="180"></el-table-column>
          <el-table-column align="center" prop="IdentityNo" label="身份证" width="180"></el-table-column>
          <el-table-column align="center" prop="Address" label="地址" width="180"></el-table-column>
          <el-table-column align="center" prop="WaterMeterTypeId" label="水表类型" width="180"></el-table-column>
          <el-table-column align="center" prop="MeterDiameter" label="口径" width="180"></el-table-column>
          <el-table-column align="center" prop="UserType" label="用户类型" width="180"></el-table-column>
          <el-table-column align="center" prop="PayDate" label="最后缴费日期" width="180"></el-table-column>
          <el-table-column align="center" prop="datediffDay" label="未缴费天数" width="180"></el-table-column>
          <el-table-column align="center" prop="PriceSurplus" label="欠费金额" width="180"></el-table-column>
          <el-table-column align="center" prop="LastPayMoney" label="上次充值金额" width="180"></el-table-column>
          <el-table-column align="center" prop="Balance" label="账户余额" width="180"></el-table-column>
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="selectHead.page"
          :limit.sync="selectHead.limit"
          @pagination="searchTableList('0')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import SelectHead from "./selected/LongTimeSelected";
import SearchTips from "@/components/SearchTips/index";
import { delTips, getText, pushItem } from "@/utils/projectLogic"; //搜索条件面包屑
import { GetReportPay, ExcelReportPay } from "@/api/reports";
import Pagination from "@/components/Pagination/index"; //分页
export default {
  name: "LongTImeUnpaid",
  components: { SelectHead, SearchTips, Pagination },
  data() {
    return {
      selectHead: {
        page: 1,
        limit: 20,
        SA_WaterFactory_Id: "", //水厂
        MeterDiameter: 0, //口径
        WaterMeter: 0, //水表类型
        UserType: 0, //用户类型
        StarDateTime: "",
        EndDateTime: new Date()
      },
      tableHeight: null,
      tableData: [], //表格数据
      total: 0,
      tipsData: [], //传入子组件的值
      tipsDataCopy: [], //表单变化的值
      searchWidth: 1024,
      orderData: {}
    };
  },
  methods: {
    delTips(val) {
      if (val == "StarDateTime") {
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
      ExcelReportUser(this.orderData).then(res => {
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
    searchTableList(num) {
      if(!this.selectHead.StarDateTime){
        this.$message({
          message: "未缴费起止日期不能为空，请选择!",
          type: "warning"
        });
        return false
      }
      if (num != 0) {
        this.orderData = Object.assign({}, this.selectHead);
        this.orderData.page = 1;
      } else {
        this.orderData.page = this.selectHead.page;
        this.orderData.limit = this.selectHead.limit;
      }

      GetReportPay(this.orderData).then(res => {
        this.tipsData = pushItem(this.tipsDataCopy);
        this.tableData = res.data;
        this.total = res.count;
      });
    },
    //获取时间
    getNowTime() {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      month = month < 10 ? "0" + month : month;
      let day = date.getDate();
      day = day < 10 ? "0" + day : day;

      this.selectHead.EndDateTime = year + "-" + month + "-" + day;
    }
  },
  mounted() {
    this.searchWidth = this.$refs.formHeight.clientWidth;
    this.$nextTick(() => {
      this.tableHeight =
        document.getElementsByClassName("onBox")[0].offsetHeight -
        document.getElementById("table").offsetTop -47
        ;

      this.$refs.searchTips.showTabBtn = false;
      this.getNowTime();
    });
  }
};
</script>

<style lang="scss" scoped>
.onBox {
  height: 100%;
  padding: 0;
}
.contanier {
  padding: 14px;
  padding-top: 0;
}
</style>
