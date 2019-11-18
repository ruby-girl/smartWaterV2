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
        <el-row>
          <el-form-item label="违约金：">
            <el-input v-model="orderMoney" disabled />
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
            />
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" type="primary" @click="feeWaiver">确认</el-button>
      <el-button size="mini" @click="dialogFormVisible = false">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { updateMoney, changeTwoDecimal } from "@/utils/index.js";
 import {OrderFeeWaiver} from "@/api/cashCharge";
export default {
  props: {
    //   减免Id
    orderId: {
      type: String
    },
    // 减免前金额
    orderMoney:{
      type: Number
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
      radio: 1,
      dialogFormVisible: false,
      inputValue:''
    };
  },
  methods: {
    //   减免请求
    feeWaiver() {
      OrderFeeWaiver({SA_Order_Id:this.orderId,AfterFee:this.inputValue}).then(res=>{
         this.$message({
            message: '减免成功',
            type: "success",
            duration: 4000
          });
          this.dialogFormVisible=false
          this.$emit("getList");
      })
    },
    // 输入金额保留2位
    money(e) {
      e.target.value = updateMoney(e.target.value);
    },
    // 补齐小数
    changeTwoDecimal_x(e, n) {
      e.target.value = changeTwoDecimal(e.target.value);
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/ .dialog-background .el-dialog__body {
  background: #f5f5f5;
  padding: 25px 20px 0 20px;
}
/deep/ .el-dialog__footer {
  background: #f5f5f5 !important;
  .dialog-footer {
    background: #f5f5f5 !important;
  }
}
.feewaiver-box {
  background: #fff;
  padding: 25px 20px;
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
</style>

