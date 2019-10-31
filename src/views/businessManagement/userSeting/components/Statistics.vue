<template>
  <ul class="statistics clearfix">
    <li :class="curNum==-1 ? 'total':''" @click="tabChange(-1)"><span>
      {{(parseInt(StatisticsData.IC_WaterNum) + parseInt(StatisticsData.JX_WaterNum) + parseInt(StatisticsData.YC_WaterNum) + parseInt(StatisticsData.NB_WaterNum)) || 0}}
    </span><label>全部</label></li>
    <li :class="curNum==1101 ? 'total':''" @click="tabChange(1101)"><span>{{ StatisticsData.JX_WaterNum || 0 }}</span><label>机械水表</label></li>
    <li :class="curNum==1102 ? 'total':''" @click="tabChange(1102)"><span>{{ StatisticsData.IC_WaterNum || 0 }}</span><label>IC卡水表</label></li>
    <li :class="curNum==1103 ? 'total':''" @click="tabChange(1103)"><span>{{ StatisticsData.YC_WaterNum || 0 }}</span><label>远传水表</label></li>
    <li :class="curNum==1104 ? 'total':''" @click="tabChange(1104)"><span>{{ StatisticsData.NB_WaterNum || 0 }}</span><label>物联网水表</label></li>
  </ul>
</template>

<script>
  import { promptInfoFun } from "@/utils/index"

  export default {
    name: "Statistics",
    data() {
      return {
        curNum:-1
      }
    },
    props:['StatisticsData'],
    methods: {
      /**
      * 根据选项卡切换列表内容
      * */
      tabChange(num) {//点击选项卡切换列表内容
        this.curNum = num
        this.$parent.searchFun(num)
      }
    }
  }
</script>
<style lang="scss">
  .statistics {
    width: 100%;
    border-top: solid 1px #e6ebf5;border-left: solid 1px #e6ebf5;border-right: solid 1px #e6ebf5;margin-bottom: 0;padding:10px 0 5px 0;
    .total {
      color: #33B300;

      label {
        border: solid 1px #33B300;
      }

      span {
        color: #33B300;
      }
    }

    li {
      list-style-type: none;
      float: left;
      width: 20%;
      text-align: center;
      font-size: 14px;
      color: #46494C;
      line-height: 35px;
      margin-bottom: 7px;

      span {
        font: bold 16px 'Microsoft YaHei';
        color: #FF2907;
        display: block
      }

      label {
        border: solid 1px #D8E2E7;
        width: 90px;
        height: 32px;
        text-align: center;
        line-height: 32px;
        display: inline-block;
        margin-top: 5px;
        cursor: pointer
      }
    }
  }
</style>
