<template>
  <!-- 卡片-->
  <div>
    <div class="main-padding-20-y">
      <div class="ic-top-box display-flex align-items-center justify-content-flex-justify">
        <div>卡号：10123123</div>
        <div class="color-yellow">用户未刷卡</div>
      </div>
      <div class="ic-box-border">
        <zebra-table
          label-left="水表口径"
          label-right="充值次数"
          value-left="12"
          value-right="10"
          :isGray="true"
        ></zebra-table>
        <zebra-table
          label-left="充值金额"
          label-right="量不足提示"
          value-left="201"
          value-right="10"
          :isGray="false"
          color="#FF5656"
          fontWeight="bold"
        ></zebra-table>
        <zebra-table label-left="月最低消费" label-right value-left="20" value-right :isGray="true"></zebra-table>
        <div  v-if="details.IsLadder" style="padding-top:10px;">
          <div v-for="(item,i) in details.ladder" class="ladder-bottom-box">
            <div class="display-flex" v-if="details.LadderNumber>i">
              <div class="display-flex align-items-center ladder-item">
                <div class="circle-num">{{i+1}}</div>
                <span>{{i+1}}阶单价：</span>
                <div class="table-input-y">
                  <span class="main-color-tiffany font-weight">{{item.LadderPrice}}</span>元/吨
                </div>
              </div>
              <div class="display-flex align-items-center ladder-item">
                <span>{{i+1}}阶起始量：</span>
                <div class="table-input-y">
                  <span>{{item.LadderWaterNum}}吨</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 循环end -->
    </div>
  </div>
</template>
<script>
import ZebraTable from "./ZebraTable";
export default {
  components: { ZebraTable },
  props: {},
  watch: {},
  data() {
    return {
        details:{
            IsLadder:true,
            LadderNumber:5,
            ladder:[
                {LadderPrice:1,LadderWaterNum:1,TotalPrice:1},
                {LadderPrice:1,LadderWaterNum:1,TotalPrice:1},
                {LadderPrice:1,LadderWaterNum:1,TotalPrice:1},
                {LadderPrice:1,LadderWaterNum:1,TotalPrice:1},
                {LadderPrice:1,LadderWaterNum:1,TotalPrice:1}
            ]
        }
    };
  },
  mounted() {},
  methods: {}
};
</script>
<style lang="scss" scoped>
.ic-box-border {
  border: 1px solid #dbe3e8;
  .ic-item:last-child {
    border: none;
  }
}
.ic-top-box {
  padding: 20px 0;
  color: #46494c;
}
.ladder-box {
  padding: 15px 20px;
  background: #f5f5f5;
  margin: 10px 0 20px 0;
}
.ladder-bottom-box {
  padding: 5px 20px;
  .ladder-item:first-child{
      padding-right: 100px;
  }
  .ladder-item {
    height: 30px;
    color:#777C82;
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
.color-yellow{
    color:#EF8205;
}
</style>

