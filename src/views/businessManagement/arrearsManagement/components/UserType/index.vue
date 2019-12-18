<template>
  <div>
    <div ref="formHeight" class="position-search-head">
      <select-head
        :select-head="listQuery"
        @handleFilter="getList"
        @getText="getText"
        @OrdersFeeCancels="OrdersFeeCancelsFunc"
        ref="head"
      />
    </div>
    <div class="section-full-container">
      <mytable-total :list="tableTotal"></mytable-total>
      <search-tips :tipsData="tipsData" ref="searchTips" @delTips="delTips" @excel="excel" />
      <div class="main-padding-20-y">
        <el-table
          :key="tableKey"
          :data="tableData"
          border
          fit
          :height="tableHeight"
          style="width: 100%;"
          :header-cell-style="{'background-color': '#F0F2F5'}"
          @sort-change="sortChanges"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            label="as"
            fixed="left"
            type="selection"
            width="55"
            :selectable="checkboxT"
          ></el-table-column>
          <el-table-column fixed="left" label="序号" width="60" align="center">
            <template slot-scope="scope">
              <span>{{(listQuery.page - 1) *listQuery.limit+ scope.$index + 1}}</span>
            </template>
          </el-table-column>
          <template>
            <div v-for="(item ,index) in tableHead" :key="index">
              <el-table-column
                :key="index"
                min-width="160px"
                :prop="item.ColProp"
                align="center"
                :sortable="item.IsSortBol?'custom':null"
                :label="item.ColDesc"
              />
            </div>
          </template>
          <el-table-column
            label="操作"
            align="center"
            class-name="small-padding"
            width="250px"
            fixed="right"
          >
            <template slot-scope="{row}">
              <div class="display-flex justify-content-flex-center">
                <div class="main-color-warn" @click="details(row)">
                  <a>费用详情</a>
                </div>
                <div class="pl-15 pr-15" @click="reset(row.Id)">
                  <a>费用撤销</a>
                </div>
                <div class="main-color" @click="feeWaiverFunc(row)">
                  <a>费用减免</a>
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
          @pagination="getList(1)"
        />
      </div>
    </div>
    <!-- 费用详情弹窗 -->
    <charges-details :chargesDetailsShow.sync="chargesDetailsShow" :temp="temp" />
    <!-- 费用减免 -->
    <fee-waiver
      :feeWaiverShow.sync="feeWaiverShow"
      :feeWaiverItem="feeWaiverItem"
      @getList="getList"
    />
  </div>
