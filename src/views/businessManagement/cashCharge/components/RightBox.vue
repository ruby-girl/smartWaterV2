<template>
  <!--右侧缴费操作 -->
  <div>
    <div class="right-detail-box">
      <div>剩余未缴：{{unpaidMoney}}元</div>
      <div>账户余额：<span class="main-color font-weight">{{accountMoney}}</span>元</div>
      <div class="filter-container">应收金额：{{needMoney}}元</div>
      <div class="display-flex align-items-center filter-container flex-wrap">
        <div class="main-color-pink">实收金额：</div>
        <div class="right-detail-input">
          <input
            type="text"
            v-model="num"
            @blur="changeTwoDecimal_x()"
            @keyup="money($event)"
          />
           <span class="main-color-pink">元</span>
        </div>
       
      </div>
      <div v-show="isAccount==false" style="height:28px;">&#12288;&#12288;找零：{{surplus}}元</div>
    </div>
    <div class="display-flex save-account">
      <span>
        是否存入账户:&emsp;
      </span>
      <el-radio-group v-model="isAccount">
      <el-radio :label="true">是</el-radio>
      <el-radio :label="false">否</el-radio>
    </el-radio-group>
    </div>
    <!-- <div class="right-detail-box account-height">
      <div>
        账户金额：
        <span class="main-color-pink">{{account}}</span>元
      </div>
    </div> -->
    <div class="main-more-black-color pint-type">
      <div>
        <el-radio v-model="radio" :label="1">打印小票</el-radio>
        <span @click="selectPint">
          <i class="iconfont icondayinji"></i>&ensp;设置打印机
        </span>
      </div>
      <div>
        <el-radio v-model="radio" :label="2">打印发票</el-radio>
        <span @click="selectPint">
          <i class="iconfont icondayinji"></i>&ensp;设置打印机
        </span>
      </div>
    </div>
    <div class="display-flex align-items-center justify-content-flex-justify">
      <div
        :class="{'cash-assets':true,'cash-assets-cash-active':paymentType==2701?true:false}"
        @click="paymentMethod(2701)"
      >
        <i class="iconfont iconxianjin"></i>
        <span>现金</span>
      </div>
      <div
        :class="{'cash-assets':true,'cash-assets-scan-active':paymentType==2?true:false}"
        @click="paymentMethod(2)"
      >
        <i class="iconfont iconsaoma"></i>
        <span>扫码</span>
      </div>
    </div>
    <button class="pay-btn" @click="mydebounce()">结算</button>
  </div>
