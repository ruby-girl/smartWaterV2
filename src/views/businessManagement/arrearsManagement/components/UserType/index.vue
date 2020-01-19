<template>
  <div>
    <div ref="formHeight" class="position-search-head">
      <select-head
        :select-head="listQuery"
        @handleFilter="getList"
        @getText="getText"
        ref="head"
      />
      <div>
        
      </div>
    </div>
    <div class="section-full-container">
      <el-button size="mini" class="special-btn" style="margin-bottom:10px" round @click="OrdersFeeCancelsFunc()">撤销所选欠费</el-button>
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
          :cell-style="cellStyle"
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
            width="140px"
            fixed="right"
          >
            <template slot-scope="{row}">
              <div class="display-flex justify-content-flex-center secur-content">
                <el-tooltip
                class="item"
                popper-class="tooltip"
                effect="light"
                :visible-arrow="false"
                content="费用详情"
                placement="bottom"
              >
                <i class="icon iconfont iconbiaodan1" style="margin-right:15px;" @click="details(row)"></i>
              </el-tooltip>
              <el-tooltip
                :class="{'item main-color':true,'main-color-disabled':row.ChargeFlag!==1002||row.OrderType!==2001||row.LateFee==0?true:false}"
                :popper-class="row.ChargeFlag!==1002||row.OrderType!==2001||row.LateFee==0?'':'tooltip'"
                :effect="row.ChargeFlag!==1002||row.OrderType!==2001||row.LateFee==0?'dark':'light'"
                :visible-arrow="row.ChargeFlag!==1002||row.OrderType!==2001||row.LateFee==0?true:false"
                :content="row.ChargeFlag!==1002||row.OrderType!==2001||row.LateFee==0?'该笔费用不允许减免':'违约金减免'"
                placement="bottom"
              > 
                <i
                  class="icon iconfont iconjianmianshui font-19"
                  @click="row.ChargeFlag!==1002||row.OrderType!==2001||row.LateFee==0?'':feeWaiverFunc(row,'违约金')"
                ></i>
              </el-tooltip>
              <el-tooltip
                :class="{'item':true,'main-color-disabled':row.ChargeFlag==1002?false:true}"
                :popper-class="row.ChargeFlag==1002?'tooltip':''"
                :effect="row.ChargeFlag==1002?'light':'dark'"
                :visible-arrow="row.ChargeFlag==1002?false:true"
                :content="row.ChargeFlag==1002?'费用撤回':'该笔费用不允许撤回'"
                placement="bottom"
              >
                <i class="icon iconfont iconchexiao1" @click="row.ChargeFlag==1002?reset(row.Id):''"></i>
              </el-tooltip>
              <!-- 费用类型仅为水费，OrderType==2001，才能进行减免 -->
              <!-- <el-tooltip
                :class="{'item main-color':true,'main-color-disabled':row.ChargeFlag!==1002||row.OrderType!==2001?true:false}"
                :popper-class="row.ChargeFlag!==1002||row.OrderType!==2001?'':'tooltip'"
                :effect="row.ChargeFlag!==1002||row.OrderType!==2001?'dark':'light'"
                :visible-arrow="row.ChargeFlag!==1002||row.OrderType!==2001?true:false"
                :content="row.ChargeFlag!==1002||row.OrderType!==2001?'该笔费用不允许减免':'费用减免'"
                placement="bottom"
              >
                <i class="icon iconfont iconjianmianshui" @click="row.ChargeFlag!==1002||row.OrderType!==2001?'':feeWaiverFunc(row)"></i>
              </el-tooltip> -->
              <el-tooltip
                :class="{'item main-color':true,'main-color-disabled':row.ChargeFlag!==1002||row.OrderType!==2001?true:false}"
                :popper-class="row.ChargeFlag!==1002||row.OrderType!==2001?'':'tooltip'"
                :effect="row.ChargeFlag!==1002||row.OrderType!==2001?'dark':'light'"
                :visible-arrow="row.ChargeFlag!==1002||row.OrderType!==2001?true:false"
                :content="row.ChargeFlag!==1002||row.OrderType!==2001?'该笔费用不允许减免':'水费减免'"
                placement="bottom"
              > 
                <i
                  class="icon iconfont iconshuifeijianmian1 font-19"
                  @click="row.ChargeFlag!==1002||row.OrderType!==2001?'':feeWaiverFunc(row,'水费')"
                ></i>
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
    </div>
    <!-- 费用详情弹窗 -->
    <charges-details :chargesDetailsShow.sync="chargesDetailsShow" :temp="temp" />
    <over-details :overDetailsShow.sync="overDetailsShow" :temp="temp"/>
    <!-- 费用减免 -->
    <fee-waiver
      :feeWaiverShow.sync="feeWaiverShow"
      :feeWaiverItem="feeWaiverItem"
      :type="feeWaiverType"
      @getList="getList"
    />
  </div>
