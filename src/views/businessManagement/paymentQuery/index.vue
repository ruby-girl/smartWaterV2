<template>
  <!-- 收费查询 -->
  <div class="section-container">
    <div ref="formHeight" class="position-search-head">
      <select-head :select-head="listQuery" @handleFilter="getList" @getText="getText" />
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
          :cell-style="cellStyle"
        >
          <el-table-column fixed="left" label="序号" width="60" align="center">
            <template slot-scope="scope">
              <span>{{(listQuery.page - 1) *listQuery.limit+ scope.$index + 1}}</span>
            </template>
          </el-table-column>
          <template v-for="(item ,index) in tableHead">
            <el-table-column
            class="row-y-class"
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
                  :class="{'item':true,'main-color-disabled':row.PayState!==2201?true:false}"
                  :popper-class="row.PayState==2201?'tooltip':''"
                  :effect="row.PayState==2201?'light':'dark'"
                  :visible-arrow="row.PayState==2201?false:true"
                  :content="row.PayState==2201?'数据冲红':'该笔费用不允许数据冲红'"
                  placement="bottom"
                >
                  <i class="icon iconfont iconshoufeichaxun-piaojuchonghong" @click="row.PayState==2201?invoice(row):''"></i>
                </el-tooltip>
                <el-tooltip
                  :class="{'item':true,'main-color-disabled':row.PayState!==2201?true:false}"
                  :popper-class="row.PayState==2201?'tooltip':''"
                  :effect="row.PayState==2201?'light':'dark'"
                  :visible-arrow="row.PayState==2201?false:true"
                  :content="row.PayState==2201?'票据打印':'该笔费用不允许打印票据'"
                  placement="bottom"
                >
                  <i class="icon iconfont iconshoufeichaxun-piaojudayin" @click="row.PayState==2201?pint(row):''"></i>
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
import { delTips, getText, pushItem, isExport,closeDelTip } from "@/utils/projectLogic"; //搜索条件面包屑
import { ICReadCardInfo, WriteCardInfo } from "@/utils/projectLogic"; //IC卡读卡
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
        CustomerQueryType: "1", //用户类型
        CustomerQueryValue: "", // input值
        WaterMeterTypeId: "-1", //水表类型
        PayMentState: "-1", //缴费状态
        PayMentType: "-1", //缴费方式
        StartPayMentDate: "", //缴费时间起
        EndPayMentDate: "", //缴费时间止
        ReceiveMoneyUser: "-1", //收款人
        WaterFactory: "-1", //水厂
        StartPayMentDate: "", // 操作时间起
        EndPayMentDate: "", // 操作时间止
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
      orderData: {},
      IcInfo: {} //IC卡 卡片信息
    };
  },
  watch: {
    $route: {
      handler: function(val, oldVal) {},
      deep: true
    }
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
      this.listQuery.StartPayMentDate = start;
      this.listQuery.EndPayMentDate = end;
      this.listQuery.timevalue.push(new Date(start));
      this.listQuery.timevalue.push(new Date(end));
      this.getText(start + "~" + end, "timevalue", "", "缴费日期");
      this.tipsData = pushItem(this.tipsDataCopy);
      var formHeight = this.$refs.formHeight.offsetHeight;
      this.tableHeight = document.body.clientHeight - formHeight - 230;
      this.$refs.searchTips.$refs.myChild.GetTable(this.listQuery.tableId); // 先获取所有自定义字段赋值
      this.checksData = this.$refs.searchTips.$refs.myChild.checkData; // 获取自定义字段中选中了字段\
    });
  },
  methods: {
    cellStyle({ row, column, rowIndex, columnIndex }){
        if(row.PayState==2201&&column.property=="PayStateName"){//已缴费
          return 'color:#00B2A1;'
        }else if(row.PayState==2202&&column.property=="PayStateName"){//已冲红
           return 'color:#FF5656;'
        }else if(row.PayState==2203&&column.property=="PayStateName"){
           return 'color:#E57403;'
        }
    },
    delTips(val) {
      if (val == "timevalue") {
        //当返回的model 为时间数组  置空 时间
        this.listQuery.StartPayMentDate = "";
        this.listQuery.EndPayMentDate = "";
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
        this.listQuery.page = 1;
        this.orderData.page = 1;
      }else{
        this.orderData.page=this.listQuery.page
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
        customClass: "warningBox deleteBox",
        showClose: false
      }).then(() => {
        closeDelTip()
        this.IcInfo = {};
        if (r.WaterMeterTypeId == "1102") {
          //如果为IC卡先读卡
          this.handleFilterIC(r);
        } else {
          this.RedPayMentDataByPayMent(r);
        }
      }).catch(()=>{
        closeDelTip()
      });
    },
    // 冲红
    RedPayMentDataByPayMent(row) {
      let ic={};
      if (row.WaterMeterTypeId == "1102") {//this.cardInfo.CardType 0：未刷卡 1：已刷卡,  已刷卡不允许冲红
       ic = {
          RechargeMoney: this.IcInfo.UserCard.RechargeMoney,
          ICCardNo: this.IcInfo.UserCard.CardNo,
          PrepaidNum: this.IcInfo.UserCard.RechargeCount
        };
      }
      RedPayMentDataByPayMentId(
        {
          SA_Payment_Id: row.Id,
          Remark: ""
        },
        ic
      ).then(res => {
        if (row.WaterMeterTypeId == "1102") {
          ////如果为IC卡 执行3次写卡
          let obj={
            CardInfo:res.data
          }
          WriteCardInfo(obj);
          WriteCardInfo(obj);
          WriteCardInfo(obj);
        } else {
          this.$message({
            message: res.message,
            type: "success",
            duration: 4000
          });
        }
        this.getList();
      });
    },
    // IC卡读卡
    handleFilterIC(row) {
      try {
        // 读卡 //this.cardInfo.CardType 0：未刷卡 1：已刷卡,  已刷卡不允许冲红
        ICReadCardInfo(resData => {
          this.IcInfo = resData;
          if (this.IcInfo.CardType == 1) {
            Message.error({
              message: "该卡片为已刷卡状态，不允许冲红！",
              type: "error",
              duration: 4000
            });
            return;
          }
          this.RedPayMentDataByPayMent(row);
        });
      } catch (error) {
        console.log("请在CS端操作1");
      }
    },
    excel() {
      //导出
      if (!isExport(this.tableData)) return;
      SelectPayMentDataListToExcel(this.orderData).then(res => {
        window.location.href = `${this.common.excelPath}${res.data}`;
      });
    },
    // 行票据打印
    pint(r) {
      this.selectPintShow = true;
    },
    billDetails(row) {
      this.$router.push({
        path: "/businessManagement/billDetails",
        query: {
          PayMentId: row.Id
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.section-container .section-full-container {
  padding-top: 0 !important;
}
.iconshoufeichaxun-piaojudayin {
  color: #777c82;
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
    padding: 0 15px;
  }
}
</style>

