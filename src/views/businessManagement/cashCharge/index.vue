<template>
  <div class="section-container">
    <div ref="formHeight" class="cash-padding-bg padding-20">
      <select-head :select-head="headQuery" @handleFilter="handleFilter" :headUser="headUser"/>
    </div>
    <!-- 表格模式 -->
    <el-row :gutter="10" class="container-bottom-box display-flex">
      <!-- 左边表格 -->
      <el-col :md="14" :lg="16" :xl="16" class="cash-padding-bg" v-if="!isIC">
        <div class="table-top-btn-padding display-flex justify-content-flex-justify">
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
          <div v-if="type==1">
            <el-button type="success" size="mini" @click="excel">
              <i class="iconfont icondaochuexcel"></i>导出Excel
            </el-button>
            <el-button type="warning" size="mini" @click="setCustomData()">
              <i class="iconfont iconbiaogezidingyi"></i>表格自定义
            </el-button>
          </div>
          <div v-else>
            <el-checkbox
              :indeterminate="isIndeterminateParent"
              v-model="checkedAllParent"
              @change="parentChange"
            >全选</el-checkbox>
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
          @details="details"
          @reset="reset"
          @feeWaiver="feeWaiverFunc"
          @calculatedAmount="calculatedAmount"
        ></components>
      </el-col>
      <!-- IC卡展示内容 -->
      <el-col
        :md="14"
        :lg="16"
        :xl="16"
        class="cash-padding-bg ic-container"
        v-if="isIC"
        :style="{'height':saveTableHeight+'px'}"
      >
        <components :is="icType" :tableData="tableData" :tableHeight="tableHeight"></components>
      </el-col>
      <!-- 左边表格end -->
      <!-- 右 -->
      <el-col
        :md="10"
        :lg="8"
        :xl="8"
        class="cash-padding-bg cash-right-box"
        :style="{'height':saveTableHeight+'px'}"
      >
        <right-box
          @selectPint="selectPint"
          @selectPayment="selectPayment"
          :unpaidMoney="unpaidMoney"
          :accountMoney="accountMoney"
        ></right-box>
      </el-col>
      <!-- 右 -->
    </el-row>
    <charges-details :chargesDetailsShow.sync="chargesDetailsShow" />
    <over-details :overDetailsShow.sync="overDetailsShow" />
    <select-user :selectUserShow.sync="selectUserShow" :headQuery="headQuery" @handleFilter="handleFilter"/>
    <fee-waiver :feeWaiverShow.sync="feeWaiverShow" :orderId="orderId" :orderMoney="orderMoney" @getList="getList"/>
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
import CreditCardAlready from "./components/IcType/CreditCardAlready"; //IC卡已刷卡
import NoCreditCard from "./components/IcType/NoCreditCard"; //IC卡未刷卡
 import {OrderFeeCancel} from "@/api/cashCharge";
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
      total: 0,
      tableHeight: 0,
      orderId:'',//需要减免的费用单ID
      orderMoney:0,//减免前金额
      accountMoney:0,//账户余额
      headQuery: {
        CustomerQueryValue: "",
        CustomerQueryType: '1',
        UserState: -1,//冗余字段-后端
        UserType: -1,//冗余字段-后端
        WaterTypeId: -1,//冗余字段-后端
        page: 1,
        limit: 10,
        tableId: "0000018"
      },
      listQuery: {
        // 表格查询条件
        page: 1,
        limit: 10,
        filed: "",
        sort: "",
        CustomerId:"",
        tableId: "0000018"//
      },
      cardQuery:{
         filed: "",
        sort: "",
        CustomerId:"",
        tableId: "0000018"//
      },
      headUser:{},//展示的用户基本信息
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
      unpaidMoney: 0 //剩余未缴
    };
  },
  mounted: function() {
    this.$nextTick(function() {
      // 自适应表格高度 getBoundingClientRect().height比dom.offsetHeight性能更好
      var formHeight = this.$refs.formHeight.getBoundingClientRect().height;
      this.tableHeight = document.body.clientHeight - formHeight - 230;
      this.saveTableHeight = document.body.clientHeight - formHeight - 100;
    });
  },
  watch: {
    type(v, o) {
      this.typeComponents = v == 2 ? "CardType" : "TableType";   
      let _this=this
      // 组件切换后，拿不到方法，无法在卡片形式结算后，更新表格数据-所以每点击切换就重新获取
      setTimeout(function(){
       if(_this.listQuery.CustomerId)_this.getList()
      },300)
    }
  },
  methods: {
     getList(){
        if(this.type==1)
        this.$refs.tableTypeCard.getList()
        else
        this.$refs.tableTypeCard.getCardList()       
     },
     // 查询用户-仅有一条数据id---表格
    handleFilter(user) {
      // user-当前选择/查询的用户信息
      this.headUser=user
      this.accountMoney=user.Balance
      this.listQuery.CustomerId=user.Id
      this.cardQuery.CustomerId=user.Id
      this.listQuery.page = 1;   
       this.getList();
    },
    toggle(n) {
      this.type = n;
      this.unpaidMoney = 0;
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
    excel() {
      //导出
      exportExcel(this.listQuery).then(res => {
        window.location.href = `${this.common.excelPath}${res.data}`;
      });
    },
    parentChange(v) {
      this.isIndeterminateParent = false;
      this.$refs.tableTypeCard.$refs.myCard.changeParent();
    },
    // 勾选操作计算剩余未缴
    calculatedAmount(data) {
      this.unpaidMoney = 0;
      data.forEach(item => {
        this.unpaidMoney =
          (this.unpaidMoney * 1000 + parseFloat(item.OrderType) * 1000) / 1000;
      });
    },
    // 费用详情
    details(id) {
       this.orderId=id
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
         OrderFeeCancel({SA_Order_Id:id}).then((res)=>{
          this.$message({
            message: res.message,
            type: "success",
            duration: 4000
          });
          this.getList()
        })
      });
    },
    // 费用减免
    feeWaiverFunc(id,num){
      this.orderId=id
      this.orderMoney=num
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
    }
  }
};
</script>
<style lang="scss" scoped>
.container-bottom-box {
  border-top: 15px solid #eff1f4;
  height: calc(100vh - 205px);
  margin: 0 !important;
}
.cash-padding-bg {
  padding: 20px !important;
  background: #fff;
}
.padding-20 {
  padding: 20px !important;
}
.cash-right-box {
  border-left: 15px solid #eff1f4;
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
</style>