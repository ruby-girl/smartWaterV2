<template>
  <div class="tree_container">
    <div class="user_box">
      <!--左侧树形菜单-->
      <div class="user_tree">
        <h2 @click="getWaterInfos" style="cursor: pointer">{{ waterFactoryName.Name }}</h2>
        <p v-show="waterNums.length>1" class="switch_water" @click="changeWaterFactory"><i class="icon iconfont iconqiehuan"></i>切换水厂</p>
        <div id="operate_area">
          <el-button :disabled="disAdd" type="primary" size="mini" @click="getCheckedNodes(1)" round><i class="icon iconfont">&#xe689;</i>添加</el-button>
          <el-button :disabled="disEdit" round size="mini" class="cl-reset" @click="getCheckedNodes(2)"><i class="icon iconfont">&#xe618;</i>编辑</el-button>
          <el-button :disabled="disDel" round size="mini" class="cl-danger" @click="getCheckedNodes(3)"><i class="icon iconfont">&#xe68a;</i>删除</el-button>
        </div>
        <myTree ref="myChild" :treeData="oldTreeData"  @changeSecode="changeSecode"></myTree>
        <span v-show="!ifShow" class="telescopic telescopic2" @click="getUp">
          收起
          <i class="iconfont iconshouqi2" style="font-size: 12px;"></i>
        </span>
      </div>
      <!--右侧列表数据-->
      <div class="user_table">
        <SelectHead @getText="getText" ref="childSelect"></SelectHead>
        <tableQuery ref="tableChild"></tableQuery>
        <span v-show="ifShow" class="telescopic telescopic1" @click="getUp">
          展开
          <i class="iconfont iconshouqi1" style="font-size: 12px;"></i>
        </span>
      </div>
    </div>
    <!--新增编辑区域弹窗 s-->
    <Dialog ref="editDialog"></Dialog>
    <!--切换水厂-->
    <SwitchFactory ref="switchChild"></SwitchFactory>
  </div>
</template>

<script>
import "@/styles/organization.scss";
import myTree from "@/components/Tree/index";
import SelectHead from "./components/SelectHead";
import tableQuery from "./components/TableQuery";
import Dialog from "./components/Dialog";
import SwitchFactory from './components/SwitchFactory'
import { promptInfoFun } from "@/utils/index";
import { CreateAreaNo, DelCustomerArea, GetAreaListByWaterFactory, GetAreaListNotPNode } from "@/api/userArea";
import {
  GetWaterTypeCustomerNum,
  GetCustomerDataList,
  GetCustomerDataList_ToExcel
} from "@/api/userSetting";
import Bus from "@/utils/bus";
import { pushItem } from "@/utils/projectLogic"; //搜索条件面包屑
import{ mapGetters } from 'vuex'

