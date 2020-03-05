<template>
  <div class="clMeterBox">
    <el-tabs v-model="typeCheck" @tab-click="handleClick">
      <el-tab-pane label="有阶梯用水性质" name="1">
        <HaveLadder ref="HaveLadderChild"></HaveLadder>
      </el-tab-pane>
      <el-tab-pane label="无阶梯用水性质" name="2">
        <NoneLadder ref="NoneLadderChild"></NoneLadder>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import "@/styles/organization.scss";
  import HaveLadder from "./components/HaveLadder"
  import NoneLadder from "./components/NoneLadder"

  export default {
    name: "waterStatistics",
    components: { HaveLadder, NoneLadder },
    data() {
      return {
        typeCheck:'1',
        param:{}
      }
    },
    methods: {
      handleClick(){

      },
    },
    mounted() {

    }
  };
</script>
<style lang="scss">
  .clMeterBox{
    .el-tab-pane{height: 100%;position: relative}
    width: 100%;position: relative;
  .cl-operation1{margin: 35px 0 6px 0;}
    height: 100%;
    .el-tabs{background: #eff1f4;height: 100%;}
    .el-tabs__header{margin: 0 !important;}
    .el-tabs__content{height: calc(100% - 40px);background: #fff;padding-bottom: 20px;}
    padding: 2px 16px 0 16px;
    >div{background: #fff;}
    .cl-container{padding-top: 16px;}
    .cl-container > div:first-child{height: auto;padding: 0;width: 100%;position: relative}
    .secondClass{margin-left: 40px;}
  }
</style>
