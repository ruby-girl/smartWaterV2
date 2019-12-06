<template>
  <div class="clMeterBox">
    <el-tabs v-model="typeCheck" @tab-click="handleClick">
      <el-tab-pane label="按抄表计划搜索" name="1">
        <plan ref="planChild1"></plan>
      </el-tab-pane>
      <el-tab-pane label="按抄表日期搜索" name="2">
        <plan ref="planChild2"></plan>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import "@/styles/organization.scss";
  import plan from "./components/plan"

  export default {
    name: "meterQuery",
    components: { plan },
    data() {
      return {
        typeCheck:'1',
      };
    },
    activated: function() {
      let id = this.$route.query.id;
      if(id){
        this.$refs.planChild1.param.SA_MeterReadPlan_Id = id;
        this.$refs.planChild1.searchFun();
      }
    },
    methods: {
      handleClick(){
        this.typeCheck==1 ? this.$refs.planChild1.$refs.childSelect.setparams(parseInt(this.typeCheck)) : this.$refs.planChild2.$refs.childSelect.setparams(parseInt(this.typeCheck))
      },
    },
    mounted() {
      let _this = this;
      let id = _this.$route.query.id;
      if(id){
        _this.param.SA_MeterReadPlan_Id = id;
        _this.$refs.planChild1.searchFun();
      }
      let num  = document.getElementsByClassName("clMeterBox")[0].offsetHeight -
        document.getElementById("table").offsetTop - 90;
      _this.$refs.planChild1.tableHeight =num
      _this.$refs.planChild2.tableHeight =num
    }
  };
</script>
<style lang="scss">
  .clMeterBox{
    width: 100%;position: relative;
  .cl-operation1{margin: 35px 0 6px 0;}
    height: 100%;
    .el-tabs{background: #eff1f4}
    .el-tabs__header{margin: 0 !important;}
    padding: 2px 11px 0 11px;
    >div{background: #fff;}
    .cl-container{height: calc(100% - 40px);background: #fff;}
    .cl-container > div:first-child{height: auto;padding: 0;width: 100%;position: relative}
  }
</style>
