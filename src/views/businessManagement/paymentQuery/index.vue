<template>
  <!-- 收费查询 -->
  <div class="section-container">
    <div ref="formHeight" class="position-search-head">
      <select-head :select-head="listQuery" @handleFilter="getList"  @getText="getText"/>
    </div>
    <div class="section-full-container">
      <div class="main-padding-20-y">
        <table-total :list="tableTotal"></table-total>
        <search-tips :tipsData="tipsData" ref="searchTips" @delTips="delTips" @excel="excel" />
        <el-table
          :key="tableKey"
          :data="tableData"
          border
          :height="tableHeight"
          style="width: 100%;"
          :header-cell-style="{'background-color': '#F0F2F5'}"
          @sort-change="sortChanges"
        >
          <el-table-column fixed="left" label="序号" width="60" align="center">
            <template slot-scope="scope">
              <span>{{(listQuery.page - 1) *listQuery.limit+ scope.$index + 1}}</span>
            </template>
          </el-table-column>
          <template v-for="(item ,index) in tableHead">
            <el-table-column
              :key="index"
              min-width="150px"
              :prop="item.ColProp"
              align="center"
              :sortable="item.IsSortBol?'custom':null"
              :label="item.ColDesc"
            />
          </template>
          <el-table-column
            label="操作"
            width="112"
            align="center"
            fixed="right"
            class-name="small-padding"
          >
            <template slot-scope="{row}">
              <div class="display-flex justify-content-flex-center secur-content">
                <!-- <div class="main-color-warn" @click="billDetails(row)">
                  <a>账单详情</a>
                </div>
                <div class="main-color-red pl-15 pr-15" @click="invoice(row)">
                  <a>数据冲红</a>
                </div>
                <div @click="pint(row)">
                  <a>票据打印</a>
                </div> -->
                <el-tooltip
                class="item"
                popper-class="tooltip"
                effect="light"
                :visible-arrow="false"
                content="账单详情"
                placement="bottom"
              >
                <i class="icon iconfont iconbiaodan1" @click="billDetails(row)"></i>
              </el-tooltip>
              <el-tooltip
                class="item"
                popper-class="tooltip"
                effect="light"
                :visible-arrow="false"
                content="数据冲红"
                placement="bottom"
              >
                <i class="icon iconfont iconshoufeichaxun-piaojuchonghong" @click="invoice(row)"></i>
              </el-tooltip>
              <el-tooltip
                class="item"
                popper-class="tooltip"
                effect="light"
                :visible-arrow="false"
                content="票据打印"
                placement="bottom"
              >
                <i class="icon iconfont iconshoufeichaxun-piaojudayin" @click="pint(row)"></i>
              </el-tooltip>
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
      <select-pint :selectPintShow.sync="selectPintShow" />
      <!-- 账单详情弹窗 -->
    </div>
  </div>
