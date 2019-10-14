<template>
  <!-- 新增弹窗 -->
  <el-dialog
    title="添加"
    :visible.sync="AdialogFormVisible"
    top="20vh"
    width="710px"
    center
    custom-class="nopadding"
    :close-on-click-modal="false"
  >
    <div class="ladder-box display-flex justify-content-flex-justify align-items-center">
      <div>
        污水费：
        <span class="color-more-black">20元/吨</span>
      </div>
      <div>
        其他费用1：
        <span class="color-more-black">20元/吨</span>
      </div>
      <div>
        其他费用2：
        <span class="color-more-black">20元/吨</span>
      </div>
    </div>
    <div v-if="details.IsLadder">
      <div v-for="(item,i) in details.ladder" class="ladder-bottom-box">
      <div class="display-flex justify-content-flex-justify" v-if="details.LadderNumber>i">
        <div class="display-flex align-items-center ladder-item">
          <div class="circle-num">{{i+1}}</div>
          <span>{{i+1}}阶单价：</span>
          <div class="table-input-y">
            <span>{{item.LadderPrice}}元/吨</span>
          </div>
        </div>
        <div class="display-flex align-items-center ladder-item">
          <span>{{i+1}}阶起始量：</span>
          <div class="table-input-y">
            <span>{{item.LadderWaterNum}}吨</span>
          </div>
        </div>
        <div class="display-flex align-items-center ladder-item color-more-black">
          <span>{{i+1}}阶合计单价：</span>
          <div class="table-input-y">
            <span>{{item.TotalPrice}}元/吨</span>
          </div>
        </div>
      </div>
    </div>
    </div>
  </el-dialog>
</template>
<script>
import { SelectUpdateWaterPropertyBeforeInfo } from "@/api/system";
import {ladderChangeArr} from "@/utils/index"
export default {
  props: {
    id: {
      type: String
    },
    constituteShow: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    constituteShow() {
      this.AdialogFormVisible = this.constituteShow;
      if (!this.constituteShow) return false;//如果监听ID，编辑行数据后，ID依然不会变，所以在弹窗显示再请求数据
      SelectUpdateWaterPropertyBeforeInfo({ id: this.id }).then(res => {
       this.details=ladderChangeArr(res.data)//阶梯转换数组
      });
    },
    AdialogFormVisible(val, oldVal) {
      if (val === oldVal) {
        return;
      }
      this.$emit("update:constituteShow", val);
    }
  },
  mounted() {},
  data() {
    return {
      AdialogFormVisible: false,
      details: {}
    };
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
.ladder-form-padding {
  padding: 40px 20px;
}
.ladder-box {
  padding: 15px 20px;
  background: #f5f5f5;
  margin: 40px 20px 30px 20px;
}
.ladder-bottom-box {
  padding: 5px 20px;
  .ladder-item{
    height:30px;
  }
}
.circle-num {
  background: #00b2a1;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  font-family: "Script MT", "Arial Narrow", Arial, sans-serif;
  text-align: center;
  color: #fff;
  margin-right: 10px;
}
.color-more-black {
  color: #46494c;
}
</style>

