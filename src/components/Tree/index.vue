<template>
  <div class="cl-treeBox">
    <el-input placeholder="请输入内容" v-model="searchText" size="small" style="margin: 18px 0">
      <el-button slot="append" size="small" class="search_btn"
                 @click="getNodeByName"
                 style="background: #00B3A1;color: #fff;padding: 7px 3px 9px 3px;">
        <i class="icon iconfont">&#xe694;</i>搜索</el-button>
    </el-input>
    <p>公司名称</p>
    <div id="tree"></div>
  </div>
</template>
<script>
  import '../../../node_modules/bootstrap/dist/js/bootstrap.min.js'
  import '../../../node_modules/bootstrap-treeview/dist/bootstrap-treeview.min'
  import { promptInfoFun } from "@/utils/index"
  import { treeClickChecked } from "@/utils/tree"
  let cookieNodes = []

  export default {
    name: 'Tree',
    data() {
      return {
        deleteIds: [],
        searchText:'',
        selectNode:{},
        areaId:'',//区域ID
      }
    },
    methods: {
      getNodeByName(){
        this.searchText.trim() == '' ? promptInfoFun(this, 1, "公司名称不能为空！") : $('#tree').treeview('collapseAll', { silent: true })
        $('#tree').treeview('search', [this.searchText, {
          ignoreCase:true,
          exactMatch:false,
          revealResults:true,
        }]);
      },
      getTreeData(treeData){
        let _this = this
          $('#tree').treeview({
            data: treeData,
            showIcon: true,
            expandIcon: "el-icon-caret-right",
            collapseIcon: "el-icon-caret-bottom",
            showCheckbox: false,
            selectedBackColor: "#00B2A1",   //选中背景颜色
            searchResultColor: "#ff5722",   //搜索
            levels: 5,
            color:'#46494C',
            showBorder: true,
            onNodeSelected: function (event, node) {
              _this.selectNode = node
              node.Id === "0" ? _this.areaId = -1 : _this.areaId = node.Id
            },
            onNodeExpanded: function (event, node) {
              cookieNodes = $('#tree').treeview('getExpanded', node.nodeId);
            },
            onNodeCollapsed: function (event, node) {
              cookieNodes = $('#tree').treeview('getExpanded', node.nodeId);
            },

          });
          cookieNodes.map(function (item) {
            $('#tree').treeview('expandNode', item.nodeId);
          })
      }
    }
  }
</script>
<style lang="scss">
  .cl-treeBox{
    position: relative;overflow: hidden;height: 100%;
    .search_btn{background: #00B3A1;color: #FEFEFF;padding-left: 6px;padding-right: 6px;border-top-left-radius: 0;border-bottom-left-radius: 0;}
    >p{background: #CAD9E0;font: bold 14px/38px 'Microsoft YaHei';color: #46494C;margin: 0;padding: 0 12px;width: 190px;}
    .el-tree-node__content{height: 38px;font-size: 14px;color: #46494C;border-top: solid 1px #CAD9E0;position: relative;}
    .el-tree-node__expand-icon{position: absolute;right: 6px;color: #46494C}
    .el-tree-node__expand-icon.is-leaf { color: transparent !important;}
    .el-dialog__header{height: 40px;}
    .el-dialog__title{font-size: 14px;}
    .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content{
      background-color: #00B2A1;color: #fff;
    }
    .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content .el-tree-node__expand-icon {color: #fff;}
    .list-group-item:first-child{border-top-left-radius: 0;
      border-top-right-radius: 0;}
    .list-group-item.node-tree.node-selected{ background: #00B2A1}
    .treeview .list-group-item{font-size: 14px;}
    #tree{width: 190px;height: calc(100% - 250px);overflow: auto}
    .list-group{
      padding: 0;margin: 0;border: solid 1px #D8E2E7;
      li{list-style-type: none;border-top: solid 1px #D8E2E7;padding: 12px 12px;}
      li:first-child{border: none;}
    }
  }
</style>
