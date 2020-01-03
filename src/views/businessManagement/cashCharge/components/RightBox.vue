<template>
  <!--右侧缴费操作 -->
  <div>
    <div class="right-detail-box">
      <!-- <div class="display-flex align-items-center justify-content-flex-justify right-font-18">
        <div>剩余未缴</div>
        <div class="right-big-font">
          <span class="right-small-font">¥</span>
          {{unpaidMoney}}
        </div>
      </div>-->
      <div
        class="display-flex align-items-center justify-content-flex-justify right-font-18"
        style="background:#f5f5f5;"
      >
        <div>账户余额</div>
        <div class="main-color right-big-font">
          <span class="right-small-font">¥</span>
          {{accountMoney}}
        </div>
      </div>
      <div
        class="display-flex align-items-center justify-content-flex-justify filter-container right-font-18"
      >
        <!-- 勾选的费用单金额=应收金额（剩余未缴） -->
        <div>应收金额</div>
        <div class="right-big-font">
          <span class="right-small-font">¥</span>
          {{unpaidMoney}}
        </div>
      </div>
      <div
        class="display-flex align-items-center justify-content-flex-justify filter-container flex-wrap"
        style="height:87px"
      >
        <div class="main-color-pink font-weight">
          <span class="right-font-20">实收金额</span>
        </div>
        <div
          :class="{'right-detail-input-active':isFocus,'right-detail-input display-flex justify-content-flex-end align-items-center':true}"
        >
          <span class="main-color-pink money-icon">¥</span>
          <input
            :style="{'width':inputWidth+'px'}"
            type="text"
            v-model="num"
            @blur="changeTwoDecimal_x()"
            @keyup="money($event)"
            @focus="isFocus=true"
            @keyup.enter="mydebounce()"
            ref="myInput"
            maxlength="7"
          />
        </div>
      </div>
      <div
        v-show="isAccount==false"
        class="display-flex align-items-center justify-content-flex-justify right-font-18"
      >
        <div class="right-font-18">&#12288;&#12288;找零</div>
        <div class="right-big-font secur-content">
          <span class="right-small-font">¥</span>
          {{surplus}}
        </div>
      </div>
    </div>
    <div class="display-flex align-items-center justify-content-flex-justify save-account">
      <div>
        <span>是否存入账户:&emsp;</span>
        <el-radio-group v-model="isAccount">
          <el-radio :label="true">是</el-radio>
          <el-tooltip
            v-show="unpaidMoney=='0.00'"
            class="item"
            popper-class="tooltip"
            effect="light"
            :visible-arrow="false"
            content="当前应收金额为0，不可找零"
            placement="bottom"
          >
           <el-radio :label="false" :disabled="unpaidMoney=='0.00'?true:false">否</el-radio>
          </el-tooltip>
         
        </el-radio-group>
      </div>
      <i class="iconfont iconshezhi set-pint-btn" @click="pintShow=true"></i>
      <div class="main-more-black-color pint-type" v-show="pintShow">
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
        <div class="text-center app-container">
          <el-button type="primary" size="mini" @click="pintShow=false">确定</el-button>
          <el-button size="mini" @click="pintShow=false">取消</el-button>
        </div>
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
import {
  Settlement,
  ICSettlement,
  RollBackICSettlement
} from "@/api/cashCharge";
import { WriteCardInfo } from "@/utils/projectLogic";
import "@/styles/cashCharge.scss";
// unpaidMoney 剩余未缴  // totalLength用户所有未缴费状态的数据个数-需求（当用户有未缴纳的费用时，不可单独进行预存操作）
// payOrderId结算的费用单ID // customerId//用户IDv  // accountMoney//账户余额 //cardInfo IC卡 卡片信息
export default {
  props: [
    "unpaidMoney",
    "totalLength",
    "payOrderId",
    "customerId",
    "accountMoney",
    "isIC",
    "cardInfo"
  ],
  watch: {
    unpaidMoney(v) {
      this.num = v;
      let _this = this;
      setTimeout(function() {
        _this.$refs.myInput.select();
      }, 200);
    },
    isAccount(v) {
      if (!this.testMoney()) return false;
      this.surplusFunc();
    },
    customerId:{
      handler: function(val, oldVal){
           let _this = this;
        setTimeout(function() {
        //  isFirst 当卡片内充值次数为1，卡片金额为0，并且是未刷卡时，该值为true，否则为false  // this.cardInfo.CardType 0：未刷卡 1：已刷卡
          if (_this.isIc) {
            if (
              _this.cardInfo.UserCard.uRechargeCount == 1 &&
              _this.cardInfo.UserCard.RechargeMoney &&
              _this.cardInfo.CardType == 0
            )
            _this.isFirst = true;
           else _this.isFirst = false;
        }
        _this.$refs.myInput.select();
       }, 200);
      },
      immediate: true
    },
    num(v) {
      this.inputWidth = v.length * 18 < 100 ? 100 : v.length * 18;
      if (this.isAccount || !this.num) this.surplus = "0.00";
      else {
        let surplus;
        surplus = (
          (parseFloat(this.num) * 1000 - parseFloat(this.unpaidMoney) * 1000) /
          1000
        ).toFixed(2);
        if (surplus > 0) {
          this.surplus = surplus;
        } else {
          this.surplus = "0.00";
        }
      }
    }
  },
  data() {
    return {
      radio: 1,
      paymentType: 2701,
      isAccount: true,
      num: "0.00",
      inputWidth: 100,
      surplus: "0.00", //找零
      balanceDeduction: 0, //账户抵扣
      isFocus: false,
      pintShow: false,
      resCardInfo: {},
      isFirst: false
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
      if (i == 2) {
        this.$message({
          message: "扫码支付暂未开通，敬请期待！",
          type: "error",
          duration: 4000
        });
        this.paymentType = 2701;
        return false;
      }
      this.$emit("selectPayment", i);
    },
    // 输入金额保留2位
    money(e) {
      this.num = updateMoney(e.target.value);
    },
    selectPint() {
      this.$emit("selectPint", "");
    },
    //点击结算-验证
    test() {
      if (!this.customerId) {
        this.$message({
          message: "请查询需要缴费的用户！",
          type: "error",
          duration: 4000
        });
        return false;
      }
      if (this.payOrderId.length == 0 && this.totalLength > 0) {
        this.$message({
          message: "请勾选需要缴纳的费用！",
          type: "error",
          duration: 4000
        });
        return false;
      }
      this.changeTwoDecimal_x(); //补齐小数-
      if (!this.testMoney()) return false; //验证金额
      if (parseFloat(this.num) == parseFloat(this.surplus)) {
        this.$message({
          message: "请注意实收金额实际为0！",
          type: "error",
          duration: 4000
        });
        return false;
      }
      this.pay(); //结算
    },
    // 结算
    pay() {
      let receipts = parseFloat(this.num) - parseFloat(this.surplus);
      if (this.isIC) {
        //iC卡结算调用另一方法
        if (!this.icTest()) return false; //相关口径充值金额限制验证
        this.IcPay(receipts);
      } else {
        let obj = {
          customerId: this.customerId,
          orderId: this.payOrderId,
          receivable: this.unpaidMoney, //剩余未缴
          receipts: receipts, //实收
          balanceDeduction: this.balanceDeduction, //账户抵扣
          payType: this.paymentType
        };

        Settlement(obj).then(res => {
          this.$message({
            message: "操作成功",
            type: "success",
            duration: 4000
          });
          // 金额清零--s
          this.num = "0.00";
          this.surplus = "0.00";
          this.$emit("update:unpaidMoney", "0.00");
          this.unpaidMoney = '0.00';
          // 金额清零--e
          this.$emit("update:isIndeterminateParent", false);
          this.$emit("update:checkedAllParent", false); //结算完成后，父元素全选置为false，卡片获取列表再设置全选
          this.$emit("getCustomer"); //重新获取列表数据和账户余额
        });
      }
    },
    // 如果是IC卡结算
    IcPay(receipts) {
      let obj = {
        customerId: this.customerId,
        orderId: this.payOrderId,
        receivable: this.unpaidMoney, //剩余未缴
        receipts: receipts, //实收
        payType: this.paymentType,
        printerType: "", //打印方式 无打印 = -1,小票 = 2801,发票 = 2802,
        isFirst: this.isFirst //当卡片内充值次数为1，卡片金额为0，并且是未刷卡时，该值为true，否则为false
      };
      ICSettlement(obj).then(res => {
        this.resCardInfo = res.data; //{CardInfo:{},BusinessId:''}
        this.$message({
          message: "操作成功",
          type: "success",
          duration: 4000
        });
        // 金额清零--s
        this.num = "0.00";
        this.surplus = "0.00";
        this.$emit("update:unpaidMoney", "0.00");
        this.unpaidMoney = "0.00";  
      //结算完成后，父元素全选置为false，卡片获取列表再设置全选
        this.wCard(); //写卡  如果实收金额（input值-应收）=0，不写卡
      });
    },
    icTest() {
      //IC卡结算前验证
      if (this.cardInfo.CardType == 0 && !this.isFirst) {
        //如果为未刷卡，不允许充值
        this.$message({
          message: "未刷卡状态下不允许充值！",
          type: "error",
          duration: 4000
        });
        return false;
      }
      if (this.cardInfo.UserCard.MeterDiameter > 50) {
        //50<bore 大口径须充值10的倍数 25<bore<=50 精确到整数位
        if (!this.testBigBore()) return false;
      } else if (25 < this.cardInfo.UserCard.MeterDiameter <= 50) {
        //25<bore<=50 精确到整数位
        if (!this.testMediumBore()) return false;
      }
      return true;
    },
    // IC卡结算成功后，进行写卡操作
    wCard() {    
        WriteCardInfo(this.resCardInfo, errorRes => {
          // 读卡
          // 错误回调，执行回滚
         this.$emit("getCustomer")
        RollBackICSettlement({ businessId: errorRes.BusinessId })      
        },()=>{
          this.$emit("getCustomer")
        })
     
    },
    testBigBore() {
      //50<bore 大口径须充值10的倍数
      if (parseFloat(this.num) > 0 && parseFloat(this.num) % 10 !== 0) {
        this.$message({
          message: "大口径水表，充值金额须为10的倍数！",
          type: "error",
          duration: 4000
        });
        return false;
      }
      return true;
    },
    testMediumBore() {
      //25<bore<=50 精确到整数位
      if (parseFloat(this.num) > 0 && parseFloat(this.num) % 1 !== 0) {
        this.$message({
          message: "中等口径水表，充值金额须为整数！",
          type: "error",
          duration: 4000
        });
        return false;
      }
      return true;
    },
    // 补齐小数-
    changeTwoDecimal_x() {
      this.isFocus = false;
      this.num = changeTwoDecimal(this.num);
      if (!this.testMoney()) return false;
      this.surplusFunc();
    },
    // 判断输入金额不能小于应缴金额
    testMoney() {
      if (parseFloat(this.num) < parseFloat(this.unpaidMoney)) {
        this.$message({
          message: "实收金额不能小于应收金额",
          type: "error",
          duration: 4000
        });
        this.surplus = "0.00";
        return false;
      }
      return true;
    },
    // 计算找零
    surplusFunc() {
      if (this.isAccount || !this.num) this.surplus = "0.00";
      else
        this.surplus =
          (parseFloat(this.num) * 1000 - parseFloat(this.unpaidMoney) * 1000) /
          1000;
      this.surplus = changeTwoDecimal(this.surplus); //补齐小数
    }
  }
};
</script>

