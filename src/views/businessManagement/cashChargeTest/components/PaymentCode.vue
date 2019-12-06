<template>
  <!-- 扫支付码 -->
  <el-dialog
    title="扫码支付"
    :visible.sync="dialogFormVisible"
    top="20vh"
    width="540px"
    center
    custom-class="dialog-background"
    :close-on-click-modal="false"
  >
    <div class="payment-title">请扫入微信支付码</div>
    <el-input v-model="num"></el-input>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" type="primary" @click="handleFilter">确认</el-button>
      <el-button size="mini" @click="dialogFormVisible = false">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { updateMoney, changeTwoDecimal } from "@/utils/index.js";
export default {
  props: {
    //   减免类型
    feeType: {
      type: Number,
      default: 1
    },
    paymentCodeShow: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    paymentCodeShow() {
      this.dialogFormVisible = this.paymentCodeShow;
    },
    dialogFormVisible(val, oldVal) {
      if (val === oldVal) {
        return;
      }
      this.$emit("update:paymentCodeShow", val);
    }
  },
  data() {
    return {
      radio: 1,
      dialogFormVisible: false,
      num: "123123123"
    };
  },
  methods: {
    handleFilter() {}
  }
};
</script>
<style lang="scss" scoped>
/deep/ .dialog-background .el-dialog__body {
  padding: 40px 40px 30px 40px;
}
.payment-title{
    line-height: 40px;
}
</style>

