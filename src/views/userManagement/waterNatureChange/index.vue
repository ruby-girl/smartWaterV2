<template>
  <div class="section-container" >
      <el-tabs v-model="typeCheck" @tab-click="handleClick">
      <el-tab-pane label="用水性质变更" name="1">
        <change-operation />
      </el-tab-pane>
      <el-tab-pane label="变更记录" name="2">
       
       <change-log />
      </el-tab-pane>
    </el-tabs>  
  </div>
</template>
<script>
import ChangeLog from "./components/ChangeLog"
import ChangeOperation from "./components/ChangeOperation"
  export default {
    name: "waterNatureChange",
    components: {ChangeLog,ChangeOperation },
    data() {
      return {
        typeCheck:'1',
      };
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
.section-container{
  /deep/ .el-tabs__header{
    margin:0 !important;
  }
}
</style>
