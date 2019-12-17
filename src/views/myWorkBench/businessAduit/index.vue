<template>
  <div class="section-container secur-setting">
    <component :is="currentView"></component>
    <el-tabs v-model="typeCheck" @>
      <el-tab-pane label="我提交的" name="1">
        <sub-mitted/>
      </el-tab-pane>
      <el-tab-pane label="待我审核" name="2">
        <div>2</div>
      </el-tab-pane>
      <el-tab-pane label="我已审核" name="3">
        <div>2</div>
      </el-tab-pane>
      <el-tab-pane label="审核查询" name="4">
        <div>2</div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import meterAccount from './components/detailPage/WatreMeterAccount'
  import EditAccount from './components/detailPage/EditAccount'
  import LowInsureApply from './components/detailPage/LowInsureApply'
  import Transfer from './components/detailPage/Transfer'
  import SalesAccount from './components/detailPage/SalesAccount'
  import ChangeNature from './components/detailPage/ChangeNature'
  import AddNature from './components/detailPage/AddNature'
  import BreachContract from './components/detailPage/BreachContract'
  import SubMitted from "./components/SubMitted"

  export default {
    name: "businessAduit",
    components: { SubMitted, meterAccount, EditAccount, LowInsureApply, Transfer, SalesAccount, ChangeNature, AddNature, BreachContract},
    data() {
      return {
        typeCheck: "1",
        index: 7,
        componentsArr:['EditAccount','meterAccount','LowInsureApply', 'Transfer', 'SalesAccount','ChangeNature','AddNature','BreachContract']
      };
    },
    computed:{
      currentView(){
        return this.componentsArr[this.index];
      }
    },
  };
</script>
