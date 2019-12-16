<template>
  <div class="cl-treeBox">
    <el-input placeholder="请输入内容" v-show="ifSearch" v-model="searchText" size="mini" style="margin: 18px 0">
      <template slot="append">
        <span @click="getNodeByName"><i class="icon iconfont">&#xe694;</i>搜索</span>
      </template>
    </el-input>
    <div class="custom-tree-container">
      <el-tree
        :data="treeData"
        node-key="Id"
        ref="tree"
        highlight-current
        auto-expand-parent
        :expand-on-click-node="true"
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
      ifSearch:true,//是否显示搜索
      deleteIds: [],
      selectNode: "",
      searchText: "",
      idsArry: [], //获取所有节点数据，添加flag区分是否匹配关键字
      macthArray: [], //获取遍历后符合条件的节点及其所有父节点集合
      idsLength: [], //获取二级节点个数
      noneArry: [], //获取每次选中没有被包含的节点集合
      areaId: "", //区域ID
      ifFlag: true,
      ifLogo:true,
      idType:true,
    };
  },
  props: ["treeData",'searchtype','ifLogos'],
  methods: {
    /**
     * 动态添加模板图标
     **/
    renderContent(h, { node, data, store }) {
      if(this.ifSearch||this.ifLogo){
        return (<span slot-scope = '{ node, data }' id= {data.Id} class={'back back'+node.level}> <i class={'icon iconfont ndoe_level iconlevel'+node.level}></i> {node.label} < /span>)
      }else{
        return (<span slot-scope = '{ node, data }' id= {data.Id} class={'back back'+node.level} title={node.label}>{node.label} < /span>)
      }
    },
    /**
     * 当前选中需编辑或者新增信息或删除
     * */
    setCurNode(data) {
      let Nodes = this.$refs.tree.store._getAllNodes();
      Nodes.forEach(key => {//移除筛选条件加载的默认样式
        if(key.data.Id!=data.Id){
          document.getElementById(key.data.Id).classList.remove("matchStyle")
        }
      });
      this.selectNode = data;
      data.Id === "0" ? (this.areaId = -1) : (this.areaId = data.Id);
      this.ifSearch ?  this.$emit('changeSecode',data.Level) :  this.$emit('changeSecode',data)
    },
    getNodeByName() {//type 为1时候为精确Id查询
     let tree = {
          Id:'',
          label:'',
          children:this.treeData
      }
      this.searchText.trim() == "" ? promptInfoFun(this, 1, "公司名称不能为空！") : this.getParentId(this.searchText, tree)
    },
    /**
     * 模糊查询名称
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
        flag: this.idType ? data.label.indexOf(keyword) != -1 : data.Id.indexOf(keyword) != -1
      }); //当前节点ID，及label名
      pidArr.push(flagArr);
      data.pidArr = pidArr; //存放当前选中节点ID，，以下同上
      this.idsLength = data.children.length; //获取二级节点数量
      this.getChildId(keyword, data, pidArr);
    },
    getChildId(keyword, data, pidArr) {
      let exp = null
      if(data.children == exp)
         data.children = []
      //如果节点有下级节点，则往下遍历获取每一层ID 是否与当前选中ID 相等
      if (data.children.length > 0) {
        data.children.map(item => {
          let flagArr = [];
          flagArr.push({
            Id: item.Id,
            label: item.label,
            flag: this.idType ? item.label.indexOf(keyword) != -1 : item.Id.indexOf(keyword) != -1
          });
          let newPidArr = [...pidArr, flagArr];
          item.pidArr = newPidArr;
          this.getChildId(keyword, item, newPidArr);
          return;
        });
        if (count === this.idsLength + 1) {
          //二级节点+1 其中1为最顶层父节点,获取最后一层遍历之后数据集合
          this.treeClickChecked(this.$refs.tree, this.idsArry);
        }
        count++;
      } else {
        let resultArry = data.pidArr;
        this.idsArry.push(resultArry);
        this.treeClickChecked(this.$refs.tree, this.idsArry);
        return;
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
      /*关闭未选中节点*/
      if (this.noneArry.length > 0){
        this.noneArry.forEach(items => {
          //过来当前模糊查询所匹配节点
          items.forEach(i => {
            if (parseInt(i[0].Id) === 0)//过滤一级节点
              return;
            Nodes.forEach(key => {
              if (key.data.Id === i[0].Id) {
                key.expanded = false;
                document.getElementById(i[0].Id).classList.remove("matchStyle"); //去除过滤选中样式
                return
              }
            });
             //theTree.store._getAllNodes()[0].expanded = true;
          });
        });
      }
      /*展开选中节点*/
      if (this.macthArray.length > 0){
        this.macthArray.forEach(items => {
          //过来当前模糊查询所匹配节点
          items.forEach(i => {
            Nodes.forEach(key => {
              if (key.data.Id === i[0].Id) {
               //theTree.store._getAllNodes()[0].expanded = true; //默认展开一级节点
                key.expanded = true;
                i[0].flag ? document.getElementById(i[0].Id).classList.add("matchStyle") : document.getElementById(i[0].Id).classList.remove("matchStyle"); //动态设置过滤节点样式
                return
              }
            });
          });
        });
      }
    }
  },
  mounted() {
    this.$nextTick(()=>{
      this.searchtype ? this.ifSearch = false : this.ifSearch = true
      this.ifLogos == 1 ? this.ifLogo = false : this.ifLogo = true
    })
  }
};
</script>
<style lang="scss">
.cl-treeBox {
  .back{display: block;width: 100%;height: 100%;padding-left: 15px;line-height: 38px;
    padding-right: 10px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap}
  .back1{background: #6DB3AC}
  .back2{background: #95CCC7;padding-left: 20px;}
  .back3{background: #B6DBD8;padding-left: 30px}
  .back4{background: #CFE6E2;padding-left: 40px}
  .back5{background: #dff6f4;padding-left: 50px}
  .back6{background: #E9F5F4;padding-left: 60px}
  .ndoe_level{color: #247A77;font-size: 12px;}
  .matchStyle {
    color: #b32f00 !important;
    font-weight: bold !important;;
  }
  .el-input-group__append{padding: 0;background: #00b3a1;border: none;
    color: #fefeff;padding: 5px 6px 5px 6px;cursor: pointer}
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
    width: 100%;
    border: none;
    .el-tree {
      color: #777c82;
      height: 100%;
    }
  }
  .el-tree-node__content {
    height: 38px;
    font-size: 14px;
    color: #46494c;
    border-top: solid 1px #cad9e0;
    position: relative;
    padding-left: 0px !important;
    border-left:solid 1px #cad9e0;
    border-right:solid 1px #cad9e0;
  }
  .el-tree-node__expand-icon {
    position: absolute;
    right: 6px;
    color: #46494c;
    font-size: 14px;
    top:50%;margin-top: -13px;
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
    color: #b32f00;
    font-weight: bold;
  }
  .el-tree-node__children{margin-top: -1px;}
  .el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content
    .el-tree-node__expand-icon {
    color: #b32f00;
    font-weight: bold;
  }
}
</style>