export default {
  name: "userSeting",
  components: { myTree, SelectHead, tableQuery, Dialog,SwitchFactory },
  data() {
    return {
      waterFactoryName:{Name:'全部水厂',Id:'-1'},
      ifShow: false,
      query: {
        //右侧用户列表查询条件
        tableId: "0000016",
        WaterFactoryId:'',
      },
      oldTreeData: [],
      disAdd: false,
      disEdit: false,
      disDel: false,
      firstTree:{},
      waterNums:[],
      ifWaterFactory:true,//是否查水厂 , true 为水厂，false为区域
    };
  },
  computed: {
    ...mapGetters([
      'waterWorks'
    ]),
  },
  watch: {
    waterWorks: function (newValue) {
      if (newValue) {
        this.waterNums = newValue
      }
    },
    waterFactoryName: function (newValue) {//全部水厂不允许添加区域
      newValue.Id == '-1' ? this.disAdd = true : this.disAdd = false
    },
    query(){
      this.$refs.tableChild.query = this.query
    }
  },
  methods: {
    /**
     * 伸缩功能
     * */
    getUp() {
      this.ifShow = !this.ifShow;
      if (this.ifShow) {
        document.getElementsByClassName('telescopic1')[0].style.display = 'block'
        document.getElementById("operate_area").classList.add("none");
        document.getElementsByClassName("user_tree")[0].classList.add("hide");
      } else {
        document.getElementsByClassName('telescopic1')[0].style.display = 'none'
        document
          .getElementsByClassName("user_tree")[0]
          .classList.remove("hide");
        setTimeout(() => {
          document.getElementById("operate_area").classList.remove("none");
        }, 160);
      }
    },
    //获取选中的树节点
    changeSecode(Level) {
      this.ifWaterFactory = false
      if(Level==1){
        this.disEdit = true
        this.disDel = true
        this.disAdd = false
      }else if(Level==6){
        this.disAdd = true
        this.disEdit = false
        this.disDel = false
      }else {
        this.disAdd = false
        this.disEdit = false
        this.disDel = false
      }
    },
    /**
     * 节点增删编辑事件
     * params type
     * 1 增加节点 2：编辑节点 3：删除节点
     * */
    getCheckedNodes(type) {
      const _this = this;
      let selectNode ;
      _this.$refs.myChild.selectNode!='' ? selectNode = _this.$refs.myChild.selectNode : selectNode = this.waterFactoryName
      _this.$refs.editDialog.param.Id = selectNode.Id;
      _this.$refs.editDialog.param.Pid = selectNode.Pid;
      switch (type) {
        case 1://新增
          _this.$refs.editDialog.param.Id = selectNode.Id;//添加时候只需要PID
          _this.$refs.editDialog.param.pieName = selectNode.label||selectNode.Name;
          CreateAreaNo().then(res => {
            //自动生成区域编码
            if (res.code == 0) {
              _this.$refs.editDialog.param.AreaNo = res.data;
              _this.$refs.editDialog.dialogVisible = true;
              _this.$refs.editDialog.param.AreaName = "";
              _this.$refs.editDialog.title = "添加";
            } else {
              promptInfoFun(this, 1, res.message);
            }
          });
          break;
        case 2://编辑
          selectNode.Id === undefined ||
          selectNode.Id == 0 ||
          selectNode.Level <= 1 ? (_this.disEdit = false,promptInfoFun(this,1,'请选择区域！')) : (_this.$refs.editDialog.dialogVisible = true);
          _this.$refs.editDialog.param.pieName = selectNode.PName; //上级目录
          _this.$refs.editDialog.param.AreaNo = selectNode.AreaNo; //老树
          _this.$refs.editDialog.param.AreaName = selectNode.label
          _this.$refs.editDialog.title = "编辑";
          break;
        case 3://删除
          if (selectNode.Id === undefined || selectNode.Id == 0 || selectNode.Level <= 1) {
            _this.disDel = false;
            promptInfoFun(this,1,'请选择区域！')
            return;
          }
          this.$confirm("是否确认删除该区域？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            iconClass: "el-icon-question questionIcon",
            customClass: "warningBox",
            showClose: false
          }).then(() => {
            DelCustomerArea({ areaId: selectNode.Id }).then(res => {
              //删除节点
              if (res.code == 0) {
                promptInfoFun(this, 2, res.message);
                this.getTreeData();
              } else {
                promptInfoFun(this, 1, res.message);
              }
            });
          });
          break;
      }
    },
    /**
     * 获取左侧区域列表数据
     * */
    getTreeData() {
      GetAreaListNotPNode({'pid':this.waterFactoryName.Id}).then(res => {
        if (res.code ==0 ) {
          this.firstTree = res.data
          this.oldTreeData = res.data
          this.$refs.myChild.selectNode = ""//重置tree 默认项
        } else {
          promptInfoFun(this,1,res.message)
        }
      })
    },
    getWaterInfos(){//直接查水厂信息
      this.$refs.myChild.areaId = ''
      this.$refs.myChild.selectNode = ''
      //this.$refs.myChild.$refs.tree.setCheckedNodes([]);//重置区域树
      //this.$refs.childSelect.query.AreaId = localStorage.getItem('waterFactoryId')
      this.ifWaterFactory = true
      this.$refs.childSelect.searchFun()
      let elementNodes1 = document.getElementsByClassName('is-current')//选中样式
      elementNodes1.length > 0 ? elementNodes1[0].classList.remove('is-current') : ''
      let elementNodes2 = document.getElementsByClassName('matchStyle')//收索结果样式
      for(let i = elementNodes2.length-1; i >=0 ; i--) {//遍历去掉区域树收索结果样式
        elementNodes2[i].classList.remove('matchStyle')
      }
    },
    /**
     * 用户列表查询
     * */
    searchTableFun() {
      this.getTableLine()
      this.getSatrtFun()
    },
    getTableLine(){
      this.ifWaterFactory ? this.query.AreaId = localStorage.getItem('waterFactoryId') : this.query.AreaId = this.$refs.myChild.areaId
      let query = Object.assign({}, this.query);
      query.CustomerQueryType = parseInt(query.CustomerQueryType);
      query.UserType = parseInt(query.UserType);
      query.UserState = parseInt(query.UserState);
      GetCustomerDataList(query).then(res => {
        //用户列表
        if (res.code == 0) {
          this.$refs.tableChild.total = res.count;
          this.$refs.tableChild.tableData = res.data;
        } else {
          promptInfoFun(this, 1, res.message);
        }
      });
      let parms = JSON.stringify(this.query);
      parms = JSON.parse(parms);
      parms.WaterTypeId = -1;
      this.$refs.tableChild.tipsData = pushItem(this.$refs.tableChild.tipsDataCopy)
    },
    /**
     * 用户导出
     * */
    userInfoExcel() {
      GetCustomerDataList_ToExcel(this.query).then(res => {
        window.location.href = `${this.common.excelPath}${res.data}`;
      });
    },
    /**
     * 切换水厂
     * */
    changeWaterFactory(){
      this.$refs.switchChild.waterFactory = this.$store.state.user.waterWorks
      this.$refs.switchChild.dialogVisible = true;
      this.$refs.switchChild.formData.waterFactoryId = this.waterFactoryName.Id
    },
    getText(val, model, arr, name) {//触发子元素事件
      this.$refs.tableChild.getText(val, model, arr, name)
    },
    getSatrtFun(){
      this.ifWaterFactory ? this.query.AreaId = localStorage.getItem('waterFactoryId') : this.query.AreaId = this.$refs.myChild.areaId
      let query = Object.assign({}, this.query);
      query.CustomerQueryType = parseInt(query.CustomerQueryType);
      query.UserType = parseInt(query.UserType);
      query.UserState = parseInt(query.UserState);
      GetWaterTypeCustomerNum(query).then(res => {
        //用户统计数据
        if (res.code == 0) {
          this.$refs.tableChild.StatisticsData = res.data;
        } else {
          promptInfoFun(this, 1, res.message);
        }
      });
    }
  },
  mounted() {
    this.waterNums = this.$store.state.user.waterWorks
    this.waterNums.forEach(item=>{//默认顶级水厂不能进行删除编辑操作
      item.Level = 1
    })
    let obj = {
      Id:'-1',
      Name:'全部水厂',
      Pid:'',
      ProcessMemberType:'',
      Level:1
    }
    this.$store.state.user.waterWorks.length>1 ? this.waterFactoryName = obj : this.waterFactoryName = this.$store.state.user.waterWorks[0]
    this.$store.state.user.waterWorks.length>1 ? localStorage.setItem('waterFactoryId', '-1'):localStorage.setItem('waterFactoryId', this.$store.state.user.waterWorks[0].Id)
    let _this = this;
    this.getTreeData();
    this.getSatrtFun()
    Bus.$off("queryData");
    Bus.$on("queryData", () => {
      //添加成功后调用查询方法
      _this.searchTableFun();
    });
  },
  beforeDestroy() {
    Bus.$off("queryData");
  }
}
</script>
<style lang="scss">
.tree_container {
  .custom-tree-container{height: calc(100% - 100px);}
  .switch_water {cursor: pointer;
  i{font-size: 12px;margin-right: 3px;}}
  .switch_water{ position: absolute;right: 16px;top:10px;margin: 0;font: normal 13px 'Microsoft YaHei';color: #8F8F8F;}
  .info {
    background: rgba(199, 199, 199, 1) !important;
    border-color: rgba(199, 199, 199, 1) !important;
    color: #fff !important;
    :hover {
      background: rgba(199, 199, 199, 1) !important;
      border-color: rgba(199, 199, 199, 1) !important;
      color: #fff !important;
    }
  }
  background: #eff1f4;
  .telescopic {
    position: absolute;
    display: block;
    top: 39%;
    color: #777c82;
    font: normal 16px "Microsoft YaHei";
    width: 30px;
    margin: 0 auto;
    word-wrap: break-word;
    -webkit-box-shadow: 1px 1px 5px #cecece;
    background: #fff;
    padding: 15px 0;
    z-index: 999;
    text-align: center;
    cursor: pointer;
    box-shadow: 1px 1px 5px #cecece;
  }
  .telescopic1 {
    left: 0;
    border-bottom-right-radius: 15px;
    border-top-right-radius: 15px;
  }
  .telescopic2 {
    right: 0px;
    border-bottom-left-radius: 15px;
    border-top-left-radius: 15px;
  }
  position: relative;
  padding: 11px 11px 0 11px;
  height: 100%;
  .user_box {
    display: flex;
    height: inherit;
    > div {
      transition: width 0.2s;
      -webkit-transition: width 0.2s;
      position: relative;
    }
    .user_tree {
      width: 240px;
      position: relative;
      background: #fff;
      padding: 0 15px;
      h2 {
        font: bold 16px/16px "Microsoft YaHei";
        color: #46494c;width: 65%;text-overflow:ellipsis;overflow: hidden;white-space: nowrap;
      }
      .btn_one {
        color: #fefefe;
      }
      .btn_two {
        color: #00b2a1;
        border: solid 1px #00b2a1;
      }
      .btn_three {
        color: #ff5656;
        border: solid 1px #ff5656;
      }
      .btn_three:hover {
        background: #fef0f0;
      }
      #my_tree {
        overflow: auto;
        width: 190px;
      }
      margin-right: 16px;
    }
    .user_table {
      flex: 1;
      -webkit-flex: 1;
      background: #fff;
      padding: 16px;
      position: relative;
      overflow: hidden;
    }
  }
  .el-button--small {
    padding: 7px 5px;
  }
  .hide {
    width: 0 !important;
    padding: 0 !important;
    overflow: hidden;
    margin-right: 0 !important;
  }
  .none {
    display: none;
  }
}
</style>
