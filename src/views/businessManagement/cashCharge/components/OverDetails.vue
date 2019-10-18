<template>
  <!-- 水费详情弹窗 -->
  <el-dialog
    title="费用详情"
    :visible.sync="dialogFormVisible"
    top="20vh"
    width="792px"
    center
    custom-class="dialog-background"
    :close-on-click-modal="false"
  >
    <!-- 其它费用 -->
    <div class="details-box-item display-flex align-items-center justify-content-flex-justify">
      <div class="details-left">
        <div>2019-09</div>
        <div>其它费用</div>
      </div>
      <div class="ladder-box display-flex flex-1">      
        <div class="display-flex align-items-center ladder-item">
          <span>制卡费：</span>
          <span class="color-more-pink">10.00</span>元
        </div>
        <div class="reduction-box">
          <span>临时减免：</span>
          <input type="text" />
          <button>确定</button>
        </div>
      </div>
    </div>
    
    <div class="totle-box">
      <span class="color-more-black">合计应收：</span>
      <span class="font-weight main-color-red totle-num">60.00元</span>
      <span>(制卡费)</span>    
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    overDetailsShow: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    overDetailsShow() {
      this.dialogFormVisible = this.overDetailsShow;
    },
    dialogFormVisible(val, oldVal) {
      if (val === oldVal) {
        return;
      }
      this.$emit("update:overDetailsShow", val);
    }
  },
  data() {
    return {
      radio: 1,
      dialogFormVisible: false
    };
  },
  methods: {
    getList() {}
  }
};
</script>
<style lang="scss" scoped>
/deep/ .dialog-background .el-dialog__body {
  background: #f5f5f5;
  padding: 25px 20px 0 20px;
}
.ladder-left {
  padding-right: 60px;
}
.details-box-item {
  background: #fff;
  padding: 20px 0;
  border-bottom: 10px solid #f5f5f5;
}
.ladder-item {
  line-height: 28px;
}
.details-left {
  font-weight: bold;
  width: 120px;
  text-align: center;
  line-height: 24px;
  color: #46494c;
  font-size: 16px;
}
.ladder-box {
  padding: 0 30px;
  border-left: 1px solid #d9d9d9;
  border-right: 1px solid #d9d9d9;
}
.color-more-black {
  color: #46494c;
  font-weight: bold;
}
.reduction-box {
    margin-left: 80px;
  input {
    outline: none;
    height: 28px;
    border:1px solid #D8E2E7;
  }
  button {
    outline: none;
    background: #fff;
    border: 1px solid #b8c2cc;
    height: 28px;
    line-height: 24px;
    padding: 0 8px;
    border-radius: 4px;
    margin-left: 5px;
    color: #8a9299;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
}
.totle-box{
    padding:5px 0 20px 0;
}
.totle-num{
    font-size: 18px;
}
</style>