</template>
<script>
import SelectHead from "./SelectHead";
import Pagination from "@/components/Pagination";
import SearchTips from "@/components/SearchTips/index";
import { GetList, OrdersFeeCancels, GetList_execl } from "@/api/cashCharge";
import MytableTotal from "@/components/TableTotal/index";
import { delTips, getText, pushItem } from "@/utils/projectLogic"; //搜索条件面包屑
import ChargesDetails from "../../../cashCharge/components/ChargesDetails"; //水费详情弹窗-共用现金收费的费用详情
import permission from "@/directive/permission/index.js"; // 权限判断指令
import FeeWaiver from "../../../cashCharge/components/FeeWaiver"; //水费减免弹窗
export default {
  name: "changeOperation",
  directives: { permission },
  components: {
    SelectHead,
    Pagination,
    SearchTips,
    FeeWaiver,
    ChargesDetails,
    MytableTotal
  },
  props: {
    query: {},
    factoryId: {},
    date:{}
  },
  watch: {
    date(val){
       if (val) {
         this.setQuery();   
       }  
    },
  },
  data() {
    return {
      total: 0,
      tableKey: 0,
      tableHeight: 0,
      temp: {},
      selectPintShow: false, //票据打印弹窗
      chargesDetailsShow: false,
      feeWaiverItem: {},
      feeWaiverShow: false,
      totalUser: 0,
      listQuery: {
        // 查询条件
        page: 1,
        limit: 20,
        filed: "",
        sort: "",
        Enumcqt: "1", //用户条件下拉
        Customer: "", //输入框
        SA_WaterFactory_Id: "-1", //水厂
        SA_UserArea_Id: "-1", //区域
        Star_TotalPrice: "", //欠费费用起
        End_TotalPrice: "", //欠费费用起
        Enumut: "-1", //用户类型
        Enumwm: "-1", //水表类型
        Enumcf: "-1", //费用状态
        Enumot: "-1", //费用类型
        Star_ArrearsDate: "", // 操作时间起
        End_ArrearsDate: "", // 操作时间止
        tableId: "0000019",
        timevalue: []
      },
      tableTotal: [
        { num: 0, txt: "费用笔数" },
        { num: 0, txt: "剩余未缴（元）" }
      ],
      tableData: [],
      show: false,
      tableData: [],
      checksData: [],
      tipsData: [], //传入子组件的值
      tipsDataCopy: [], //表单变化的值
      orderData: [],
      checkedDataId: [] //批量撤销ID
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
      var formHeight = this.$refs.formHeight.offsetHeight;
      const that = this;
      that.tableHeight = document.body.clientHeight - formHeight - 270;
      this.$refs.searchTips.$refs.myChild.GetTable(this.listQuery.tableId); // 先获取所有自定义字段赋值
      this.checksData = this.$refs.searchTips.$refs.myChild.checkData; // 获取自定义字段中选中了字段
    });
  },
  methods: {
    setQuery() {//水厂跳转用户，查询条件赋值
    // 重置条件
      this.$refs.head.$refs["formHeight"].resetFields();
      this.listQuery.End_TotalPrice=''
      this.tipsDataCopy = [];
      this.listQuery.SA_WaterFactory_Id = this.factoryId;
      this.listQuery.Star_ArrearsDate = this.query.Star_ArrearsDate;
      this.listQuery.End_ArrearsDate = this.query.End_ArrearsDate;
      this.listQuery.Enumot = this.query.Enumot;
      this.listQuery.Enumwm = this.query.Enumwm;
      this.listQuery.Enumut = this.query.Enumut;
      this.listQuery.Enumcf = this.query.Enumcf;  
      this.getList();
    },
    delTips(val) {
      if (val == "TotalPrice") {
        //欠费金额
        this.listQuery.Star_TotalPrice = "";
        this.listQuery.End_TotalPrice = "";
      }
      if (val == "timevalue") {
        this.listQuery.Star_ArrearsDate = "";
        this.listQuery.End_ArrearsDate = "";
      }
      if (val == "SA_UserArea_Id") {
        //区域
        this.listQuery.SA_UserArea_Id = "-1";
      }
      this.tipsDataCopy = delTips(val, this, this.tipsDataCopy, "listQuery");
      this.getList();
    },
    getText(val, model, arr, name) {
      let obj = getText(val, model, arr, this.tipsDataCopy, this, name);
      this.tipsDataCopy.push(obj);
    },
    getList(n) {
      if (!n) {
        this.orderData = Object.assign({}, this.listQuery);
        this.orderData.page = 1;
      }
      GetList(this.orderData).then(res => {
        this.tipsData = pushItem(this.tipsDataCopy);
        this.total = res.count;
        if (res.data.ot) {
          this.tableTotal[0].num = res.data.ot.OrderCount;
          this.tableTotal[1].num = res.data.ot.PriceSurplus;
        }
        this.tableData = res.data.list;
      });
    },
    sortChanges({ prop, order }) {
      //筛选
      this.listQuery.page = 1;
      this.listQuery.filed = prop;
      this.listQuery.sort =
        order == "ascending" ? "ASC" : order == "descending" ? "DESC" : "";
      this.getList();
    },
    //导出
    excel() {
      GetList_execl(this.listQuery).then(res => {
        window.location.href = `${this.common.excelPath}${res.data}`;
      });
    },
    details(row) {
      this.temp = row;
      this.chargesDetailsShow = true;
    },
    // 费用撤回
    reset(id) {
      this.$confirm("是否确认撤销欠费？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "warningBox",
        showClose: false
      }).then(() => {
        OrderFeeCancel({ SA_Order_Id: id }).then(res => {
          this.$message({
            message: res.message,
            type: "success",
            duration: 4000
          });
          this.getList();
        });
      });
    },
    // 费用减免
    feeWaiverFunc(item) {
      this.feeWaiverItem = item;
      this.feeWaiverShow = true;
    },
    OrdersFeeCancelsFunc() {
      //复选费用撤销
      if (this.checkedDataId.length < 1) {
        this.$message({
          message: "请勾选需要撤销的费用！",
          type: "error",
          duration: 4000
        });
        return;
      }
      OrdersFeeCancels({ SA_Order_Ids: this.checkedDataId }).then(res => {
        this.$message({
          message: res.message,
          type: "success",
          duration: 4000
        });
        this.handleFilter();
      });
    },
    // 费用减免
    feeWaiverFunc(item) {
      this.feeWaiverItem = item;
      this.feeWaiverShow = true;
    },
    handleSelectionChange(val) {
      this.checkedDataId = val.map(item => {
        return item.Id;
      });
    },
    checkboxT(row, index) {
      //勾选禁用
      if (row.ChargeFlag == 1003) {
        return false;
      }
      return true;
    }
  }
};
</script>
<style lang="scss" scoped>
.section-full-container {
  padding-top: 0;
}
.color-more-black {
  color: #46494c;
}
.button-width {
  width: 80px;
  text-align: center;
}
</style>


