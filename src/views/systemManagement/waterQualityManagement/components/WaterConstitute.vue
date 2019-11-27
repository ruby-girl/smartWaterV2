<template>
  <!-- 新增弹窗 -->
  <el-dialog
    :title="type==1?'水价构成':'调整前水价信息'"
    :visible.sync="AdialogFormVisible"
    top="20vh"
    width="710px"
    center
    :close-on-click-modal="false"
  >
    <div class="ladder-box display-flex justify-content-flex-justify align-items-center">
      <div>
        污水费：
        <span class="color-more-black">{{details.SewagePrice}}元/吨</span>
      </div>
      <div>
        其他费用1：
        <span class="color-more-black">{{details.OtherPrice1}}元/吨</span>
      </div>
      <div>
        其他费用2：
        <span class="color-more-black">{{details.OtherPrice2}}元/吨</span>
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
    <div class="display-flex justify-content-flex-end align-items-center" v-if="!details.IsLadder">
      <div>
        单价：
        <span class="color-more-black">{{details.NotLadderPrice}}元/吨</span>
      </div>
      <div style="margin-left:60px;">
        合计单价：
        <span class="color-more-black">{{details.TotalPrice}}元/吨</span>
      </div>
    </div>
    <!-- 如果为撤销水价弹窗，显示footer -->
    <div slot="footer" class="dialog-footer" v-if="type==2">
      <el-button size="mini" type="primary" @click="reset()">确认撤销</el-button>
      <el-button size="mini" @click="AdialogFormVisible = false">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { SelectUpdateWaterPropertyBeforeInfo,SelectWaterPropertyInfoById } from "@/api/system";
import { ladderChangeArr } from "@/utils/index";
export default {
  props: {
    id: {
      type: String
    },
    constituteShow: {
      type: Boolean,
      default: false
    },
    type: {
      type: Number,
      default: 0
    }
  },
  watch: {
    constituteShow() {
      this.AdialogFormVisible = this.constituteShow;
      if (!this.constituteShow) return false; //如果监听ID，编辑行数据后，ID依然不会变，所以在弹窗显示再请求数据
      if(this.type!==1){
         SelectUpdateWaterPropertyBeforeInfo({ id: this.id }).then(res => {
        this.details = ladderChangeArr(res.data); //阶梯转换数组
      });
      }else{
         SelectWaterPropertyInfoById({ waterPropertyId: this.id }).then(res => {
        this.details = ladderChangeArr(res.data); //阶梯转换数组
      });
      } 
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
  methods: {
    reset() {
      this.$emit("reset", this.id);
    }
  }
};
</script>
<style lang="scss" scoped>
.ladder-form-padding {
  padding: 40px 20px;
}
.ladder-box {
  padding: 15px 20px;
  background: #f5f5f5;
  margin: 10px 0 20px 0;
}
.ladder-bottom-box {
  padding: 5px 20px;
  .ladder-item {
    height: 30px;
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

