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
            style="width: 100%;"
            :header-cell-style="{'background-color': '#F0F2F5'}"
          >
            <el-table-column type="index" fixed="left" label="#" width="60" align="center">
            </el-table-column>
            <el-table-column prop="WaterFactoryName" label="水厂"></el-table-column>
            <el-table-column prop="YearMonth" label="日期"></el-table-column>
            <el-table-column prop="UseWaterYield" label="用水量"></el-table-column>
            <el-table-column prop="GenWaterYield" label="供水量"></el-table-column>
            <el-table-column prop="Rate" label="产销差率"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SelectHead from "./components/SelectHead";
import SearchTips from "@/components/SearchTips/index";
import { delTips, getText, pushItem } from "@/utils/projectLogic"; //搜索条件面包屑
import { GetReportNrw, ExcelReportNrw } from "@/api/reports";
export default {
  name: "proSalesStatistics",
  components: { SelectHead, SearchTips },
  data() {
    return {
      selectHead: {
        SA_WaterFactory_Id: "", //水厂
        WaterFactoryName: "", //操作人
        YearMonth: "",
        tableId: "0000039"
      },
      tableHeight: null,
      tableData: [], //表格数据
      tipsData: [], //传入子组件的值
      tipsDataCopy: [], //表单变化的值
      searchWidth: 1024
    };
  },
  methods: {
    delTips(val) {
      if (val == "dateArr") {
        //当返回的model 为时间数组  置空 时间
        this.selectHead.YearMonth = "";
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

      ExcelReportNrw(this.selectHead).then(res => {
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
      if(this.selectHead.YearMonth==""){
        this.$message({
          type:"warning",
          message:"请选择日期"
        })
        return  false
      }
      if(this.selectHead.SA_WaterFactory_Id==""){
        this.$message({
          type:"warning",
          message:"请选择水厂"
        })
         return  false
      }
      GetReportNrw(this.selectHead).then(res => {
        this.tableData = res.data;
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
</style>