</template>
<script>
import SelectHead from "./SelectHead";
import Pagination from "@/components/Pagination";
import SearchTips from "@/components/SearchTips/index";
import { GetList, OrderFeeCancel,OrdersFeeCancels, GetList_execl } from "@/api/cashCharge";
import MytableTotal from "@/components/TableTotal/index";
import { delTips, getText, pushItem,isExport,closeDelTip } from "@/utils/projectLogic"; //搜索条件面包屑
import ChargesDetails from "../../../cashCharge/components/ChargesDetails"; //水费详情弹窗-共用现金收费的费用详情
import OverDetails from "../../../cashCharge/components/OverDetails"; //除水费外其它费用详情弹窗
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
    MytableTotal,
    OverDetails
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
      overDetailsShow:false,
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
      checkedDataId: [], //批量撤销ID
      feeWaiverType:''
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
      this.tableHeight = document.body.clientHeight - formHeight - 290;
      this.$refs.searchTips.$refs.myChild.GetTable(this.listQuery.tableId); // 先获取所有自定义字段赋值
      this.checksData = this.$refs.searchTips.$refs.myChild.checkData; // 获取自定义字段中选中了字段
    });
  },
  methods: {
    cellStyle({ row, column, rowIndex, columnIndex }){
        if(row.ChargeFlag==1002&&column.property=="ChargeFlagStr"){//未缴费
          return 'color:#FF3D3D;'
        }else if(row.ChargeFlag==1003&&column.property=="ChargeFlagStr"){//审核中
           return 'color:#E57403;'
        }else if(row.ChargeFlag==1004&&column.property=="ChargeFlagStr"){//已撤销
           return 'color:#46494C;'
        }
    },
    setQuery() {//水厂跳转用户，查询条件赋值
    // 重置条件
      this.$refs.head.$refs["formHeight"].resetFields();
      this.listQuery.End_TotalPrice=''
      this.tipsDataCopy = [];
      this.listQuery.SA_WaterFactory_Id = this.factoryId;
      this.listQuery.Star_ArrearsDate = this.query.Star_ArrearsDate;
      this.listQuery.End_ArrearsDate = this.query.End_ArrearsDate;
      this.listQuery.timevalue=this.query.timevalue
      this.listQuery.Enumot = this.query.Enumot;
      this.listQuery.Enumwm = this.query.Enumwm;
      this.listQuery.Enumut = this.query.Enumut;
      this.listQuery.Enumcf = this.query.Enumcf;
      this.getText(this.factoryId, 'SA_WaterFactory_Id', this.$refs.head.waterWorks, '水厂');
      if(this.query.timevalue.length>0) this.getText(this.query.timevalue, 'timevalue', '', '欠费日期');
      if(this.query.Enumot!=='-1') this.getText(this.query.Enumot, 'Enumot', this.$refs.head.Enumot, '费用类型');
      if(this.query.Enumwm!=='-1') this.getText(this.query.Enumwm, 'Enumwm', this.$refs.head.Enumwm, '水表类型');
      if(this.query.Enumwm!=='-1') this.getText(this.query.Enumwm, 'Enumut', this.$refs.head.Enumut, '用户类型');
      if(this.query.Enumwm!=='-1') this.getText(this.query.Enumwm, 'Enumcf', this.$refs.head.Enumcf, '费用状态');
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
        this.listQuery.page = 1;
      }else{
        this.orderData.page=this.listQuery.page
      }
      GetList(this.orderData).then(res => {
        this.tipsData = pushItem(this.tipsDataCopy);
        this.total = res.count;
         
        if (res.data.ot) {
          this.tableTotal[0].num = res.data.ot.OrderCount;
          this.tableTotal[1].num = res.data.ot.PriceSurplus;
        }
        res.data.list.forEach(item => {
          if (item.ChargeFlag == 1003) {
            item.tooltip = "费用审核中，不允许勾选";
          }
        });
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
      if(!isExport(this.tableData)) return
      GetList_execl(this.orderData).then(res => {
        window.location.href = `${this.common.excelPath}${res.data}`;
      });
    },
    details(item) {
      this.temp = item;
      if(item.OrderType==2001){
        this.chargesDetailsShow = true;
      }else{
        this.overDetailsShow = true;
      }
    },
    // 费用撤回
    reset(id) {
         this.$confirm("是否确认撤销欠费？", "提示", {
          confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "warningBox deleteBox",
        showClose: false
        }).then(() => {
          closeDelTip()
        OrderFeeCancel({ SA_Order_Id: id }).then(res => {
          this.$message({
            message: res.message,
            type: "success",
            duration: 4000
          });
           this.getList();       
        })
        }).catch(()=>{
        closeDelTip()
      });
    },
    // 费用减免
    feeWaiverFunc(item,type) {
      this.feeWaiverType=type
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
      this.$confirm("是否确认撤销已勾选的欠费？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "warningBox deleteBox",
        showClose: false
      }).then(() => {
        closeDelTip()
         OrdersFeeCancels(this.checkedDataId).then(res => {
        this.$message({
          message: res.message,
          type: "success",
          duration: 4000
        });
        this.getList();
      });
      }).catch(()=>{
        closeDelTip()
      });
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
.iconchexiao1{
  color:#777c82;
  padding:0 15px;
}
.secur-content {
    .icon {
      font-size: 16px;
      cursor: pointer;
    }
    .iconbiaodan1 {
      color: #b59200;
    }
}
</style>


