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
    @open="getDetail"
  >
    <!-- 这里需要显示的费用类型有：“未缴费 审核中 已撤销”  1003审核中1004已撤销-->
    <div
      class="charges-state"
      v-if="temp.ChargeFlag==1003||temp.ChargeFlag==1004"
    >{{temp.ChargeFlag==1003?'审核中':temp.ChargeFlag==1004?'已撤销':''}}</div>
    <div class="details-box-item display-flex align-items-center justify-content-flex-justify">
      <div class="details-left">
        <div>2019-09</div>
        <div>水费详情</div>
      </div>
      <div class="details-left-box">
        <div class="display-flex align-items-center">
          <span>水费：</span>
          <span class="font-weight main-color-red">{{detail.TotalWaterPrice}}元</span>
        </div>
      </div>
      <div class="ladder-box flex-1">
        <!-- 循环阶梯 -->
        <div class="display-flex align-items-center ladder-item" v-for="(item,i) in detail.ladder">
          <div class="display-flex ladder-left">
            <div class="circle-num">{{i+1}}</div>
            <span>{{i+1}}阶用水量：{{item.LadderWaterNum}}吨</span>
          </div>
          <div>
            {{i+1}}阶水费：
            <span class="color-more-black">{{item.TotalPrice}}</span>元
          </div>
        </div>
      </div>
      <!-- 循环阶梯e -->
    </div>
    <!-- 附加费用 -->
    <div class="details-box-item display-flex align-items-center justify-content-flex-justify">
      <div class="details-left">
        <div>附加费用</div>
      </div>
      <div
        class="details-left-box padding-tb-10"
        :style="{'borderRight':detail.olf.LeteFee>0?'1px solid #d9d9d9':'none'}"
      >
        <div class="display-flex align-items-center">
          <span>违约金：</span>
          <span class="font-weight main-color-red">{{detail.olf.LeteFee}}元</span>
        </div>
      </div>
      <div class="ladder-box flex-1">
        <div class="display-flex align-items-center ladder-item" v-if="detail.olf.LeteFee>0">
          <div>
            欠费金额&nbsp;*&nbsp;逾期
            <span class="color-more-black">{{detail.olf.LeteFee}}</span>
            天&nbsp;*&nbsp;{{detail.olf.InterestRate}}‰&nbsp;=&nbsp;违约金
          </div>
        </div>
      </div>
    </div>
    <!-- 扣减项 -->
    <div class="details-box-item display-flex align-items-center justify-content-flex-justify">
      <div class="details-left">
        <div>扣减项</div>
      </div>
      <div class="ladder-box flex-1 border-left">
        <div class="ladder-item">
          账户扣减：
          <span class="font-weight main-color">{{detail.orr.PricePaid}}</span>元
        </div>
        <div class="ladder-item">
          违约金减免：
          <span class="font-weight main-color">{{detail.orr.LeteFeeFree}}</span>元
        </div>
        <div class="ladder-item">
          水费减免：
          <span v-if="detail.orr.WaterAllowanceMoeny&&detail.orr.FreePrice">
            <span class="font-weight main-color">{{detail.orr.WaterAllowanceMoeny}}</span>
            <span>（固定减免)+</span>
            <span class="font-weight main-color">{{detail.orr.FreePrice}}</span>
            <span>(协议减免)=</span>
          </span>
          <span class="font-weight main-color">{{detail.orr.waterTotal}}</span>元
          <!-- <span class="font-weight main-color">0</span> -->
        </div>
      </div>
    </div>
    <div class="totle-box">
      <span class="color-more-black">合计应收：</span>
      <span class="font-weight main-color-red">{{detail.TotalWaterPrice}}元</span>
      <span>(水费)</span>
      <span class="color-more-black">+</span>
      <span class="font-weight main-color-red">{{detail.olf.LeteFee}}元</span>
      <span>(附加费用)</span>
      <span class="color-more-black">-</span>
      <span class="font-weight main-color">{{detail.orr.total}}</span>
      <span>(扣减项)</span>
      <span>=</span>
      <span class="font-weight main-color-red totle-num">{{resultNum}}元</span>
    </div>
  </el-dialog>
</template>
<script>
import { SelectFeeDetail } from "@/api/cashCharge";
import { ladderChangeArrs } from "@/utils/index";
export default {
  props: {
    chargesDetailsShow: {
      type: Boolean,
      default: false
    },
    temp: {
      type: Object
    }
  },
  watch: {
    chargesDetailsShow() {
      this.dialogFormVisible = this.chargesDetailsShow;
    },
    dialogFormVisible(val, oldVal) {
      if (val === oldVal) {
        return;
      }
      this.$emit("update:chargesDetailsShow", val);
    }
  },
  data() {
    return {
      radio: 1,
      dialogFormVisible: false,
      chargesState: 1001, //已缴费
      detail: {
        olf: {},
        orr: {
          total: 0
        }
      },
      resultNum: 0
    };
  },
  created() {
    //  this. getDetail()
  },
  methods: {
    getDetail() {
      SelectFeeDetail({ billId: this.temp.Id }).then(res => {
        let detail = ladderChangeArrs(res.data.mrod); //阶梯转换数组
        this.detail = { ...detail, ...res.data };
        this.detail.orr.waterTotal =
          (parseFloat(this.detail.orr.WaterAllowanceMoeny) * 1000 +
            parseFloat(this.detail.orr.FreePrice) * 1000) /
          1000; //所有的水费减免
        this.detail.orr.total =
          (parseFloat(this.detail.orr.PricePaid) * 1000 +
            parseFloat(this.detail.orr.LeteFeeFree) * 1000 +
            parseFloat(this.detail.orr.waterTotal) * 1000) /
          1000; //所有的减免
        //  计算应收
        this.resultNum =
          (parseFloat(this.detail.TotalWaterPrice) * 1000 +
            parseFloat(this.detail.olf.LeteFee) * 1000 -
            parseFloat(this.detail.orr.total) * 1000) /
          1000;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/ .dialog-background .el-dialog__body {
  background: #f5f5f5;
  padding: 15px 20px 0 20px;
}
.ladder-left {
  padding-right: 60px;
}
.details-box-item {
  background: #fff;
  padding: 20px 0;
  border-bottom: 15px solid #f5f5f5;
}
.ladder-item {
  line-height: 28px;
}
.circle-num {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid #46494c;
  font-family: "Script MT", "Arial Narrow", Arial, sans-serif;
  text-align: center;
  margin-right: 8px;
  line-height: 16px;
  margin-top: 6px;
}
.details-left {
  font-weight: bold;
  width: 120px;
  text-align: center;
  line-height: 24px;
  color: #46494c;
  font-size: 16px;
}
.details-left-box {
  width: 230px;
  padding: 40px 20px 40px 30px;
  border-left: 1px solid #d9d9d9;
  border-right: 1px solid #d9d9d9;
}
.border-left {
  border-left: 1px solid #d9d9d9;
}
.ladder-box {
  padding: 0 30px;
}
.color-more-black {
  color: #46494c;
  font-weight: bold;
}
.totle-box {
  padding: 5px 0 20px 0;
}
.totle-num {
  font-size: 25px;
}
.padding-tb-10 {
  padding-top: 8px;
  padding-bottom: 8px;
}
.charges-state {
  font-size: 16px;
  padding-bottom: 15px;
}
</style>

