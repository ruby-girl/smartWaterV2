<template>
  <div class="section-container">
    <div ref="formHeight" class="cash-padding-bg">
      <select-head
        :select-head="headQuery"
        @handleFilter="handleFilter"
        :headUser="headUser"
        :icInfo.sync="icInfo"
        :paymentNum="paymentNum"
        @handleFilterIcParent="handleFilterIc"
        @clearData="clearData"
        @getText="getText"
        ref="head"
      />
    </div>
    <!-- 表格模式 -->
    <el-row :gutter="10" class="container-bottom-box display-flex">
      <!-- 左边表格 -->
      <el-col :md="14" :lg="16" :xl="18" class="cash-padding-bg" v-if="!isIC">
        <div class="display-flex justify-content-flex-justify">
          <div class="display-flex">
            <el-tooltip
              popper-class="tooltip"
              content="卡片模式"
              placement="bottom"
              effect="light"
              :visible-arrow="false"
            >
              <div
                @click="toggle(2)"
                :class="{'change-tab':true,'iconfont':true,'iconzu':true,'tab-active': this.type==2}"
              ></div>
            </el-tooltip>
            <el-tooltip
              popper-class="tooltip"
              content="表格模式"
              placement="bottom"
              effect="light"
              :visible-arrow="false"
            >
              <div
                @click="toggle(1)"
                :class="{'change-tab':true,'iconfont':true,'iconzu1':true,'tab-active': this.type==1}"
                style="border:none"
              ></div>
            </el-tooltip>
          </div>
          <!-- <div v-if="type==1">
            <el-button type="warning" size="mini" @click="setCustomData()">
              <i class="iconfont iconbiaogezidingyi"></i>表格自定义
            </el-button>
          </div> -->
          <div  v-if="type==2">
            <el-checkbox
              :indeterminate="isIndeterminateParent"
              v-model="checkedAllParent"
            >全选</el-checkbox>
          </div>
        </div>
        <keep-alive>
        <components
          :is="typeComponents"
          :listQuery="listQuery"
          :tableHeight="tableHeight"
          ref="tableTypeCard"
          :cardQuery="cardQuery"
          :checkedAllParent.sync="checkedAllParent"
          :isIndeterminateParent.sync="isIndeterminateParent"
          :totalLength.sync="totalLength"
          :tipsData="tipsData"
          @details="details"
          @reset="reset"
          @feeWaiver="feeWaiverFunc"
          @calculatedAmount="calculatedAmount"
          @delTips="delTips"
        ></components>
        </keep-alive>
      </el-col>
      <!-- IC卡展示内容 -->
      <el-col
        :md="14"
        :lg="16"
        :xl="18"
        class="cash-padding-bg ic-container"
        v-if="isIC"
        :style="{'height':saveTableHeight+'px'}"
      >
        <components :is="icType" :tableData="tableData" :tableHeight="tableHeight" :icInfo="icInfo"></components>
      </el-col>
      <!-- 左边表格end -->
      <!-- 右 -->
      <el-col
        :md="10"
        :lg="8"
        :xl="6"
        class="cash-padding-bg cash-right-box"
        :style="{'height':saveTableHeight+'px'}"
      >
        <right-box
          @selectPint="selectPint"
          @selectPayment="selectPayment"
          :unpaidMoney.sync="unpaidMoney"
          :accountMoney="accountMoney"
          :customerId="listQuery.CustomerId"
          :payOrderId="payOrderId"
          :totalLength="totalLength"
          @getCustomer="getCustomer"
          :cardInfo="icInfo"
          :isIC="isIC"
        ></right-box>
      </el-col>
      <!-- 右 -->
    </el-row>
    <charges-details :chargesDetailsShow.sync="chargesDetailsShow" :temp="temp" />
    <over-details :overDetailsShow.sync="overDetailsShow" :temp="temp"/>
    <select-user
      :selectUserShow.sync="selectUserShow"
      :headQuery="headQuery"
      @handleFilter="handleFilter"
    />
    <fee-waiver
      :feeWaiverShow.sync="feeWaiverShow"
      :feeWaiverItem="feeWaiverItem"
      @getList="getList"
    />
    <select-pint :selectPintShow.sync="selectPintShow" />
    <payment-code :paymentCodeShow.sync="paymentCodeShow" />
  </div>
