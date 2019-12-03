<template>
  <div class="cl-treeBox">
    <el-input placeholder="请输入内容" v-model="searchText" size="small" style="margin: 18px 0">
      <el-button
        slot="append"
        size="small"
        class="search_btn"
        @click="getNodeByName"
        style="background: #00B3A1;color: #fff;padding: 5px 3px 7px 3px;"
      >
        <i class="icon iconfont">&#xe694;</i>搜索
      </el-button>
    </el-input>
    <p>公司名称</p>
    <div class="custom-tree-container">
      <el-tree
        :data="treeData"
        node-key="Id"
        ref="tree"
        highlight-current
        auto-expand-parent
        :expand-on-click-node="false"
        @node-click="setCurNode"
        default-expand-all
        :render-content="renderContent"
      ></el-tree>
    </div>
  </div>
</template>
<script>
import { promptInfoFun } from "@/utils/index";
let count; //暂存遍历二级节点个数

export default {
  name: "Tree",
  data() {
    return {
      deleteIds: [],
      selectNode: "",
      searchText: "",
      idsArry: [], //获取所有节点数据，添加flag区分是否匹配关键字
      macthArray: [], //获取遍历后符合条件的节点及其所有父节点集合
      idsLength: [], //获取二级节点个数
      noneArry: [], //获取每次选中没有被包含的节点集合
      areaId: "", //区域ID
      ifFlag: true
    };
  },
  props: ["treeData"],
  methods: {
    /**
     * 动态添加模板图标
     * */
    renderContent(h, { node, data, store }) {
      return (
        <span slot-scope="{ node, data }" style="margin-left:12px" id={data.Id}>
          {" "}
          {node.label}{" "}
        </span>
      );
    },
    /**
     * 当前选中需编辑或者新增信息或删除
     * */
    setCurNode(data) {
      this.selectNode = data;
      data.Id === "0" ? (this.areaId = -1) : (this.areaId = data.Id);
      this.$emit("changeSecode",data)
    },
    getNodeByName() {
      this.searchText.trim() == ""
        ? promptInfoFun(this, 1, "公司名称不能为空！")
        : this.getParentId(this.searchText, this.treeData[0]);
    },
    /**
     * 遍历树状图数据，获取选中ID 及其所有父级ID
     * String keyword 传入选中ID
     * Object data 树对象
     * */
    getParentId(keyword, data) {
      count = 0; //暂存遍历二级节点个数
      this.idsArry = [];
      let pidArr = [];
      let flagArr = [];
      flagArr.push({
        Id: data.Id,
        label: data.label,
        flag: data.label.indexOf(keyword) != -1
      }); //当前节点ID，及label名
      pidArr.push(flagArr);
      data.pidArr = pidArr; //存放当前选中节点ID，，以下同上
      this.idsLength = data.children.length; //获取二级节点数量
      this.getChildId(keyword, data, pidArr);
    },
    getChildId(keyword, data, pidArr) {
      //如果节点有下级节点，则往下遍历获取每一层ID 是否与当前选中ID 相等
      if (data.children.length > 0) {
        data.children.map(item => {
          let flagArr = [];
          flagArr.push({
            Id: item.Id,
            label: item.label,
            flag: item.label.indexOf(keyword) != -1
          });
          let newPidArr = [...pidArr, flagArr];
          item.pidArr = newPidArr;
          this.getChildId(keyword, item, newPidArr);
          return;
        });
        count++;
      } else {
        let resultArry = data.pidArr;
        this.idsArry.push(resultArry);
        return;
      }
      if (count === this.idsLength + 1) {
        //二级节点+1 其中1为最顶层父节点,获取最后一层遍历之后数据集合
        this.treeClickChecked(this.$refs.tree, this.idsArry);
      }
    },
    /**
     * Parse the time to string
     * @param {(Object)} theTree
     * @param {string} manualNode 添加了flag区分的node节点，true 为包含keyword
     */
    treeClickChecked(theTree, manualNode) {
      this.macthArray = [];
      this.noneArry = [];
      let Nodes = theTree.store._getAllNodes(); //获取所有节点
      manualNode.forEach(item => {
        //过滤选中节点与未选中节点集合
        for (let i = item.length - 1; i >= 0; i--) {
          if (item[i][0].flag) {
            this.macthArray.push(item.slice(0, i + 1)); //选中节点包含父几点
            this.noneArry.push(item.slice(i + 1)); //过滤二级节点下未选中节点
            break;
          }
        }
        if (JSON.stringify(item).indexOf(JSON.stringify(true)) === -1) {
          //包含二级节点的未选中节点
          this.noneArry.push(item.slice(0));
        }
      });

      /*展开选中节点*/
      if (this.macthArray.length > 0)
        this.macthArray.forEach(items => {
          //过来当前模糊查询所匹配节点
          items.forEach(i => {
            Nodes.forEach(key => {
              if (key.data.Id === i[0].Id) {
                theTree.store._getAllNodes()[0].expanded = true; //默认展开一级节点
                key.expanded = true;
                i[0].flag
                  ? document.getElementById(i[0].Id).classList.add("matchStyle")
                  : document
                      .getElementById(i[0].Id)
                      .classList.remove("matchStyle"); //动态设置过滤节点样式
              }
            });
          });
        });
      /*关闭未选中节点*/
      if (this.noneArry.length > 0)
        this.noneArry.forEach(items => {
          //过来当前模糊查询所匹配节点
          items.forEach(i => {
            if (parseInt(i[0].Id) === 0)
              //过滤一级节点
              return;
            Nodes.forEach(key => {
              if (key.data.Id === i[0].Id) {
                key.expanded = false;
                document.getElementById(i[0].Id).classList.remove("matchStyle"); //去除过滤选中样式
              }
            });
          });
        });
    }
  }
};
</script>
<style lang="scss">
.cl-treeBox {
  .matchStyle {
    color: #00b3a1;
  }
  .search_btn {
    background: #00b3a1;
    color: #fefeff;
    padding-left: 6px;
    padding-right: 6px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  > p {
    font: bold 16px/38px "Microsoft YaHei";
    color: #777c82;
    margin: 0;
    padding: 0;
    width: 190px;
  }

  height: calc(100vh - 20%);
  overflow: auto;

  .custom-tree-container {
    width: 190px;
    border: solid 1px #cad9e0;

    .el-tree {
      color: #777c82;
    }
  }
  .el-tree-node > .el-tree-node__content {
    background: rgba(242, 244, 247, 1);
  }
  .el-tree-node__children .el-tree-node__content {
    background: #fff;
  }
  .el-tree-node__content {
    height: 38px;
    font-size: 14px;
    color: #46494c;
    border-top: solid 1px #cad9e0;
    position: relative;
  }

  .el-tree-node__expand-icon {
    position: absolute;
    right: 6px;
    color: #46494c;
    font-size: 14px;
  }

  .el-tree-node__expand-icon.is-leaf {
    color: transparent !important;
  }

  .el-dialog__header {
    height: 40px;
  }

  .el-dialog__title {
    font-size: 14px;
  }

  .el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
    background-color: #00b2a1;
    color: #fff;
  }

  .el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content
    .el-tree-node__expand-icon {
    color: #fff;
  }
}
</style>
