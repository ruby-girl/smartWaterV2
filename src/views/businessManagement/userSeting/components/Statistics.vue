<template>
  <ul class="statistics">
    <li :class="curNum==1 ? 'total':''" @click="tabChange(1)"><span>100</span><label>全部</label></li>
    <li :class="curNum==2 ? 'total':''" @click="tabChange(2)"><span>100</span><label>机械水表</label></li>
    <li :class="curNum==3 ? 'total':''" @click="tabChange(3)"><span>100</span><label>IC卡水表</label></li>
    <li :class="curNum==4 ? 'total':''" @click="tabChange(4)"><span>100</span><label>远传水表</label></li>
    <li :class="curNum==5 ? 'total':''" @click="tabChange(5)"><span>100</span><label>物联网水表</label></li>
  </ul>
</template>

<script>
  export default {
    name: "Statistics",
    data() {
      return {
        curNum:1
      }
    },
    methods: {
      tabChange(num) {//点击选项卡切换列表内容
        this.curNum = num
        this.$parent.searchFun()
      }
    }
  }
</script>
<style lang="scss">
  .statistics {
    width: 100%;

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
