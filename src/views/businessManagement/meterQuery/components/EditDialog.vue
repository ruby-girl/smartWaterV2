<template>
  <el-dialog
    class="cl_water_quantity"
    :close-on-click-modal="false"
    top="30vh"
    title="水量详情"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    width="425px">
     <ul class="clearfix">
       <li class="water_detail">
         <i>1</i>
         <span>1阶用水量：</span>
         <label>{{WaterYield1}} 吨</label>
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
         <span>5阶用水量：</span>
         <label>{{WaterYield5}} 吨</label>
       </li>
     </ul>
    <p>本次用水量：{{totalWaterYield}}吨</p>
  </el-dialog>
</template>

<script>
  export default {
    name: "EditDialog",
    data() {
      return {
        dialogVisible: false,
        WaterYield1:0,
        WaterYield2:0,
        WaterYield3:0,
        WaterYield4:0,
        WaterYield5:0,
      }
    },
    computed:{//计算总用水量情况
      totalWaterYield: function () {
        return this.WaterYield1 + this.WaterYield2 + this.WaterYield3 + this.WaterYield4 + this.WaterYield5
      }
    },
    methods: {
      handleClose(){//水量详情关闭
        this.dialogVisible = false
        this.WaterYield1 = 0//初始化数据，避免下次进入无数据显示异常情况
        this.WaterYield2 = 0
        this.WaterYield3 = 0
        this.WaterYield4 = 0
        this.WaterYield5 = 0
      },
      getInfo(data) {//获取五阶梯用水量情况
        this.WaterYield1 = data.WaterYield1
        this.WaterYield2 = data.WaterYield2
        this.WaterYield3 = data.WaterYield3
        this.WaterYield4 = data.WaterYield4
        this.WaterYield5 = data.WaterYield5
      }
    }
  }
</script>
<style lang="scss">
  .cl_water_quantity{
    ul{padding: 0 8px;position: relative;margin: 10px 0 0 0;}
     .water_detail {
       list-style-type: none;float: left;font: normal 14px 'Microsoft YaHei';width: 50%;margin-bottom: 30px;text-align: center;
       i{display: inline-block;width: 16px;height: 16px;border-radius: 50%;background: #00B2A1;color: #FFFFFF;font: bold 12px/16px 'Script MT';text-align: center;
         vertical-align: middle;margin: -4px 5px 0 0;}
       span{color: #777C82}
       label{color: #636669}
     }
    li:nth-child(2n){text-align: right}
    li:nth-child(2n+1){text-align: left}
    p{width: 100%;height: 55px;font: normal 16px/55px "Microsoft YaHei";color: #46494C;text-align: center;background: #F5F5F5;margin: 0;}
  }
</style>
