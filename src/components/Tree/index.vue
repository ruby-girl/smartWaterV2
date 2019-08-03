<template>
    <div class="cl-treeBox">
      <div class="custom-tree-container">
        <el-tree
          :data="treeData"
          show-checkbox
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
      return (<span class='icon iconfont' slot-scope='{ node, data }'><i class={data.icon}></i> {node.label}</span>)
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
      width: 25%;
      .el-tree{
        color: #777C82;
        .icongongsishu-yiji{color: #006663}
        .icongongsishu-erji{color: #33B300}
        .icongongsishu-sanji{color: #D8E2E7}
      }
      .el-checkbox__input.is-checked .el-checkbox__inner{
        background-color: #FF3D3D;
        border-color: #FF3D3D;}
      .el-checkbox__input.is-indeterminate .el-checkbox__inner{
        background-color: #FFFFFF;
        border-color: #DCDFE6;}
      .el-checkbox__input.is-focus .el-checkbox__inner, .el-checkbox__input:hover .el-checkbox__inner{
        border-color: #DCDFE6;
      }
    }
    .el-dialog__header{height: 40px;}
    .el-dialog__title{font-size: 14px;}
  }
</style>