</template>
<script>
import { debounce, updateMoney, changeTwoDecimal } from "@/utils/index";
import {Settlement} from "@/api/cashCharge"
export default {
  props: {
    unpaidMoney: {//剩余未缴
      type: Number,
      default: 0
    },
    totalLength:{},//用户所有未缴费状态的数据个数-需求（当用户有未缴纳的费用时，不可单独进行预存操作）
    payOrderId:{},//结算的费用单ID
    customerId:{},//用户ID
     accountMoney:{
       type: Number,
      default: 0
     }//账户余额
  },
  watch:{
    unpaidMoney(v){
       this.calculationReceivable()
    },
    isAccount(v){
      //  this.isAccount =v;
       if(!this.testMoney()) return false
      this.surplusFunc();
    }
  },
  data() {
    return {
      radio: 1,
      paymentType: 2701,
      isAccount: false,
      num: "",
      needMoney: 0, //应缴金额    
      surplus: 0, //找零
      balanceDeduction:0,//账户抵扣
      saveAccount:0//zanshi
    };
  },
  mounted() {
    this.mydebounce = debounce(this.test, 600);
  },
  methods: {
    getList() {},
    // 选择支付方式
    paymentMethod(i) {
      this.paymentType = i;
      this.$emit("selectPayment", i);
    },
    // 计算应收
    calculationReceivable(){
      // 应缴金额=账户余额-剩余未缴     
      let needMoney=(parseFloat(this.accountMoney)*1000-parseFloat(this.unpaidMoney)*1000)/1000
      if(needMoney>0){
        this.needMoney=0
        this.balanceDeduction=this.unpaidMoney//计算账户抵扣了多少钱
      }else{
        this.needMoney=Math.abs(needMoney).toFixed(2)
        this.balanceDeduction=this.accountMoney
      }     
    },
    // 输入金额保留2位
    money(e) {
      e.target.value = updateMoney(e.target.value);
    },
    selectPint() {
      this.$emit("selectPint", "");
    },
    //点击结算-验证
    test() {
      if(!this.customerId){
        this.$message({
          message: "请查询需要缴费的用户！",
          type: "error",
          duration: 4000
        });
        return false
      }     
      if(this.payOrderId.length==0&&this.totalLength>0){
        this.$message({
          message: "请勾选需要缴纳的费用！",
          type: "error",
          duration: 4000
        });
        return false
      }
       this.changeTwoDecimal_x();//补齐小数-   
      if(!this.testMoney()) return false//验证金额
      this.pay();//结算
    },
    // 结算
    pay() {
      if(this.paymentType==2){
         this.$message({
          message: "扫码支付暂未开通，敬请期待！",
          type: "error",
          duration: 4000
        });
        return false
      }
      let obj={
        customerId:this.customerId,
        orderId:this.payOrderId,
        receivable:this.unpaidMoney,//剩余未缴
        receipts:this.num,//实收
        balanceDeduction:this.balanceDeduction,//账户抵扣
        isAccount:this.isAccount,
        payType:this.paymentType
      }
       
      Settlement(obj).then(res=>{
        this.num=''
        this.$emit("getCustomer"); //重新获取列表数据和账户余额        
      })
    },
    // 补齐小数-
    changeTwoDecimal_x() {
     this.num= changeTwoDecimal(this.num);
      if(!this.testMoney()) return false
     this.surplusFunc()
    },
    // 判断输入金额不能小于应缴金额
    testMoney() {
      if (parseFloat(this.num) < parseFloat(this.needMoney)) {
        this.$message({
          message: "实收金额不能小于应收金额",
          type: "error",
          duration: 4000
        });
         this.surplus=0
        return false;
      }
      return true
    },
    // 计算找零
    surplusFunc() {   
      if (this.isAccount||!this.num) 
      this.surplus=0
      else
      this.surplus = (parseFloat(this.num) * 1000 - parseFloat(this.needMoney) * 1000) /1000
    }
  }
};
</script>
<style lang="scss" scoped>
.right-detail-box {
  background: #f5f5f5;
  padding: 0 17px;
  padding-bottom: 15px;
  > div {
    line-height: 33px;
    color: #46494c;
  }
}
.right-detail-input {
  > input {
    height: 50px;
    width: 156px;
    border: 1px solid #ff5656;
    margin-right: 5px;
    color: #ff5656;
    font-size: 22px;
    font-weight: bold;
    padding-left: 5px;
    &:focus {
      outline: none;
      border: 2px solid #ff5656;
    }
  }
}
.save-account {
  padding: 8px 0;
  font-size: 13px;
  margin: 8px 0;
  color:#46494c;
}
.account-height {
  height: 54px;
  > div {
    line-height: 50px !important;
    > span {
      font-weight: bold;
    }
  }
}
.pint-type {
  padding: 10px 0 10px 17px;
  line-height: 30px;
  font-size: 13px;
  background: #f5f5f5;
  span {
    cursor: pointer;
  }
}
.pay-btn {
  background: #ef8205;
  text-align: center;
  color: #fff;
  width: 100%;
  padding: 11px 0;
  outline: none;
  border: none;
  cursor: pointer;
  &:hover {
    background: #ff8c00;
  }
  &:focus {
    background-color: #ff8c00;
  }
}
.set-pint {
  font-size: 13px;
  color: #777c82;
  line-height: 40px;
  cursor: pointer;
}
.cash-assets {
  width: 47%;
  text-align: center;
  padding: 10px 0;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;
  margin-top: 18px;
  &:first-child {
    border: 1px solid #00b2a1;
    color: #00b2a1;
  }
  &:last-child {
    border: 1px solid #33b300;
    color: #33b300;
  }
  &:hover {
    opacity: 0.9;
  }
  .iconfont {
    font-size: 21px !important;
  }
  span {
    position: relative;
    top: -2px;
    left: 5px;
  }
}
.cash-assets-cash-active {
  background: #00b2a1;
  color: #fff !important;
}
.cash-assets-scan-active {
  background: #33b300;
  color: #fff !important;
}
</style>

