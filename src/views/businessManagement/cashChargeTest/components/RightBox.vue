<template>
  <!--右侧缴费操作 -->
  <div>
    <el-row class="display-flex justify-content-flex-justify" style="position:relative;">
      <!-- 左侧用户信息 -->   
     <el-col  :lg="8" :xl="8" class="user-box hidden-md-and-down">
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
              <special-zebra-table label-left="剩余未缴" :value-left="unpaidMoney" :isGray="true" color="#FF4646" font-weight="bold" :lineHeight="lineHeight"/>
              <special-zebra-table label-left="账户余额" :value-left="accountMoney" :isGray="false" color="#00B3A1" font-weight="bold" :lineHeight="lineHeight"/>
            </div>
          </el-col>
        </el-row>
     </el-col>
     <!-- 小屏幕固定定位 -->
     <div class="hidden-lg-and-up position-user-box display-flex">
         <div class="position-user-left" style="margin-right:5px;" @click="userShow=true">用户信息</div>
          <transition-group name="fade">
         <div v-show="isIc&&userShow" class="flex-1 position-user-border" key="user">
         <zebra-table label-left="姓名" label-right="是否刷卡" value-left="201" value-right="10" :isGray="true" color="#46494C" />
         <zebra-table label-left="水表类型" label-right="充值金额" value-left="201" value-right="10" :isGray="false" color="#46494C" />
         <zebra-table label-left="水表编号" label-right="充值次数" value-left="201" value-right="10" :isGray="true"color="#46494C" />
         <zebra-table label-left="电话" label-right="剩余未缴" value-left="201" value-right="10" :isGray="false" color="#FF4646" font-weight="bold"/>
         <zebra-table label-left="地址" label-right="账户余额" value-left="201" value-right="10" :isGray="true" color="#00B3A1" font-weight="bold"/>
        </div>
        <!-- 非IC卡 -->
        <el-row class="flex-1 position-user-border"  v-show="!isIc&&userShow"  key="noIc">
           <el-col :md="12">
             <special-zebra-table label-left="姓名" :value-left="headUser.CustomerName" :isGray="true"/>
             <special-zebra-table label-left="水表类型" :value-left="headUser.WaterMeterTypeName" :isGray="false"/>
             <special-zebra-table label-left="水表编号" :value-left="headUser.SA_WaterMeterNo" :isGray="true"/>
             <special-zebra-table label-left="电话" :value-left="headUser.Tel" :isGray="false"/>
             <special-zebra-table label-left="地址" :value-left="headUser.Address" :isGray="true"/>
          </el-col>
          <el-col :md="12">
            <div>
              <special-zebra-table label-left="剩余未缴" :value-left="unpaidMoney" :isGray="true" color="#FF4646" font-weight="bold" :lineHeight="lineHeight"/>
              <special-zebra-table label-left="账户余额" :value-left="accountMoney" :isGray="false" color="#00B3A1" font-weight="bold" :lineHeight="lineHeight"/>
            </div>
          </el-col>
          
        </el-row>
        <div class="toggle-class"  v-show="userShow" key="toggle"><span class="main-color pointer" style="padding-left:8px;" @click="userShow=false">收起</span></div>
        
         </transition-group>
     </div>
     <!-- 定位Box --e -->
      <!-- 实收 -->
      <el-col :md="12"  :lg="10" :xl="10" class="payment-box  flex-1">
        <div class="display-flex align-items-center justify-content-flex-justify payment-item">
          <div>应收金额</div>
          <div>¥{{needMoney}}</div>
        </div>
       <div class="display-flex align-items-center justify-content-flex-justify payment-item" style="height:77px;">
          <div class="font-weight main-color-pink" style="font-size:22px;">实收金额</div>
         <div :class="{'right-detail-input-active':isFocus,'right-detail-input display-flex justify-content-flex-end align-items-flex-end':true}">
           <span class="main-color-pink">¥</span>
          <input :style="{'width':inputWidth+'px'}"
            type="text"
            v-model="num"
            @blur="changeTwoDecimal_x()"
            @keyup="money($event)"
            @focus="isFocus=true"
             @keyup.enter="mydebounce()"
            ref="myInput"
            maxlength="8"
          />         
        </div>
        </div>
        <div class="display-flex align-items-center justify-content-flex-justify payment-item">
          <div>找零</div>
          <div>¥{{surplus}}</div>
        </div>
      </el-col>
      <!-- 结算 -->
      <el-col :md="12" :lg="6" :xl="6" class="pay-type-box">
        <div style="text-align:right" class="pointer" @click="settingShow=true"><i class="iconfont iconshezhi1"></i></div>
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
          <div class="setting-box" v-show="settingShow">
            <div class="display-flex save-account">
              <span> 是否存入账户:&emsp;</span>
              <el-radio-group v-model="isAccount">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </div>
            <div class="pint-item">
              <el-radio v-model="radio" :label="1">打印小票</el-radio>
              <span @click="selectPint" style="font-size:13px;">
                  <i class="iconfont icondayinji"></i>&ensp;设置打印机
              </span>
            </div>
            <div class="pint-item">
              <el-radio v-model="radio" :label="2">打印发票</el-radio>
              <span @click="selectPint" style="font-size:13px;">
                <i class="iconfont icondayinji"></i>&ensp;设置打印机
              </span>
            </div>
            <div class="pay-type-btn">
              <el-button type="primary" size="mini" @click="settingFunc">确定</el-button>
              <el-button type="success" size="mini" @click="settingShow=false">取消</el-button>
            </div>
          </div>     
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { debounce, updateMoney, changeTwoDecimal } from "@/utils/index";
import {Settlement} from "@/api/cashCharge"
import ZebraTable from "./IcType/ZebraTable";
import SpecialZebraTable from "./IcType/SpecialZebraTable";
import 'element-ui/lib/theme-chalk/display.css';
export default {
  components: { ZebraTable,SpecialZebraTable },
  props: {
    headUser:{},
     unpaidMoney: {//剩余未缴   
      default: '0.00'
    },
    totalLength:{},//用户所有未缴费状态的数据个数-需求（当用户有未缴纳的费用时，不可单独进行预存操作）
    payOrderId:{},//结算的费用单ID
    customerId:{},//用户ID
     accountMoney:{
      default: 0.00
     }//账户余额
  },
 watch:{
   headUser:{
      handler() {
        let _this=this
       setTimeout(function(){
         _this.$refs.myInput.select()
       },200)
      },
      immediate: true
   },
    unpaidMoney(v){
       this.calculationReceivable()
    },
    num(v){
      this.inputWidth=v.length*25<100?100:v.length*25
    },
    isAccount(v){
       if(!this.testMoney()) return false
      this.surplusFunc();
    }
  },
  data() {
    return {
      isIc:false,
      radio: 1,
      paymentType: 2701,
      isAccount: false,
      num: '0.00',
      needMoney: '0.00', //应缴金额    
      surplus: '0.00', //找零
      balanceDeduction:0,//账户抵扣
      saveAccount:0,//zanshi
      isFocus:false,
      settingShow:false,
      inputWidth:100,
      lineHeight:90,
      userShow:false
    };
  },
  mounted() {
  let screeWidth = window.screen.width
  if(screeWidth<1200){
    this.lineHeight=77
  }
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
      let needMoney=((parseFloat(this.accountMoney)*1000-parseFloat(this.unpaidMoney)*1000)/1000)
      if(needMoney>0){
        this.needMoney=0.00
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
      console.log('结算事件')
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
         this.surplus=0.00
         this.$emit("update:unpaidMoney", 0.00)
         this.needMoney=0.00
          // 金额清零--e
        this.$emit("update:isIndeterminateParent", false);
        this.$emit("update:checkedAllParent", false);//结算完成后，父元素全选置为false，卡片获取列表再设置全选
        this.$emit("getCustomer"); //重新获取列表数据和账户余额        
      })
    },
    // 补齐小数-
    changeTwoDecimal_x() {
      this.isFocus=false
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
         this.surplus=0.00
        return false;
      }
      return true
    },
    // 计算找零
    surplusFunc() {   
      if (this.isAccount||!this.num) 
      this.surplus=0.00
      else
      this.surplus = ((parseFloat(this.num) * 1000 - parseFloat(this.needMoney) * 1000) /1000).toFixed(2)
    },
    settingFunc(){

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
  padding-left: 10px;
}
.right-detail-input {
  position: relative;
   border: 1px solid #ff5656;
   color: #ff5656;
   width:290px;
  > input {
    height: 73px;
    border:none;
    text-align: right;
    color: #ff5656;
    font-size: 40px;
    font-weight: bold;
    &:focus {
      outline: none;   
    }
  }
}
.right-detail-input-active{
  border: 2px solid #ff5656;
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
  position: relative;
  .setting-box{
    position: absolute;
    right:35px;
    top:15px;
    background: #fff;
    padding: 10px;
  }
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
.pay-type-btn{
  padding:20px 0 15px 0;
  text-align: center;
}
.pint-item{
  padding-top: 10px;
}
.save-account{
  font-size: 14px;
  padding: 5px 0;
}
.position-user-box{
  position: absolute;
  top:-10px;
  left:-8px;
  cursor: pointer;
  padding: 10px 0 10px 10px;
  background: #fff;
  // border:1px solid #aaa;
  z-index: 1000000;
  box-shadow:2px 0px 8px rgba(0,0,0,0.16);
}
.position-user-left{
  width: 20px;
  line-height: 20px;
  height:187px;
  padding-top: 50px;
}
.position-user-border{
  width:450px;
  border-top:1px solid #dbe3e8;
  border-left:1px solid #dbe3e8;
  margin-right: 50px;
}
.toggle-class{
  position: absolute;
  top:10px;
  right:15px;
}
</style>

