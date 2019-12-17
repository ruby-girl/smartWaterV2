<template>
  <div class="section-container secur-setting">
    <el-tabs v-model="typeCheck" @tab-click="changeTab">
      <el-tab-pane label="我提交的" name="1" >
        <sub-mitted v-if="mit"/>
      </el-tab-pane>
      <el-tab-pane label="待我审核" name="2" >
        <stay-aduite v-if="aduite"/>
      </el-tab-pane>
      <el-tab-pane label="我已审核" name="3" >
        <div>2</div v-if="finish">
      </el-tab-pane>
      <el-tab-pane label="审核查询" name="4" >
        <div>2</div v-if="search">
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import SubMitted from "./components/SubMitted";
import StayAduite from "./components/StayAduite";
export default {
  name: "businessAduit",
  components: { SubMitted, StayAduite },
  data() {
    return {
      typeCheck: "1",
      mit: true,
      aduite: false,
      finish: false,
      search: false
    };
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
};
</script>