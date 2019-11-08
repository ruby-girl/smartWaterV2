<template>
  <!--右侧缴费操作 -->
  <div>
    <div class="right-detail-box">
      <div>应收金额：{{needMoney}}元</div>
      <div class="display-flex align-items-center">
        <div class="main-color-pink">实收金额：</div>
        <div class="right-detail-input">
          <input
            type="text"
            v-model="num"
            @blur="changeTwoDecimal_x()"
            @keyup="money($event)"
          />
        </div>
        <span class="main-color-pink">元</span>
      </div>
      <div v-show="isAccount==false" style="height:28px;">&#12288;&#12288;找零：{{surplus}}元</div>
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
        <span class="main-color-pink">{{account}}</span>元
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
import { debounce, updateMoney, changeTwoDecimal } from "@/utils/index";
export default {
  props: {},
  data() {
    return {
      radio: 1,
      paymentType: 1,
      isAccount: false,
      num: "",
      needMoney: 33.33, //应缴金额
      surplus: 0, //找零
      account: 22.33, //账户金额
      saveAccount: 22.33
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
    // 输入金额保留2位
    money(e) {
      e.target.value = updateMoney(e.target.value);
    },
    selectPint() {
      this.$emit("selectPint", "");
    },
    toggleIsAccount() {
      this.isAccount = !this.isAccount;
       if(!this.testMoney()) return false
      this.surplusFunc();
    },
    //点击结算-验证
    test() {
      this.changeTwoDecimal_x();
      this.pay();
    },
    // 结算
    pay() {
      console.log("准备结算咯");
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
    },
    // 计算找零or+账户
    surplusFunc() {
      let surplus =
        (parseFloat(this.num) * 1000 - parseFloat(this.needMoney) * 1000) /
        1000;
      if (this.isAccount) {
        this.account =
          (surplus * 1000 + parseFloat(this.account) * 1000) / 1000;
          this.surplus=0
      } else {
        this.surplus = surplus;
        this.account = this.saveAccount;
      }
    }
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

