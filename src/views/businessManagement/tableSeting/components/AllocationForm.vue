<template>
  <el-dialog
    title="用户表册分配"
    class="allocation-dialog"
    :close-on-click-modal="false"
    top="10vh"
    :visible.sync="dialogVisible"
    width="70%">
    <el-tabs v-model="userType" @tab-click="handleClick">
      <el-tab-pane label="已分配表册用户" name="1">
        <div class="allocation-box clearfix">
          <div class="water-tree fl">
            <myTree ref="myChild" :treeData="oldTreeData"></myTree>
          </div>
          <div class="water-table fl">
            <AllocationTable ref="waterTableChild"></AllocationTable>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="未分配表册用户" name="2">
        <AllocationTable class="unallocated" ref="waterTableChild"></AllocationTable>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
import { GetWFMRRBITree } from "@/api/registerBook"
  import myTree from "@/components/Tree/index";
  import AllocationTable from './AllocationTable'
import { promptInfoFun } from "@/utils/index"

  export default {
    name: "AllocationForm",
    components: { myTree, AllocationTable},
    data() {
      return {
        userType:'1',
        dialogVisible: true,
        oldTreeData:[]
      }
    },methods:{
      searchFun(){},
      handleClick(){//选项卡切换
        this.$refs.waterTableChild.type = this.userType
      },
      GetWFMRRBITreeFun(){
        GetWFMRRBITree({'WaterFactoryIdList':[]}).then(res => {
          if (res.code ==0 ) {

            let data = JSON.stringify(res.data).replace(/MrList/g,'children').replace(/SA_WaterFactory_Name/g,'label').replace(/SA_WaterFactory_Id/g,'Id')
            let data1 = data.replace(/RbiList/g,'children').replace(/SA_MeterReader_Id/g,'Id').replace(/SA_MeterReader_Name/g,'label')
            let data2 = data1.replace(/SA_RegisterBookInfo_Id/g,'Id').replace(/SA_RegisterBookInfo_Name/g,'label')
           // this.oldTreeData = JSON.parse(data2)

            console.log(data)
          } else {
            promptInfoFun(this,1,res.message)
          }
        })
      }
    },
    created() {
      this.$nextTick(()=>{
        this.$refs.myChild.ifSearch = false
        this.GetWFMRRBITreeFun()
      })
    }
  }
</script>
<style lang="scss">
  .allocation-dialog{
    .el-tabs__nav-wrap::after{ background: none}
    .el-tabs__active-bar{height: 1px;}
    .el-tabs__item{font-size: 13px;}
    .el-tabs__header{margin: 0;}
    .el-dialog__body{padding: 0 11px 11px 11px;background: #F5F5F5;}
    .allocation-box{
      width: 100%;position: relative;
      .water-tree{width: 170px;background: #fff;margin-right: 10px;padding: 12px;position: relative;}
      .cl-treeBox{height: 500px;overflow: auto}
      .water-table{
        width: calc(100% - 180px);
        background: #fff;padding: 12px;
      }
    }
    .water-users {
      padding: 0;
      li{float: left;width: 50%;list-style-type: none;text-align: center;font: normal 13px/15px 'Microsoft YaHei';color: #5B5B5B;cursor: pointer}
      li.on{color: #37C2B5;border-bottom: solid 1px #37C2B5;}
    }
    .unallocated{padding: 12px;background: #fff;}
    .cl-operation1 {margin-bottom: 15px;}
  }
</style>
