<template>
  <el-dialog
    class="cl_water_quantity"
    :close-on-click-modal="false"
    top="20vh"
    title="水量详情"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    width="500px"
  >
    <ul class="clearfix">
      <li class="water_detail">
        <i>1</i>
        <p>
          <span class="startNum">
            1阶起始量：
            <label>{{waterDetaileList.OneLadderWaterNum }} 吨</label>
          </span>
          <span class="userNUm">
            1阶用水量：
            <label>{{waterDetaileList.OneTotalNum }} 吨</label>
          </span>
        </p>
        <!-- <span>1阶起始量：</span>
        <label>{{WaterYield1}} 吨</label>
        <span class="userNum">
          <span>1阶用水量：</span>
          <label>{{WaterYield1}} 吨</label>
        </span>-->
      </li>
      <li class="water_detail">
        <i>2</i>
        <p>
          <span class="startNum">
            2阶起始量：
            <label>{{waterDetaileList.TwoLadderWaterNum }} 吨</label>
          </span>
          <span class="userNUm">
            2阶用水量：
            <label>{{waterDetaileList.TwoTotalNum }} 吨</label>
          </span>
        </p>
      </li>
      <li class="water_detail">
        <i>3</i>
        <p>
          <span class="startNum">
            3阶起始量：
            <label>{{waterDetaileList.ThreeLadderWaterNum }} 吨</label>
          </span>
          <span class="userNUm">
            3阶用水量：
            <label>{{waterDetaileList.ThreeTotalNum }} 吨</label>
          </span>
        </p>
      </li>
      <li class="water_detail">
        <i>4</i>
        <p>
          <span class="startNum">
            4阶起始量：
            <label>{{waterDetaileList.FourLadderWaterNum }} 吨</label>
          </span>
          <span class="userNUm">
            4阶用水量：
            <label>{{waterDetaileList.FourTotalNum }} 吨</label>
          </span>
        </p>
      </li>
      <li class="water_detail">
        <i>5</i>
        <p>
          <span class="startNum">
            5阶起始量：
            <label>{{waterDetaileList.FiveLadderWaterNum }} 吨</label>
          </span>
          <span class="userNUm">
            5阶用水量：
            <label>{{waterDetaileList.FiveTotalNum }} 吨</label>
          </span>
        </p>
      </li>
    </ul>
    <div class="thisNum">本次用水量：{{waterDetaileList.TotalYield }}吨</div>
  </el-dialog>
</template>

<script>
export default {
  name: "WaterNumDetail",
  watch: {
    dialogVisible() {
      this.waterDetaileList=this.$parent.waterDetaileList
    }
  },
  data() {
    return {
      dialogVisible: false,
      waterDetaileList: {}
    };
  },
  methods: {
    handleClose() {
      //水量详情关闭
      this.dialogVisible = false;
      this.waterDetaileList = {};
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
    p {
      display: inline-block;
      margin: 0;
      padding: 0;
    }
    .userNUm {
      padding-left: 100px;
    }
    .startNum{
      display: inline-block;
      // width: 300px;
    }
  }
  // li:nth-child(2n){text-align: right}
  // li:nth-child(2n+1){text-align: left}
  .thisNum {
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
