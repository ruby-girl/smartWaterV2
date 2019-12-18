<template>
  <div class="section-container secur-setting">
    <component :is="currentView"></component>
    <el-tabs v-model="typeCheck" @tab-click="changeTab">
      <el-tab-pane label="我提交的" name="1" >
        <sub-mitted v-if="mit"/>
      </el-tab-pane>
      <el-tab-pane label="待我审核" name="2" >
        <stay-aduite v-if="aduite"/>
      </el-tab-pane>
      <el-tab-pane label="我已审核" name="3" >
        <div v-if="finish">2</div>
      </el-tab-pane>
      <el-tab-pane label="审核查询" name="4" >
        <div v-if="search">2</div>
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
  import StayAduite from "./components/StayAduite"

  export default {
    name: "businessAduit",
    components: {
      SubMitted,
      StayAduite,
      meterAccount,
      EditAccount,
      LowInsureApply,
      Transfer,
      SalesAccount,
      ChangeNature,
      AddNature,
      BreachContract,
    },
    data() {
      return {
        typeCheck: "1",
        index: 0,
        componentsArr: ['EditAccount', 'meterAccount', 'LowInsureApply', 'Transfer', 'SalesAccount', 'ChangeNature', 'AddNature', 'BreachContract'],
        mit: true,
        aduite: false,
        finish: false,
        search: false
      };
    },
    computed: {
      currentView() {
        return this.componentsArr[this.index];
      }
    },
    methods: {
      //切换tab
      changeTab(tab) {
        if (tab.name == 1) {
          this.mit = true;
          this.aduite = false;
          this.finish = false;
          this.search = false;
        } else if (tab.name == 2) {
          this.mit = false;
          this.aduite = true;
          this.finish = false;
          this.search = false;
        } else if (tab.name == 3) {
          this.mit = false;
          this.aduite = false;
          this.finish = true;
          this.search = false;
        } else if (tab.name == 4) {
          this.mit = false;
          this.aduite = false;
          this.finish = false;
          this.search = true;
        }
      }
    }
  }
</script>


