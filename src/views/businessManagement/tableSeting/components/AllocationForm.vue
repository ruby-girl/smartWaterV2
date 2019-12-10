<template>
  <el-dialog
    title="用户表册分配"
    class="allocation-dialog"
    :close-on-click-modal="false"
    top="5vh"
    :visible.sync="dialogVisible"
    width="60%">
    <div class="allocation-box">
      <div class="water-tree">
        <ul class="water-users clearfix">
          <li :class="userType==1?'on':''" @click="setAllocation(1)">未分配<br/>表册用户</li>
          <li :class="userType==2?'on':''" @click="setAllocation(2)">已分配<br/>表册用户</li>
        </ul>
        <myTree v-show="userType==2" ref="myChild" :treeData="oldTreeData"></myTree>
      </div>
      <div class="water-table">
        <AllocationTable></AllocationTable>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  import myTree from "@/components/Tree/index";
  import AllocationTable from './AllocationTable'

  export default {
    name: "AllocationForm",
    components: { myTree, AllocationTable},
    data() {
      return {
        userType:1,
        dialogVisible: true,
        oldTreeData:[]
      }
    },methods:{
      setAllocation(num){
        this.userType = num
      },
      searchFun(){}
    },
    created() {
      this.$nextTick(()=>{
        this.$refs.myChild.ifSearch = false
      })
    }
  }
</script>
<style lang="scss">
  .allocation-dialog{
    .el-dialog__body{padding: 11px;background: #F5F5F5;}
    .allocation-box{
      display: flex;
      .water-tree{width: 170px;background: #fff;margin-right: 10px;padding: 0 8px 12px 8px;}
      .water-table{flex: 1;-webkit-flex: 1;background: #fff;padding: 5px 12px 12px 12px;
        h2 {font: bold 14px 'Microsoft YaHei';color: #777;}
      }
    }
    .water-users {
      padding: 0;
      li{float: left;width: 50%;list-style-type: none;text-align: center;font: normal 13px/15px 'Microsoft YaHei';color: #5B5B5B;cursor: pointer}
      li.on{color: #37C2B5;border-bottom: solid 1px #37C2B5;}
    }
  }
</style>
