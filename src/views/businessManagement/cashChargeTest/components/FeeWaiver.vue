<template>
  <!-- 费用减免-水费 -->
  <el-dialog
    title="费用减免"
    :visible.sync="dialogFormVisible"
    top="20vh"
    width="610px"
    center
    custom-class="dialog-background"
    :close-on-click-modal="false"
  >
    <div class="feewaiver-box">
      <el-form
        :inline="true"
        class="head-search-form form-inline-small-input"
        size="small"
        label-width="60px"
        @submit.native.prevent
      >
        <el-tabs v-model="activeName">
          <el-tab-pane label="水费" name="frist">
            <el-row class="tab-container-y">
              <el-form-item :label="feeWaiverItem.OrderTypeStr">
                <el-input v-model="feeWaiverItem.PriceSurplus" disabled />
              </el-form-item>
              <div class="inline-box">
                <div>减免为</div>
                <img class="arrow-point" src="@/assets/imgs/arrow_point.png" alt />
              </div>
              <el-form-item>
                <el-input
                  v-model="inputValue"
                  @blur="changeTwoDecimal_x($event)"
                  @keyup.native="money($event)"
                  maxlength="8"
                />
              </el-form-item>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="违约金" name="two">
            <el-row class="tab-container-y">
              <el-form-item label="违约金">
                <el-input v-model="feeWaiverItem.LateFee" disabled />
              </el-form-item>
              <div class="inline-box">
                <div>减免为</div>
                <img class="arrow-point" src="@/assets/imgs/arrow_point.png" alt />
              </div>
              <el-form-item>
                <el-input
                  v-model="lateFeeValue"
                  @blur="changeTwoDecimal_x($event)"
                  @keyup.native="money($event)"
                  maxlength="8"
                  :disabled="feeWaiverItem.OrderType==2001&&feeWaiverItem.LateFee==0?true:false"
                />
              </el-form-item>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button
        size="mini"
        type="primary"
        @click="feeWaiver"
        :disabled="feeWaiverItem.OrderType==2001&&feeWaiverItem.LateFee==0&&activeName=='two'?true:false"
      >确认</el-button>
      <el-button size="mini" @click="dialogFormVisible = false">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { updateMoney, changeTwoDecimal } from "@/utils/index.js";
import { OrderFeeWaiver, OrderAfterOverdueFeeWaiver } from "@/api/cashCharge";
export default {
  props: {
    //   减免Id
    feeWaiverItem: {
      type: Object
    },
    feeWaiverShow: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    feeWaiverShow() {
      this.dialogFormVisible = this.feeWaiverShow;
    },
    dialogFormVisible(val, oldVal) {
      if (val === oldVal) {
        return;
      }
      this.$emit("update:feeWaiverShow", val);
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      inputValue: "",
      lateFeeValue: "", //违约金金额
      activeName: "frist"
    };
  },
  methods: {
    feeWaiver() {
      if (this.activeName == "two") {
        this.OrderAfterOverdueFeeWaiverFunc(); //违约金减免
      } else {
        this.OrderFeeWaiverFunc();
      }
    },
    OrderFeeWaiverFunc() {//水费减免
      if (
        parseFloat(this.inputValue) >
        parseFloat(this.feeWaiverItem.PriceSurplus)
      ) {
        this.$message({
          message: "减免后金额不能大于减免前金额！",
          type: "error",
          duration: 4000
        });
        return;
      }
      OrderFeeWaiver({
        SA_Order_Id: this.feeWaiverItem.Id,
        AfterFee: this.inputValue
      }).then(res => {
        this.inputValue = "";
        this.lateFeeValue = "";
        this.dialogFormVisible = false;
        this.$emit("getList");
      });
    },
    // 违约金减免
    OrderAfterOverdueFeeWaiverFunc() {
      if (
        parseFloat(this.lateFeeValue) > parseFloat(this.feeWaiverItem.LateFee)
      ) {
        this.$message({
          message: "减免后金额不能大于减免前金额！",
          type: "error",
          duration: 4000
        });
        return;
      }
      OrderAfterOverdueFeeWaiver({
        SA_Order_Id: this.feeWaiverItem.Id,
        AfterOverdueFee: this.lateFeeValue
      }).then(res => {
        this.$message({
          message: "减免成功",
          type: "success",
          duration: 4000
        });
        this.inputValue = "";
        this.lateFeeValue = "";
        this.dialogFormVisible = false;
        this.$emit("getList");
      });
    },
    // 输入金额保留2位
    money(e) {
      e.target.value = updateMoney(e.target.value);
    },
    // 补齐小数
    changeTwoDecimal_x(e, n) {
      // e.target.value = changeTwoDecimal(e.target.value);
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/ .dialog-background .el-dialog__body {
  background: #eee;
  padding: 0px 20px 0 20px;
}
/deep/ .el-dialog__footer {
  background: #eee !important;
  .dialog-footer {
    background: #eee !important;
  }
}
.feewaiver-box {
  padding-bottom: 10px;
}
.inline-box {
  display: inline-block;
  margin-top: -2px;
  padding-right: 10px;
  > div {
    text-align: center;
    color: #00b3a1;
    margin-bottom: -5px;
  }
}
.tab-container-y {
  padding: 20px;
}
</style>