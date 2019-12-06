<template>
  <!--右侧缴费操作 -->
  <div>
    <el-row class="display-flex justify-content-flex-justify">
      <!-- 左侧用户信息 -->   
     <el-col :md="8" class="user-box">
       <!-- IC卡 -->
        <div v-if="isIc">
         <zebra-table label-left="姓名" label-right="是否刷卡" value-left="201" value-right="10" :isGray="true" color="#46494C" />
         <zebra-table label-left="水表类型" label-right="充值金额" value-left="201" value-right="10" :isGray="false" color="#46494C" />
         <zebra-table label-left="水表编号" label-right="充值次数" value-left="201" value-right="10" :isGray="true"color="#46494C" />
         <zebra-table label-left="电话" label-right="剩余未缴" value-left="201" value-right="10" :isGray="false" color="#FF4646" font-weight="bold"/>
         <zebra-table label-left="地址" label-right="账户余额" value-left="201" value-right="10" :isGray="true" color="#00B3A1" font-weight="bold"/>
        </div>
        <!-- 非IC卡 -->
        <el-row  v-else>
           <el-col :md="12">
             <special-zebra-table label-left="姓名" :value-left="headUser.CustomerName" :isGray="true"/>
             <special-zebra-table label-left="水表类型" :value-left="headUser.WaterMeterTypeName" :isGray="false"/>
             <special-zebra-table label-left="水表编号" :value-left="headUser.SA_WaterMeterNo" :isGray="true"/>
             <special-zebra-table label-left="电话" :value-left="headUser.Tel" :isGray="false"/>
             <special-zebra-table label-left="地址" :value-left="headUser.Address" :isGray="true"/>
          </el-col>
          <el-col :md="12">
            <div>
              <special-zebra-table label-left="剩余未缴" :value-left="unpaidMoney" :isGray="true" color="#FF4646" font-weight="bold" lineHeight="92"/>
              <special-zebra-table label-left="账户余额" :value-left="accountMoney" :isGray="false" color="#00B3A1" font-weight="bold" lineHeight="91"/>
            </div>
          </el-col>
        </el-row>
     </el-col>
      <!-- 实收 -->
      <el-col :md="10" class="payment-box  flex-1">
        <div class="display-flex align-items-center justify-content-flex-justify payment-item">
          <div>应收金额</div>
          <div>¥60.00</div>
        </div>
       <div class="display-flex align-items-center justify-content-flex-justify payment-item">
          <div>实收金额</div>
         <div class="right-detail-input">
          <input
            type="text"
            v-model="num"
            @blur="changeTwoDecimal_x()"
            @keyup="money($event)"
            ref="myInput"
          />
           <span class="main-color-pink">¥</span>
        </div>
        </div>
        <div class="display-flex align-items-center justify-content-flex-justify payment-item">
          <div>找零</div>
          <div>¥60.00</div>
        </div>
      </el-col>
      <!-- 结算 -->
      <el-col :md="6" class="pay-type-box">
        <div style="text-align:right"><i class="iconfont iconshezhi1"></i></div>
        <div style="font-size: 14px;">选择缴费方式</div>
        <div class="display-flex align-items-center justify-content-flex-justify">
          <div :class="{'cash-assets':true,'cash-assets-scan-active':paymentType==2?true:false}"
           @click="paymentMethod(2)">
            <i class="iconfont iconsaoma"></i>
            <span>扫码</span>
          </div>
          <div
            :class="{'cash-assets':true,'cash-assets-cash-active':paymentType==2701?true:false}"
            @click="paymentMethod(2701)">
              <i class="iconfont iconxianjin"></i>
              <span>现金</span>
          </div>        
          </div>
          <button class="pay-btn" @click="mydebounce()">结算</button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { debounce, updateMoney, changeTwoDecimal } from "@/utils/index";
