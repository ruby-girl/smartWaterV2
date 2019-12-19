<template>
  <div class="section-container">
    <div ref="formHeight" class="head-padding-bg">
      <select-head
        :select-head="headQuery"
        @handleFilter="handleFilter"
        :headUser="headUser"
        :paymentNum="paymentNum"
        @handleFilterIcParent="handleFilterIc"
        @clearData="clearData"
        :cardInfo.sync="cardInfo"
      />
    </div>
    <!-- 表格模式 -->
    <div class="container-bottom-box">
      <!-- 左边表格 -->
      <div class="cash-padding-bg" :style="{'height':tableHeight+'px'}">
        <div class="display-flex justify-content-flex-justify" style="margin-bottom:10px;">
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
          <div v-if="type==2">
            <el-checkbox :indeterminate="isIndeterminateParent" v-model="checkedAllParent">全选</el-checkbox>
          </div>
        </div>
        <components
          :is="typeComponents"
          :listQuery="listQuery"
          :tableHeight="tableHeight"
          ref="tableTypeCard"
          :cardQuery="cardQuery"
          :checkedAllParent.sync="checkedAllParent"
          :isIndeterminateParent.sync="isIndeterminateParent"
          :totalLength.sync="totalLength"
          @details="details"
          @reset="reset"
          @feeWaiver="feeWaiverFunc"
          @calculatedAmount="calculatedAmount"
          :tipsData="tipsData"
          @delTips="delTips"
        ></components>
      </div>
      <!-- IC卡展示内容 -->
      <!-- 左边表格end -->
      <!-- 右 -->
      <div class="cash-padding-bg cash-right-box" ref="cashRightbox">
        <right-box
          @selectPint="selectPint"
          @selectPayment="selectPayment"
          :unpaidMoney.sync="unpaidMoney"
          :accountMoney="accountMoney"
          :customerId="listQuery.CustomerId"
          :payOrderId="payOrderId"
          :totalLength="totalLength"
          @getCustomer="getCustomer"
          :headUser="headUser"
          :isIc="isIC"
          :cardInfo="cardInfo"
        />
    </div>
    </div>
    <charges-details :chargesDetailsShow.sync="chargesDetailsShow" :temp="temp" />
    <over-details :overDetailsShow.sync="overDetailsShow" :temp="temp" />
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
    PaymentCode
  },
  data() {
    return {
      totalLength: 0,
      paymentNum: 0, //圆圆数字
      tableHeight: 0,
      feeWaiverItem: {},
      payOrderId: [],
      accountMoney: '0.00', //账户余额
      customerNo: "", //用户编号-结算后，用户编号获取账户余额
      cardInfo: {
        RechargeMoney:'',
        RechargeCount:''
      }, //IC卡 卡片详情
      headQuery: {
        CustomerQueryValue: "",
        CustomerQueryType: "1",
        page: 1,
        limit: 20,
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
      tipsDataCopy:[],//面包屑
      tipsData:[],
      secName:'用户编号'
    };
  },
  mounted: function() {
    this.$nextTick(function() {
      // 自适应表格高度 getBoundingClientRect().height比dom.offsetHeight性能更好
     this.getHeight()    
    });
  },
  methods: {
    getHeight(){
        var formHeight = this.$refs.formHeight.getBoundingClientRect().height;
      var bottomHeight=this.$refs.cashRightbox.getBoundingClientRect().height;
      this.tableHeight = document.body.clientHeight - formHeight -bottomHeight-70;
    },
    getList() {
      if (this.type == 1){
        this.tipsData = pushItem(this.tipsDataCopy);
        this.$refs.tableTypeCard.getList();
      } 
      else this.$refs.tableTypeCard.getCardList();
    },
    delTips() {
      this.headQuery.CustomerQueryValue=''
      this.tipsDataCopy = [];
      this.clearData();
    },
    getText(val, model, arr, name) {  
      let obj = getText(val, model, arr, this.tipsDataCopy, this.$refs.tableTypeCard, name);
      this.tipsDataCopy.push(obj);
    },
    // 查询用户缴费单 ---非IC卡
    handleFilter(user) {
      // user-当前选择/查询的用户信息
      this.isIC = false;
      user.Balance=parseFloat(user.Balance).toFixed(2)
      this.headUser = user;
      this.customerNo = user.CustomerNo;
      this.accountMoney = user.Balance;
      this.listQuery.CustomerId = user.Id;
      this.cardQuery.CustomerId = user.Id;
      this.listQuery.page = 1;
      this.checkedAllParent = false;
      if(this.headQuery.CustomerQueryType==1){//处理面包屑
        this.getText(user.CustomerNo,'customerNo','','用户编号')
      }else if(this.headQuery.CustomerQueryType==2){
        this.getText(user.CustomerName,'CustomerName','','姓名/简码')
      }else if(this.headQuery.CustomerQueryType==6){
        this.getText(user.SA_WaterMeterNo,'SA_WaterMeterNo','','水表编号')
      }
      this.getList();
    },
    // 查询用户缴费单 ---IC卡 读卡后回调--显示IC卡信息 resInfo用户信息  resData卡片信息
    handleFilterIc(user) {
      this.headUser = user;
      this.isIC = true;
      this.customerNo = user.CustomerNo;
      this.accountMoney = user.Balance;
      this.listQuery.CustomerId = user.Id;
      this.cardQuery.CustomerId = user.Id;
      this.listQuery.page = 1;
      this.checkedAllParent = false;
      this.getList();
    },
    // 结算成功后重新获取账户余额 --如果是IC卡需要再次读卡。查询缴费记录的数据+1
    getCustomer() {
      this.paymentNum = parseInt(this.paymentNum) + 1;
      if (this.isIC) {
        // 这里会再次读卡，然后显示卡片信息-调子组件方法
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
        if (_this.listQuery.CustomerId) {
          _this.getList();
        }
      }, 300);
      this.unpaidMoney = '0.00';
      this.checkedAllParent = false;
      this.isIndeterminateParent = false;
    },
    setCustomData() {
      this.$refs.tableTypeCard.$refs.myChild.isCustom = !this.$refs
        .tableTypeCard.$refs.myChild.isCustom;
      if (this.$refs.tableTypeCard.$refs.myChild.isCustom)
        this.tableHeight = this.tableHeight - 105;
      else this.tableHeight = this.tableHeight + 105;
    },
    // 勾选操作计算剩余未缴
    calculatedAmount(data) {
      this.unpaidMoney = '0.00';
      this.payOrderId = [];
      data.forEach(item => {
        this.payOrderId.push(item.Id);
        this.unpaidMoney =
         ((parseFloat(this.unpaidMoney) * 1000 + parseFloat(item.PriceSurplus) * 1000) /
          1000).toFixed(2);
      });
    },
    // 费用详情- 根据费用类型展示不通的详情页面-水费or其它费用
    details(item) {
      this.temp = item;
      if (item.OrderType == 2001) {
        this.chargesDetailsShow = true;
      } else {
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
      if (i == 2) {
        this.paymentCodeShow = true;
      }
    },
    // 未查询到用户
    clearData() {
     Object.assign(this.$data, this.$options.data())
      this.getHeight()
      if (this.type == 1) this.$refs.tableTypeCard.tableData = [];
      else this.$refs.tableTypeCard.cardData = [];
    }
  }
};
</script>
<style lang="scss" scoped>
.container-bottom-box {
  height: calc(100vh - 100px);
  margin: 0 !important;
}
.cash-padding-bg {
  padding: 10px !important;
  background: #fff;
}
.padding-20 {
  padding: 20px !important;
}
.cash-right-box {
  border-top: 12px solid #eff1f4;
  padding: 15px;
  overflow: auto;
}
/deep/ .is-disabled .el-checkbox__inner {
  background: #b4bcc1 !important;
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
.head-padding-bg{
  background: #fff;
}
</style>