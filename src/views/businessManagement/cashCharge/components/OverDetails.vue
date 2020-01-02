<template>
  <!-- 其它费用详情弹窗 -->
  <el-dialog
    title="费用详情"
    :visible.sync="dialogFormVisible"
    top="20vh"
    width="792px"
    center
    custom-class="dialog-background"
    :close-on-click-modal="false"
    @open="getDetail"
  >
    <!-- 其它费用 -->
    <div class="details-box-item display-flex align-items-center justify-content-flex-justify">
      <div class="details-left">
        <div>{{detail.YearMonth}}</div>
        <div>其它费用</div>
      </div>
      <div class="ladder-box display-flex flex-1">      
        <div class="display-flex align-items-center ladder-item">
          <span>{{temp.OrderType}}：</span>
          <span class="main-color-red font-weight pr-15 pl-15">{{detail.Money}}</span>元
        </div>
      </div>
    </div>
    
    <div class="totle-box">
      <span class="color-more-black">合计应收：</span>
      <span class="font-weight main-color-red totle-num">{{detail.Money}}元</span>
      <span>({{temp.OrderType}})</span>    
    </div>
  </el-dialog>
</template>
<script>
import { SelectFeeDetail } from "@/api/cashCharge";
export default {
  props: {
    overDetailsShow: {
      type: Boolean,
      default: false
    },
    temp:{
       type: Object
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
      dialogFormVisible: false,
      detail: {
        olf: {},
        orr: {
          total: 0
        }
      }
    };
  },
  methods: {
     getDetail() {
      SelectFeeDetail({ billId: this.temp.Id }).then(res => {
        this.detail = res.data   
      });
    }
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
  padding: 28px 0;
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
  padding: 0 54px;
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
    padding:25px 0 40px 0;
}
.totle-num{
    font-size: 18px;
}
</style>

