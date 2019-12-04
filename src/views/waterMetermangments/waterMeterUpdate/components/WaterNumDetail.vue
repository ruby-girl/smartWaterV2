<template>
  <el-dialog
    class="cl_water_quantity"
    :close-on-click-modal="false"
    top="30vh"
    title="水量详情"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    width="425px"
  >
    <ul class="clearfix">
      <li class="water_detail">
        <i>1</i>
        <p >
          <span class="startNum">1阶起始量：<label>{{WaterYield1}} 吨</label></span>
          <span class="userNUm">1阶起始量：<label>{{WaterYield1}} 吨</label></span>
        </p>
        <!-- <span>1阶起始量：</span>
        <label>{{WaterYield1}} 吨</label>
        <span class="userNum">
          <span>1阶用水量：</span>
          <label>{{WaterYield1}} 吨</label>
        </span> -->
      </li>
      <li class="water_detail">
        <i>2</i>
        <span>2阶用水量：</span>
        <label>{{WaterYield2}} 吨</label>
      </li>
      <li class="water_detail">
        <i>3</i>
        <span>3阶用水量：</span>
        <label>{{WaterYield3}} 吨</label>
      </li>
      <li class="water_detail">
        <i>4</i>
        <span>4阶用水量：</span>
        <label>{{WaterYield4}} 吨</label>
      </li>
      <li class="water_detail">
        <i>5</i>
        <span>4阶用水量：</span>
        <label>{{WaterYield5}} 吨</label>
      </li>
    </ul>
    <div class="thisNum">本次用水量：{{totalWaterYield}}吨</div>
  </el-dialog>
</template>

<script>
export default {
  name: "WaterNumDetail",
  data() {
    return {
      dialogVisible: false,
      WaterYield1: 0,
      WaterYield2: 0,
      WaterYield3: 0,
      WaterYield4: 0,
      WaterYield5: 0
    };
  },
  computed: {
    //计算总用水量情况
    totalWaterYield: function() {
      return (
        this.WaterYield1 +
        this.WaterYield2 +
        this.WaterYield3 +
        this.WaterYield4 +
        this.WaterYield5
      );
    }
  },
  methods: {
    handleClose() {
      //水量详情关闭
      this.dialogVisible = false;
      this.WaterYield1 = 0; //初始化数据，避免下次进入无数据显示异常情况
      this.WaterYield2 = 0;
      this.WaterYield3 = 0;
      this.WaterYield4 = 0;
      this.WaterYield5 = 0;
    },
    getInfo(data) {
      //获取五阶梯用水量情况
      this.WaterYield1 = data.WaterYield1;
      this.WaterYield2 = data.WaterYield2;
      this.WaterYield3 = data.WaterYield3;
      this.WaterYield4 = data.WaterYield4;
      this.WaterYield5 = data.WaterYield5;
    }
  }
};
</script>
<style lang="scss">
.cl_water_quantity {
  ul {
    padding: 0 8px;
    position: relative;
    margin: 10px 0 0 0;
  }
  .water_detail {
    list-style-type: none;

    font: normal 14px "Microsoft YaHei";
    // width: 50%;
    margin-bottom: 30px;
    // text-align: center;
    // padding: 0 30px;
    .userNum {
      display: inline-block;
    }
    i {
      display: inline-block;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #00b2a1;
      color: #ffffff;
      font: bold 12px/16px "Script MT";
      text-align: center;
      vertical-align: middle;
      margin: -4px 5px 0 0;
    }
    span {
      color: #777c82;
    }
    label {
      color: #636669;
    }
    p{
      display: inline-block;
      margin: 0;
      padding: 0;
    }
    .userNUm{
      padding-left: 98px;
    }
  }
  // li:nth-child(2n){text-align: right}
  // li:nth-child(2n+1){text-align: left}
 .thisNum{
    width: 100%;
    height: 55px;
    font: normal 16px/55px "Microsoft YaHei";
    color: #46494c;
    text-align: center;
    background: #f5f5f5;
    margin: 0;
  }
}
</style>
