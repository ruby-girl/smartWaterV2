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
          <el-table-column type="index" fixed="left" label="#" width="60" align="center"></el-table-column>
          <el-table-column prop="name" label="区域" width="180"></el-table-column>
          <el-table-column prop="name" label="日期" width="180"></el-table-column>
          <el-table-column prop="name" label="普通用户" width="180">
            <el-table-column prop="province" label="用户数量" width="120"></el-table-column>
            <el-table-column prop="province" label="用水量" width="120"></el-table-column>
            <el-table-column prop="province" label="占总用水量百分比" width="200"></el-table-column>
          </el-table-column>
          <el-table-column prop="name" label="单位用户" width="180">
            <el-table-column prop="province" label="用户数量" width="120"></el-table-column>
            <el-table-column prop="province" label="用水量" width="120"></el-table-column>
            <el-table-column prop="province" label="占总用水量百分比" width="200"></el-table-column>
          </el-table-column>
          <el-table-column prop="name" label="低保户" width="180">
            <el-table-column prop="province" label="用户数量" width="120"></el-table-column>
            <el-table-column prop="province" label="用水量" width="120"></el-table-column>
            <el-table-column prop="province" label="占总用水量百分比" width="200"></el-table-column>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import SelectHead from "./selected/RegionWaterSelected";
import SearchTips from "@/components/SearchTips/index";
import { delTips, getText, pushItem } from "@/utils/projectLogic"; //搜索条件面包屑
import { GetReportArea, ExcelReportArea } from "@/api/reports";
export default {
  name: "RegionWater", //按区域
  components: { SelectHead, SearchTips },
  data() {
    return {
      selectHead: {
        AreaId: "", //区域
        AreaName: "", //区域
        WaterMeterTypeId: "", //水表类型
        WaterMeterTypeName: "", //水表类型
        StartDate: "",
        EndDate: ""
      },
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
      ExcelReportArea(this.orderData).then(res => {
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
      if (num != 0) {
        this.orderData = Object.assign({}, this.listQuery);
      }
      GetReportArea(this.selectHead).then(res => {
        this.tipsData = pushItem(this.tipsDataCopy);
        this.tableData = res.data;
      });
    }
  },
  mounted() {
    this.searchWidth = this.$refs.formHeight.clientWidth;
    this.$nextTick(() => {
      this.tableHeight =
        document.getElementsByClassName("onBox")[0].offsetHeight -
        document.getElementById("table").offsetTop -
        4;

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
