<template>
  <el-dialog
    title="用户表册分配"
    class="allocation-dialog"
    :close-on-click-modal="false"
    top="10vh"
    :visible.sync="dialogVisible"
    width="70%">
    <el-tabs v-model="userType" @tab-click="handleClick">
      <el-tab-pane label="未分配表册用户" name="2">
        <div class="allocation-box clearfix">
          <div class="water-tree fl">
            <h2>区域</h2>
            <my-tree ref="myChild2" :treeData="oldTreeData2"  v-on:changeSecode="changeSecode2" :searchtype=searchtype></my-tree>
          </div>
          <div class="water-table fl">
            <AllocationTable ref="waterTableChild2" :moveTree="treeData"></AllocationTable>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="已分配表册用户" name="1">
        <div class="allocation-box clearfix">
          <div class="water-tree fl">
            <h2>表册</h2>
            <my-tree class="register-tree" ref="myChild" :treeData="oldTreeData"  v-on:changeSecode="changeSecode" :searchtype=searchtype :ifLogos="1"></my-tree>
          </div>
          <div class="water-table fl">
            <AllocationTable ref="waterTableChild1" :moveTree="treeData"></AllocationTable>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
  import {GetWFMRRBITree, RegisterDetailGetList, GetOrientationList} from "@/api/registerBook"
  import myTree from "@/components/Tree/index";
  import AllocationTable from './AllocationTable'
  import {promptInfoFun} from "@/utils/index"
  import { GetAreaList } from "@/api/userArea";

  export default {
    name: "AllocationForm",
    components: { myTree, AllocationTable},
    data() {
      return {
        searchtype:true,
        userType:'1',
        dialogVisible: false,
        oldTreeData:[],//表册
        oldTreeData2:[],//区域
        cont:true,
        treeData:[]
      }
    },
    methods:{
      handleClick(){//选项卡切换
        this.userType=='1' ? this.$refs.waterTableChild1.type = this.userType : this.$refs.waterTableChild2.type = this.userType
      },
      GetWFMRRBITreeFun(){//获取全部表册树
        GetWFMRRBITree({'WaterFactoryIdList':[]}).then(res => {
          if (res.code ==0 ) {
            this.oldTreeData = res.data
            this.treeData = JSON.parse(JSON.stringify(res.data))
            /*this.$nextTick(()=>{
              this.$refs.waterTableChild1.moveTree = res.data
              this.$refs.waterTableChild2.moveTree = res.data
            })*/
          } else {
            promptInfoFun(this,1,res.message)
          }
        })
      },
      changeSecode(data){//点击左侧表册回调
        if(data.IsResponse){
          this.$refs.waterTableChild1.formRbp.SA_RegisterBookInfo_Id = data.Id
          this.$refs.waterTableChild1.formRbp.SA_WaterFactory_Id = data.SA_WaterFactory_Id
          this.$refs.waterTableChild1.getRegister()
        }
      },
      changeSecode2(data){//点击左侧区域回调
        this.$refs.waterTableChild2.formRbp.SA_UserArea_Id = data.Id
        this.$refs.waterTableChild2.formRbp.SA_RegisterBookInfo_Id = '0'
        this.$refs.waterTableChild2.getRegister()
      },
      getTreeData() {//获取全部区域树
        GetAreaList().then(res => {
          if (res.code ==0 ) {
             this.oldTreeData2 = res.data.children
          } else {
            promptInfoFun(this,1,res.message)
          }
        })
      },
    },
    mounted() {
      this.$nextTick(()=>{
        this.GetWFMRRBITreeFun()
        this.getTreeData()
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
      .water-tree{width: 190px;background: #fff;margin-right: 10px;padding: 12px;position: relative;
        h2{color: #46494C;font: bold 14px 'Microsoft YaHei';margin-top: 0;}
      }
      .cl-treeBox{height: 500px;overflow: auto}
      .water-table{
        width: calc(100% - 200px);
        background: #fff;padding: 12px;
      }
    }
    .water-users {
      padding: 0;
      li{float: left;width: 50%;list-style-type: none;text-align: center;font: normal 13px/15px 'Microsoft YaHei';color: #5B5B5B;cursor: pointer}
      li.on{color: #37C2B5;border-bottom: solid 1px #37C2B5;}
    }
    .cl-operation1 {margin-bottom: 15px;}

    .register-tree, .moveTree {
      .el-tree--highlight-current
      .el-tree-node.is-current
      > .el-tree-node__content {
        color: #46494c;
        font-weight: normal;
      }

      .el-tree-node__children {
        margin-top: -1px;
      }

      .el-tree--highlight-current
      .el-tree-node.is-current
      > .el-tree-node__content
      .el-tree-node__expand-icon {
        color: #46494c;
        font-weight: normal;
      }

      .el-tree--highlight-current
      .el-tree-node.is-current
      > .el-tree-node__content .back3 {
        color: #b32f00;
        font-weight: bold;
      }
    }
    .moveTree{position: absolute;z-index: 9;right: 0px;margin-top: 14px;width: 170px;max-height: 400px;}
  }
</style>
