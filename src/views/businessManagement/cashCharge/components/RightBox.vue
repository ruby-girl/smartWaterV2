<template>
  <!--右侧缴费操作 -->
  <div>
    <div class="right-detail-box">
      <div>应收金额：80元</div>
      <div class="display-flex align-items-center">
        <div class="main-color-pink">实收金额：</div>
        <div class="right-detail-input">
          <input type="text" v-model="num" @keyup.enter="mydebounce()"  @blur="mydebounce()"/>
        </div>
        <span class="main-color-pink">元</span>
      </div>
      <div v-show="isAccount==false" style="height:28px;">&#12288;&#12288;找零：80元</div>
    </div>
    <div class="display-flex justify-content-flex-end">
      <div
        :class="{'save-account':true,'save-account-active':isAccount==true}"
        @click="toggleIsAccount"
      >{{isAccount==true?'账户转出':'存入账户'}}</div>
    </div>
    <div class="right-detail-box account-height">
      <div>
        账户金额：
        <span class="main-color-pink">20</span>元
      </div>
    </div>
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
        :class="{'cash-assets':true,'cash-assets-cash-active':paymentType==1?true:false}"
        @click="paymentMethod(1)"
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
import { debounce } from "@/utils/index";
export default {
  props: {},
  data() {
    return {
      radio: 1,
      paymentType: 1,
      isAccount: false,
      num:22
    };
  },
mounted(){
  this.mydebounce= debounce(this.test, 1000);
},
  methods: {
    getList() {},   
    // 选择支付方式
    paymentMethod(i) {
      this.paymentType = i;
      this.$emit("selectPayment", i);
    },
    selectPint() {
      this.$emit("selectPint", "");
    },
    toggleIsAccount() {
      this.isAccount = !this.isAccount;
    },
    // 验证实收金额不能小于应收金额
    test() {
      console.log('这里是先验证')
     this.testCasha()
    },
    // 结算
    testCasha() {
      console.log("准备结算咯");     
    },
  }
};
</script>
<style lang="scss" scoped>
.right-detail-box {
  background: #f5f5f5;
  padding: 0 10px;
  padding-bottom: 15px;
  > div {
    line-height: 40px;
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
  color: #00b3a1;
  border: 1px solid #00b3a1;
  border-radius: 4px;
  padding: 6px 8px;
  width: 86px;
  text-align: center;
  font-size: 13px;
  margin: 12px 0;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
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
  padding: 15px 0 15px 0;
  line-height: 30px;
  font-size: 13px;
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
.save-account-active {
  background: #00b2a1;
  color: #fff;
}
</style>