</template>
<script>
import SelectHead from "./components/SelectHead";
import SelectPint from "./components/SelectPint";
import Pagination from "@/components/Pagination";
import customTable from "@/components/CustomTable/index";
import TableTotal from "@/components/TableTotal/index";
import { parseStartTimeFunc, parseEndTimeFunc } from "@/utils/index";
import {
  SelectPayMentDataList,
  GetWaterTypeCustomerNum,
  RedPayMentDataByPayMentId,
  SelectPayMentDataListToExcel
} from "@/api/cashCharge";
import SearchTips from "@/components/SearchTips/index";
import { delTips, getText, pushItem } from "@/utils/projectLogic"; //搜索条件面包屑
export default {
  name: "paymentQuery",
  components: { SelectHead, Pagination, TableTotal, SelectPint, SearchTips },
  data() {
    return {
      total: 0,
      tableKey: 0,
      tableHeight: 0,
      temp: {},
      listQuery: {
        // 查询条件
        page: 1,
        limit: 20,
        filed: "",
        sort: "",
        CustomerQueryType: "", //用户类型
        CustomerQueryValue: "", // input值
        WaterMeterTypeId: "-1", //水表类型
        PayMentState: "-1", //缴费状态
        PayMentType: "-1", //缴费方式
        StartPayMentDate: "", //缴费时间起
        EndPayMentDate: "", //缴费时间止
        ReceiveMoneyUser: "-1", //收款人
        WaterFactory: "-1", //水厂
        editStartTime: "", // 操作时间起
        editEndTime: "", // 操作时间止
        tableId: "0000033",
        timevalue: []
      },
      selectPintShow: false, //票据打印弹窗
      tableData: [],
      checksData: [],
      tableTotal: [
        { num: 0, txt: "交易次数" },
        { num: 0, txt: "缴费金额" },
        { num: 0, txt: "预存金额" },
        { num: 0, txt: "实收金额" }
      ],
      tipsData: [], //传入子组件的值
      tipsDataCopy: [], //表单变化的值
      orderData:{}
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
      let start = parseStartTimeFunc(new Date());
      let end = parseEndTimeFunc(new Date());
      this.listQuery.editStartTime=start
      this.listQuery.editEndTime=end
      this.listQuery.timevalue.push(new Date(start));
      this.listQuery.timevalue.push(new Date(end));
      this.getText(start+'~'+end, "timevalue", "", "缴费日期");
      this.tipsData = pushItem(this.tipsDataCopy);
      var formHeight = this.$refs.formHeight.offsetHeight;
      this.tableHeight = document.body.clientHeight - formHeight - 250;
      this.$refs.searchTips.$refs.myChild.GetTable(this.listQuery.tableId); // 先获取所有自定义字段赋值
      this.checksData = this.$refs.searchTips.$refs.myChild.checkData; // 获取自定义字段中选中了字段\
    });
  },
  methods: {
    delTips(val) {
      if (val == "timevalue") {
        //当返回的model 为时间数组  置空 时间
        this.listQuery.editStartTime = "";
        this.listQuery.editEndTime = "";
      }

      this.tipsDataCopy = delTips(val, this, this.tipsDataCopy, "listQuery");
      debugger
      this.getList();
    },
    getText(val, model, arr, name) {
      let obj = getText(val, model, arr, this.tipsDataCopy, this, name);
      this.tipsDataCopy.push(obj);
    },
    getList(n) {
      if(!n){
         this.orderData = Object.assign({}, this.listQuery);
         this.orderData.page=1
      }
      SelectPayMentDataList(this.orderData).then(res => {
        this.tipsData = pushItem(this.tipsDataCopy);
        this.total = res.count;
        this.tableData = res.data;
      });
      GetWaterTypeCustomerNum(this.orderData).then(res => {
        this.tableTotal[0].num = res.data.NumberOfTrades
          ? res.data.NumberOfTrades
          : 0;
        this.tableTotal[1].num = res.data.PayMentMoney
          ? res.data.PayMentMoney
          : 0;
        this.tableTotal[2].num = res.data.PrestoreMoney
          ? res.data.PrestoreMoney
          : 0;
        this.tableTotal[3].num = res.data.ReceiptsMoney
          ? res.data.ReceiptsMoney
          : 0;
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
    invoice(r) {
      this.$confirm("是否确认冲红该账单？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "warningBox",
        showClose: false
      }).then(() => {
        RedPayMentDataByPayMentId({ SA_Payment_Id: r.Id, Remark: "" }).then(
          res => {
            this.$message({
              message: res.message,
              type: "success",
              duration: 4000
            });
            this.getList();
          }
        );
      });
    },
    excel() {
      //导出
      SelectPayMentDataListToExcel(this.listQuery).then(res => {
        window.location.href = `${this.common.excelPath}${res.data}`;
      });
    },
    // 行票据打印
    pint(r) {
      this.selectPintShow = true;
    },
    billDetails() {
      this.$router.push({
        path: "/businessManagement/billDetails",
        query: {
          id: "qwe"
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.section-container .section-full-container{
  padding-top:0 !important;
}
.iconshoufeichaxun-piaojudayin{
  color:#777c82;
}
.secur-content {
    .icon {
      font-size: 16px;
      cursor: pointer;
    }
    .iconbiaodan1 {
      color: #b59200;
    }
    .iconshoufeichaxun-piaojuchonghong {
      color: #ff3d3d;
      padding:0 15px;
    }
}
</style>

