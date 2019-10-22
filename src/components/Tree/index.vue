<template>
    <div class="cl-treeBox">
      <div class="custom-tree-container">
        <el-tree
          :data="treeData"
          node-key="id"
          ref="tree"
          highlight-current
          default-expand-all
          :expand-on-click-node="false"
          :render-content="renderContent"
          @node-click="setCurNode">
        </el-tree>
      </div>
    </div>
</template>
<script>
export default {
  name: 'Tree',
  data() {
    return {
      deleteIds: [],
      curNode: ''
    }
  },
  props: ['treeData'],
  methods: {
    /**
    * 动态添加模板图标
    * */
    renderContent(h, { node, data, store }) {
      return (<span slot-scope='{ node, data }' style='margin-left:12px'> {node.label}</span>)
    },
    /**
     * 当前选中需编辑或者新增信息
     * */
    setCurNode(data) {
      this.curNode = data
    },
    /**
     * 获取当前复选框选中数据
     * */
    getCheckedNodes() {
      this.deleteIds = this.$refs.tree.getCheckedNodes()
    }
  }
}
</script>
<style lang="scss">
  .cl-treeBox{
    height: calc(100vh - 20%);
    overflow: auto;
    .custom-tree-container{
      width: 100%;
      border: solid 1px #CAD9E0;
      border-bottom: none;
      .el-tree{
        color: #777C82;
      }
    }
    .el-tree-node__content{height: 38px;font-size: 14px;color: #46494C;border-bottom: solid 1px #CAD9E0;position: relative;}
    .el-tree-node__expand-icon{position: absolute;right: 6px;color: #46494C}
    .el-tree-node__expand-icon.is-leaf { color: transparent !important;}
    .el-dialog__header{height: 40px;}
    .el-dialog__title{font-size: 14px;}
    .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content{
      background-color: #00B2A1;color: #fff;
    }
    .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content .el-tree-node__expand-icon {color: #fff;}
  }
</style>
