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
          :summary-method="getSummaries"
          show-summary
          style="width: 100%;"
          :header-cell-style="{ 'background-color': '#F0F2F5' }"
        >
          <el-table-column type="index" fixed="left" label="#" width="60" align="center"></el-table-column>
          <el-table-column prop="CustomerNo" label="用户编号"></el-table-column>
          <el-table-column prop="CustomerName" label="用户姓名"></el-table-column>
          <el-table-column prop="WCDate" label="日期"></el-table-column>
          <el-table-column prop="WaterConsumption" label="用水量"></el-table-column>
          <el-table-column prop="Growth" label="增水量"></el-table-column>
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
import SelectHead from "./selected/UserWaterSelected";
import SearchTips from "@/components/SearchTips/index";
import { delTips, getText, pushItem } from "@/utils/projectLogic"; //搜索条件面包屑
import Pagination from "@/components/Pagination/index"; //分页
import { GetReportUser, ExcelReportUser } from "@/api/reports";
export default {
  name: "UserWater", //按用户
  components: { SelectHead, SearchTips, Pagination },
  data() {
    return {
      selectHead: {
        page: 1,
        limit: 20,
        CustomerQueryType: "1",
        UserNo: "", //用户编号
        UserName: "", //用户姓名
        StartDate: "",
        EndDate: ""
      },
      total: 0,
      tableHeight: null,
      tableData: [], //表格数据
      tipsData: [], //传入子组件的值
      tipsDataCopy: [], //表单变化的值
      searchWidth: 1024,
      orderData: {}
    };
  },
  methods: {
    delTips(val) {
      if (val == "dateArr") {
        //当返回的model 为时间数组  置空 时间
        this.selectHead.StartDate = "";
        this.selectHead.EndDate = "";
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
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (index === 1) {
          sums[index] = "/";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return "/";
            }
          }, 0);
          sums[index];
        } else {
          sums[index] = "/";
        }
      });

      return sums;
    },
    //查询
    searchTableList(num) {
      if (this.selectHead.StartDate == "" || this.selectHead.StartDate == "") {
        this.$message({
          type: "warning",
          message: "请选择日期后再操作"
        });
        return false;
      }
      if (num != 0) {
        this.orderData = Object.assign({}, this.listQuery);
        this.orderData.page = 1;
      } else {
        this.orderData.page = this.selectHead.page;
        this.orderData.limit = this.selectHead.limit;
      }

      GetReportUser(this.selectHead).then(res => {
        this.tipsData = pushItem(this.tipsDataCopy);
        this.tableData = res.data;
        this.total = res.count;
        this.tableData.pop();
      });
    }
  },
  mounted() {
    this.searchWidth = this.$refs.formHeight.clientWidth;
    this.$nextTick(() => {
      this.tableHeight =
        document.getElementsByClassName("onBox")[0].offsetHeight -
        document.getElementById("table").offsetTop -
        47;

      this.$refs.searchTips.showTabBtn = false;
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
