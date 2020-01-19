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
    @open="isOpenFun"
    @closed="close"
  >
    <div class="feewaiver-box">
      <el-form
        :inline="true"
        class="head-search-form form-inline-small-input"
        size="small"
        label-width="60px"
        @submit.native.prevent
      >
        <el-row class="tab-container-y">
          <el-form-item :label="type">
            <el-input v-model="type=='水费'?feeWaiverItem.Money:feeWaiverItem.LateFee" disabled />
          </el-form-item>
          <div class="inline-box">
            <div>减免为</div>
            <img class="arrow-point" src="@/assets/imgs/arrow_point.png" alt />
          </div>
          <el-form-item>
            <el-input
              v-model="inputValue"
              @blur="changeTwoDecimal_x($event,1)"
              @keyup.native="money($event,1)"
              maxlength="8"
            />
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" type="primary" @click="feeWaiver">{{isOpen&&type=='违约金'?"提交审核":"确定"}}</el-button>
      <el-button size="mini" @click="dialogFormVisible = false">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { updateMoney, changeTwoDecimal } from "@/utils/index.js";
import { OrderFeeWaiver, OrderAfterOverdueFeeWaiver } from "@/api/cashCharge";
import { getOpenFlag } from "@/utils/projectLogic";
export default {
  props: {
    //   减免Id
    feeWaiverItem: {
      type: Object
    },
    feeWaiverShow: {
      type: Boolean,
      default: false
    },
    type: {}
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
      isOpen:false
    };
  },
  methods: {
    isOpenFun(){
       getOpenFlag(2911).then(val => {
      this.isOpen = val;
    });
    },
    close() {
      this.inputValue = "";
    },
    feeWaiver() {
      if (this.type == "水费") {
        this.OrderFeeWaiverFunc();
      } else {
        this.OrderAfterOverdueFeeWaiverFunc(); //违约金减免
      }
    },
    OrderFeeWaiverFunc() {
      //水费减免
      if (parseFloat(this.inputValue) > parseFloat(this.feeWaiverItem.Money)) {
        this.$message({
          message: "减免后金额不能大于减免前金额！",
          type: "error",
          duration: 4000
        });
        return;
      }
      OrderFeeWaiver({
        SA_Order_Id: this.feeWaiverItem.Id,
        AfterFee: this.inputValue,
        model: "现金收费"
      }).then(res => {
        this.resFunc();
      });
    },
    // 违约金减免
    OrderAfterOverdueFeeWaiverFunc() {
      if (
        parseFloat(this.inputValue) > parseFloat(this.feeWaiverItem.LateFee)
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
        AfterOverdueFee: this.lateFeeValue,
        model: "现金收费"
      }).then(res => {
        this.resFunc();
      });
    },
    resFunc() {
      this.$message({
        message: "减免成功",
        type: "success",
        duration: 4000
      });
      this.inputValue = "";
      this.dialogFormVisible = false;
      this.$emit("getList");
    },
    // 输入金额保留2位
    money(e, n) {
      this.inputValue = updateMoney(e.target.value);
    },
    // 补齐小数
    changeTwoDecimal_x(e, n) {
      this.inputValue = changeTwoDecimal(e.target.value);
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
  padding-top: 20px;
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
  background: #fff;
  padding: 30px 20px 20px 20px;
}
</style>

