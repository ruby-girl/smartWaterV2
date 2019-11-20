<template>
  <!-- 账单详情 -->
  <div class="section-container">
    <div class="section-full-container">
      <div ref="formHeight">
        <select-head
          :select-head="listQuery"
          @handleFilter="handleFilter"
          @toggleShow="toggleShow"
        />
      </div>
      <div class="table-top-btn-padding display-flex justify-content-flex-justify">
        <div></div>
        <div>
          <el-button type="success" size="mini" @click="excel">
            <i class="iconfont icondaochuexcel"></i>导出Excel
          </el-button>
          <el-button type="warning" size="mini" @click="setCustomData()">
            <i class="iconfont iconbiaogezidingyi"></i>表格自定义
          </el-button>
        </div>
      </div>
      <customTable ref="myChild" />
      <div class="main-padding-20-y">
        <el-table
          :key="tableKey"
          :data="tableData"
          border
          :height="tableHeight"
          style="width: 100%;"
          :header-cell-style="{'background-color': '#F0F2F5'}"
          :cell-style="{'padding':'7px 0'}"
          @sort-change="sortChanges"
        >
          <el-table-column type="index" fixed="left" label="序号" width="80" align="center" />
          <template v-for="(item ,index) in tableHead">
            <el-table-column
              :key="index"
              min-width="130px"
              :prop="item.ColProp"
              align="center"
              :sortable="item.IsSortBol?'custom':null"
              :label="item.ColDesc"
            />
          </template>
          <el-table-column
            label="操作"
            width="200"
            align="center"
            fixed="right"
            class-name="small-padding"
          >
            <template slot-scope="{row}">
              <div class="display-flex">
                <div class="main-color-warn pl-15" @click="details(row)">
                  <a>费用详情</a>
                </div>
                <div class="pl-15" @click="reset(row)">
                  <a>费用撤销</a>
                </div>             
              </div>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.limit"
          @pagination="getList"
        />
      </div>
      <charges-details :chargesDetailsShow.sync="chargesDetailsShow" :temp="temp"/>
    </div>
  </div>
</template>
<script>
import SelectHead from "./components/SelectHead";
import Pagination from "@/components/Pagination";
import customTable from "@/components/CustomTable/index";
import ChargesDetails from "../cashCharge/components/ChargesDetails"; //水费详情弹窗-共用现金收费的费用详情
import {
  SelectBillDataList,SelectBillDataListToExcel,OrderFeeCancel
} from "@/api/cashCharge";
export default {
  name: "billDetails",
  components: { SelectHead, Pagination, customTable,ChargesDetails},
  data() {
    return {
      total: 0,
      tableKey: 0,
      tableHeight: 0,
      temp: {},
      listQuery: {
        // 查询条件
        page: 1,
        limit: 10,
        filed: "",
        sort: "",
        CustomerQueryType: "1", //用户类型
        CustomerQueryValue: '', // input值
        WaterMeterTypeId:"-1",//水表类型
        // PayMentState:"-1",//缴费状态
        PayMentType:"-1",//缴费方式
        FeeType:"-1",//费用类型
        FeeState:"-1",//费用状态
        StartPayMentDate:'',//缴费时间起
        EndPayMentDate:'',//缴费时间止
        ReceiveMoneyUser:"-1",//收款人
        WaterFactory:"-1",//水厂
        editStartTime: "", // 操作时间起
        editEndTime: "", // 操作时间止
        tableId: "0000020"
      },
      tableData: [],
      checksData: [],
      chargesDetailsShow:false//费用弹窗
    };
  },
  computed: {
    tableHead: function() {
      let arrayHead = this.checksData.filter(item => {
        return item.IsCheck;
      });
      return arrayHead;
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      // 自适应表格高度
      this.toggleShow();
      this.$refs.myChild.GetTable(this.listQuery.tableId); // 先获取所有自定义字段赋值
      this.checksData = this.$refs.myChild.checkData; // 获取自定义字段中选中了字段
    });
  },
  methods: {
    setCustomData() {
      this.$refs.myChild.isCustom = !this.$refs.myChild.isCustom;
      if (this.$refs.myChild.isCustom) this.tableHeight = this.tableHeight - 80;
      else this.tableHeight = this.tableHeight + 80;
    },
    getList() {
      SelectBillDataList(this.listQuery).then(res => {
        this.total = res.count;
        this.tableData = res.data;
      });
    },
    sortChanges({ prop, order }) {
      //筛选
      this.listQuery.filed = prop;
      this.listQuery.sort =
        order == "ascending" ? "ASC" : order == "descending" ? "DESC" : "";
      if (this.tableData.length > 0) {
        this.listQuery.page = 1;
        this.getList();
      }
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    reset(r) {
      this.$confirm("是否确认撤销费用？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "warningBox",
        showClose: false
      }).then(() => {
        OrderFeeCancel({SA_Order_Id:r.Id}).then(res => {
          this.$message({
            message: res.message,
            type: "success",
            duration: 4000
          });
          this.getList();
        });
      });
    },
    excel() {
      //导出
      SelectBillDataListToExcel(this.listQuery).then(res => {
        window.location.href = `${this.common.excelPath}${res.data}`;
      });
    },
    // 点击展开收起搜索条件时，处理表格高度
    toggleShow() {
      const that = this;
      setTimeout(function() {
        var formHeight = that.$refs.formHeight.offsetHeight;
        that.tableHeight = document.body.clientHeight - formHeight - 220;
      }, 350);
    },
    // 费用详情
    details(item){
      this.temp=item
      this.chargesDetailsShow=true
    }
  }
};
</script>