import {Settlement} from "@/api/cashCharge"
import ZebraTable from "./IcType/ZebraTable";
import SpecialZebraTable from "./IcType/SpecialZebraTable";
export default {
  components: { ZebraTable,SpecialZebraTable },
  props: {
    headUser:{},
     unpaidMoney: {//剩余未缴   
      default: 0
    },
    totalLength:{},//用户所有未缴费状态的数据个数-需求（当用户有未缴纳的费用时，不可单独进行预存操作）
    payOrderId:{},//结算的费用单ID
    customerId:{},//用户ID
     accountMoney:{
      default: 0
     }//账户余额
  },
  watch:{
    
  },
  data() {
    return {
      isIc:false,
      radio: 1,
      paymentType: 2701,
      isAccount: true,
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
      if(i==2){
         this.$message({
          message: "扫码支付暂未开通，敬请期待！",
          type: "error",
          duration: 4000
        });
        this.paymentType=2701
        return false
      }
      this.$emit("selectPayment", i);
    },
    // 计算应收
    calculationReceivable(){
      // 应缴金额=账户余额-剩余未缴     
      let needMoney=(parseFloat(this.accountMoney)*1000-parseFloat(this.unpaidMoney)*1000)/1000
      if(needMoney>0){
        this.needMoney=0
        this.num=''
        this.balanceDeduction=this.unpaidMoney//计算账户抵扣了多少钱
      }else{
        this.needMoney=Math.abs(needMoney).toFixed(2)
        this.num=Math.abs(needMoney).toFixed(2)
        
        this.balanceDeduction=this.accountMoney
      }
      let _this=this
      setTimeout(function(){
        _this.$refs.myInput.select()
      },200)
     
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
      // if(this.paymentType==2){
      //    this.$message({
      //     message: "扫码支付暂未开通，敬请期待！",
      //     type: "error",
      //     duration: 4000
      //   });
      //   return false
      // }
      let receipts=parseFloat(this.num)-parseFloat(this.surplus)
      let obj={
        customerId:this.customerId,
        orderId:this.payOrderId,
        receivable:this.unpaidMoney,//剩余未缴
        receipts:receipts,//实收
        balanceDeduction:this.balanceDeduction,//账户抵扣
        isAccount:this.isAccount,
        payType:this.paymentType
      }
       
      Settlement(obj).then(res=>{
         this.$message({
          message: "操作成功",
          type: "success",
          duration: 4000
        });
        // 金额清零--s
         this.num=''
         this.surplus=0
         this.$emit("update:unpaidMoney", 0)
         this.needMoney=0
          // 金额清零--e
        this.$emit("update:isIndeterminateParent", false);
        this.$emit("update:checkedAllParent", false);//结算完成后，父元素全选置为false，卡片获取列表再设置全选
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
.user-box{
   min-width:350px;
  // max-width: 450px;
  border:1px solid #DBE3E8;
}
.payment-item{
  line-height: 55px;
  font-size: 18px;
  color:#2F3133;
}
.right-detail-input {
  position: relative;
  > input {
    height: 73px;
    width: 280px;
    border: 1px solid #ff5656;
    margin-right: 5px;
    color: #ff5656;
    font-size: 40px;
    font-weight: bold;
    padding-left: 60px;
    // text-align: center;
    &:focus {
      outline: none;
      border: 2px solid #ff5656;
    }
  }
  .main-color-pink{
    position: absolute;
    top:20px;
    left:40px;
  }
}
.payment-box{
  min-width:400px;
  padding: 0 15px 0 24px;
}
.pay-type-box{
  // width:292px;
  background: #F5F5F5;
  padding: 10px 18px 18px 18px;
  color:#46494C;
}
.cash-assets {
  width: 47%;
  text-align: center;
  padding: 16px 0;
  border-radius: 5px;
  cursor: pointer;
  margin: 10px 0;
  &:first-child {
    border: 1px solid #33b300;
    color: #33b300;
  }
  &:last-child {
    border: 1px solid #00b2a1;
    color: #00b2a1;
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
</style>