</template>
<script>
import SelectHead from "./components/SelectHead";
import TableType from "./components/TableType";
import CardType from "./components/CardType";
import RightBox from "./components/RightBox";
import ChargesDetails from "./components/ChargesDetails"; //水费详情弹窗
import OverDetails from "./components/OverDetails"; //除水费外其它费用详情弹窗
import SelectUser from "@/components/SelectUser";
import FeeWaiver from "./components/FeeWaiver"; //水费减免弹窗
import SelectPint from "./components/SelectPint"; //选择打印机
import PaymentCode from "./components/PaymentCode"; //扫码支付
import {getText,pushItem} from "@/utils/projectLogic"; //搜索条件面包屑
import CreditCardAlready from "./components/IcType/CreditCardAlready"; //IC卡已刷卡
import NoCreditCard from "./components/IcType/NoCreditCard"; //IC卡未刷卡
import { OrderFeeCancel } from "@/api/cashCharge";
import { GetCustomerDataList } from "@/api/userSetting"; ////模糊查询用户--结算成功后，重新获取账户余额
export default {
  name: "cashCharge",
  components: {
    SelectHead,
    TableType,
    CardType,
    RightBox,
    ChargesDetails,
    OverDetails,
    SelectUser,
    FeeWaiver,
    SelectPint,
    PaymentCode,
    NoCreditCard,
    CreditCardAlready
  },
  data() {
    return {
      totalLength: 0,
      paymentNum:0,//圆圆数字
      tableHeight: 0,
      feeWaiverItem:{},
      payOrderId: [],
      accountMoney: '0.00', //账户余额
      customerNo: "", //用户编号-结算后，用户编号获取账户余额
      icInfo: {}, //IC卡 卡片详情
      headQuery: {
        CustomerQueryValue: "",
        CustomerQueryType: "1",
        page: 1,
        limit: 10,
        tableId: "0000018"
      },
      listQuery: {
        // 表格查询条件
        page: 1,
        limit: 20,
        filed: "",
        sort: "",
        CustomerId: "",
        tableId: "0000018" //
      },
      temp: {},
      cardQuery: {
        filed: "ArrearsDate",
        sort: "ASC",
        CustomerId: "",
        tableId: "0000018" //
      },
      headUser: {}, //展示的用户基本信息
      type: 1, //左侧展示模式 1：表格 2：卡片
      typeComponents: "TableType", //默认表格模式
      dialogStatus: "", // 识别添加还是编辑
      dialogFormVisible: false, // 弹窗
      tableHeight: 0,
      saveTableHeight: 0,
      tableData: [],
      checkedAllParent: false, //全选
      isIndeterminateParent: false, //复选框属性
      chargesDetailsShow: false, //水费详情弹窗
      overDetailsShow: false, //其它费用详情弹窗
      selectUserShow: false, //多用户选择弹窗
      feeWaiverShow: false, //费用减免弹窗
      selectPintShow: false, //选择打印机
      paymentCodeShow: false, //扫码支付弹窗
      isIC: false,
      icType: "CreditCardAlready", //默认已刷卡
      unpaidMoney: '0.00', //剩余未缴
      isNull:true,
       tipsDataCopy:[],//面包屑
      tipsData:[],
      secName:'用户编号'
    };
  },
  mounted: function() {
    this.$nextTick(function() {
     this.getHeight()
    });
  },
  methods: {
    getHeight(){
       var formHeight = this.$refs.formHeight.getBoundingClientRect().height;
      this.tableHeight = document.body.clientHeight - formHeight - 230;
      this.saveTableHeight = document.body.clientHeight - formHeight - 80;
    },
    getList() {
      if (this.type == 1&&!this.isIC){
        this.handelTips()
        this.tipsData = pushItem(this.tipsDataCopy);
        this.$refs.tableTypeCard.getList();
      }else if(this.type == 2&&!this.isIC){  
        this.$refs.tableTypeCard.getCardList()
      }   
    },
    handelTips(){
      if(this.headQuery.CustomerQueryType==1&&this.type==1){//处理面包屑
        this.getText(this.headUser.CustomerNo,'customerNo','','用户编号')
      }else if(this.headQuery.CustomerQueryType==2&&this.type==1){
        this.getText(this.headUser.CustomerName,'CustomerName','','姓名/简码')
      }else if(this.headQuery.CustomerQueryType==6&&this.type==1){
        this.getText(this.headUser.SA_WaterMeterNo,'SA_WaterMeterNo','','水表编号')
      }
    },
    delTips() {
      this.tipsDataCopy = [];
      this.getList();
    },
    getText(val, model, arr, name) {
       let obj = getText(val, model, arr, this.tipsDataCopy, this.$refs.tableTypeCard, name);
      this.tipsDataCopy.push(obj);
    },
    // 查询用户缴费单 ---非IC卡
    handleFilter(user) {
      // user-当前选择/查询的用户信息
      this.isIC = false;
      this.type=1
      this.typeComponents="TableType"
      this.headUser = user;
      this.customerNo = user.CustomerNo;
      this.accountMoney = (user.Balance).toFixed(2);
      this.listQuery.CustomerId = user.Id;
      this.cardQuery.CustomerId = user.Id;
      this.listQuery.page = 1;
      this.checkedAllParent = false;
     let _this=this
     setTimeout(function(){
       _this.getList()
     },800)
    },
    // 查询用户缴费单 ---IC卡 读卡后回调--显示IC卡信息 resInfo用户信息  resData卡片信息
    handleFilterIc(user) {
      this.headUser = user;
      this.isIC = true;
      this.customerNo = user.CustomerNo;
      this.accountMoney = (user.Balance).toFixed(2);
      this.listQuery.CustomerId = user.Id;
      this.cardQuery.CustomerId = user.Id;
      this.listQuery.page = 1;
      this.checkedAllParent = false;
      this.tipsDataCopy = [];
       //  isFirst 当卡片内充值次数为1，卡片金额为0，并且是未刷卡时，该值为true，否则为false  // this.cardInfo.CardType 0：未刷卡 1：已刷卡 
      if(this.icInfo.CardType==0) this.icType='NoCreditCard';
      else this.icType='CreditCardAlready';
      this.headQuery.CustomerQueryValue=""//输入框清空
    },
    // 结算成功后重新获取账户余额 --如果是IC卡需要再次读卡。查询缴费记录的数据+1
    getCustomer() {
    this.paymentNum=parseInt(this.paymentNum)+1
      if (this.isIC) {
        this.$refs.head.handleFilterIC()//再次读卡，然后显示卡片信息-调子组件方法       
      } else {
        let obj = {
          CustomerQueryValue: this.customerNo,
          CustomerQueryType: "1",
          page: 1,
          limit: 20,
          tableId: "0000018"
        };
        GetCustomerDataList(obj).then(res => {
          this.handleFilter(res.data[0]);
        });
      }
    },
    toggle(n) {
      this.type = n;
      this.typeComponents = n == 2 ? "CardType" : "TableType";
      let _this = this;
      // 组件切换后，拿不到方法，无法在卡片形式结算后，更新表格数据-所以每点击切换就重新获取
      setTimeout(function() {
        if (_this.listQuery.CustomerId){
           _this.getList();
        }
      }, 300);
      this.unpaidMoney = '0.00';
      this.checkedAllParent = false;
      this.isIndeterminateParent = false;
    },
    // 勾选操作计算剩余未缴
    calculatedAmount(data) {
      this.unpaidMoney = '0.00';
      this.payOrderId = [];
      data.forEach(item => {
        this.payOrderId.push(item.Id);
        this.unpaidMoney =
          ((parseFloat(this.unpaidMoney)* 1000 + parseFloat(item.PriceSurplus) * 1000) /
          1000).toFixed(2);
      });
    },
    // 费用详情- 根据费用类型展示不通的详情页面-水费or其它费用
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
    // 选择打印机
    selectPint() {
      this.selectPintShow = true;
    },
    // 选择支付方式
    selectPayment(i) {
      if (i == 2) this.paymentCodeShow = true;
    },
    // 未查询到用户
    clearData() {
     Object.assign(this.$data, this.$options.data())
     this.getHeight()
     this.listQuery.page = 1;
      if (this.type == 1){
        this.$refs.tableTypeCard.tableData = [];
        this.$refs.tableTypeCard.total=0
      }
      else this.$refs.tableTypeCard.cardData = [];
    }
  }
};
</script>
<style lang="scss" scoped>
.container-bottom-box {
  border-top: 15px solid #eff1f4;
  height: calc(100vh - 190px);
  margin: 0 !important;
}
.cash-padding-bg {
  padding: 12px !important;
  background: #fff;
}
// .padding-20 {
//   padding: 20px !important;
// }
.cash-right-box {
  border-left: 15px solid #eff1f4;
  padding: 15px;
  overflow: auto;
}

/deep/ .el-checkbox__input.is-disabled + span.el-checkbox__label {
  color: #fff;
}
.change-tab {
  background: #f0f0f0;
  font-size: 13px;
  padding: 5px 20px 2px 20px;
  line-height: 24px;
  border-right: 1px solid #d9d9d9;
  cursor: pointer;
  color: #999999;
}
.tab-active {
  color: #00b2a1;
}
.tooltip {
  color: #ddd;
}
.ic-container {
  overflow: auto;
}
</style>