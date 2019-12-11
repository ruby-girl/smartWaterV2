<template>
  <div class="tr_container">
    <div class="cl-operation1">
      <el-button size="mini" class="cl-search cl-reset" round @click="addNewFun"><i class="icon iconfont">&#xe689;</i>添加</el-button>
      <div class="fr">
        <el-button size="mini" class="cl-operation-btn" round @click="makeCard" ><i class="icon iconfont" >&#xe61a;</i> 制卡</el-button>
        <el-button size="mini" class="cl-operation-btn" round @click="patchCard" ><i class="icon iconfont" >&#xe664;</i> 补卡</el-button>
        <el-button size="mini" class="cl-operation-btn" round @click="lowApplication" ><i class="icon iconfont">&#xe617;</i> 低保户申请</el-button>
      </div>
    </div>
    <!--表格自定义组建 s-->
    <Statistics :StatisticsData="StatisticsData"></Statistics>
    <search-tips :tipsData="tipsData" ref="searchTips" @delTips="delTips" @excel="exportExcel" />
    <el-table id="table" :data="tableData" :height="tableHeight" style="width: 100%" border @sort-change="sortChanges" highlight-current-row  @current-change="handleCurrentChange">
      <el-table-column type="index" fixed="left" label="序号" width="60" align="center">
        <template slot-scope="scope">
          <span>{{(query.page - 1) * query.limit + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <template v-for="(item ,index) in tableHead">
        <el-table-column
          v-if="item.IsFreeze"
          :key="index"
          min-width="200px"
          :sortable="item.IsSortBol ? 'custom' : null"
          :prop="item.ColProp"
          :align="item.Position"
          :label="item.ColDesc"
          :fixed="item.Freeze"/>
        <el-table-column
          v-else
          :key="index"
          min-width="200px"
          :sortable="item.IsSortBol ? 'custom' : null"
          :prop="item.ColProp"
          :align="item.Position"
          :label="item.ColDesc"/>
      </template>
      <el-table-column label="操作" width="200px" align="center" fixed="right">
        <template slot-scope="scope">
          <a style="margin: 10px;color: #B59200" @click="handleDetail(scope.row)">详情</a>
          <a style="margin: 10px;color: #00B2A1" @click="handleEdit(scope.row)">编辑</a>
          <a style="margin: 10px;color: #FF3D3D" @click="handleDelete(scope.row)">删除</a>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="query.page"
      :limit.sync="query.limit"
      @pagination="searchFun"/>
    <!--列表数据 e-->

    <!--新增弹窗-->
    <AddDialog ref="addDialog"></AddDialog>
    <!--编辑弹窗-->
    <EditDialog ref="editDialog"></EditDialog>
    <!--详情弹窗-->
    <DetailDialog ref="detailDialog"></DetailDialog>
    <!--低保户申请-->
    <LowIncome ref="lowIncomeDialog" :curObj="curObj"></LowIncome>
  </div>
</template>

<script>
  import LowIncome from "./LowIncome"
  import SearchTips from "@/components/SearchTips/index";
  import Pagination from '@/components/Pagination/index'//分页组建
  import { promptInfoFun } from "@/utils/index"
  import Statistics from './Statistics'
  import AddDialog from './AddDialog'
  import EditDialog from './EditDialog'
  import DetailDialog from './DetailDialog'
  import { delTips, getText, pushItem } from "@/utils/projectLogic"; //搜索条件面包屑
  import { WriteCardInfo } from "@/utils/projectLogic"; //IC卡写卡
  import {
    GetICWriteCard,
    RollBackICWriteCard,
    GetICReplaceWriteCardInfo,
    RollBacICkReplaceWriteCardInfo,
  } from "@/api/userSetting";

  export default {
    name: "TableQuery",
    components: {Pagination, Statistics, AddDialog, EditDialog, DetailDialog, SearchTips, LowIncome},
    data(){
      return {
        curObj:'',
        tipsData: [], //传入子组件的值
        tipsDataCopy: [], //表单变化的值
        tableData:[],//列表数据
        StatisticsData:'',//统计数据
        tableHeight: null,//表格高度
        total:0,
        checksData:[],
        query:{
          page:1,
          limit:10,
          tableId: "0000016"
        },
        customHeight:'',
      }
    },
    computed: {
      tableHead: function() {//获取表头信息
        const arrayHead = []
        const data = this.checksData
        for (let i = 0; i < data.length; i++) { // 过滤选中列
          if (data[i].IsCheck) {
            arrayHead.push(data[i])
          }
        }
        return arrayHead
      }
    },
    watch: {
      customHeight() {//自定义模块高度
        let self = this
        self.$nextTick(() => {
          self.tableHeight = document.getElementsByClassName('tree_container')[0].offsetHeight - document.getElementById('table').offsetTop - 50
        })
      }
    },
    methods:{
      /******************导出，触发父级方法**********************/
      exportExcel() {
        this.$parent.userInfoExcel()
      },
      /******************查询，触发父级查询方法**********************/
      searchFun(type){
        if(type instanceof Object == false){//为false 则为区分水表类型条件查询，true 为普通分页查询
          this.query.WaterTypeId = type//更改查询水表类型
        }
        this.$parent.query = this.query
        this.$parent.searchTableFun()

      },
      /******************排序**********************/
      sortChanges({prop, order }){//排序
        this.query.filed = prop
        this.query.sort = order=='ascending'?'ASC':(order=='descending'?'DESC':'')
        if(this.tableData.length>0){
          this.query.page = 1
          this.$parent.query = this.query
          this.$parent.searchTableFun()
        }
      },
      /******************编辑**********************/
      handleEdit(row){
        this.$refs.editDialog.dialogVisible = true;
        this.$refs.editDialog.getInfo(row.Id)
      },
      /******************详情*********************/
      handleDetail(row){
        this.$refs.detailDialog.dialogVisible = true;
        this.$refs.detailDialog.getInfo(row.Id,row.WaterMeterTypeId)//用户ID，表类型
      },
      /******************删除*********************/
      handleDelete(row) {
        this.$confirm("是否确认删除该用户？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          iconClass:"el-icon-question questionIcon",
          customClass: "warningBox",
          showClose: false
        }).then(() => {
        })
      },
      /******************新增用户*********************/
      addNewFun(){
        this.$refs.addDialog.dialogVisible = true;
      },
      makeCard(){//制卡
        let param = {
          customerId:'',//用户ID
          receipts:false,//实收
          payType:1,//缴费方式(参考字典码)
          printerType:1,//打印方式,无打印 = -1,小票 = 2801,发票 = 2802,
          payCode:''//支付码（付款码支付时该参数使用）
        }
        GetICWriteCard(param).then(res => {//写卡
          if (res.code == 0) {
            let resultCard = JSON.stringify(res.data);
            WriteCardInfo(resultCard, function (tempJson) {
              if (tempJson != undefined && tempJson != "") {
                if (tempJson.Result) {//写卡成功
                  promptInfoFun(this, 2, res.message);
                }
                else {
                  //写卡失败
                  promptInfoFun(this, 1, res.message);
                  //写卡失败回滚
                  RollBackICWriteCard({businessId:''}).then(res => {
                  })
                }
              }
            });
          } else {
            promptInfoFun(this, 1, res.message);
          }
        });
      },
      patchCard(){//补卡
        let param = {
          customerId:'',//用户ID
          receipts:false,//实收
          payType:1,//缴费方式(参考字典码)
          printerType:1,//打印方式,无打印 = -1,小票 = 2801,发票 = 2802,
          payCode:''//支付码（付款码支付时该参数使用）
        }
        GetICReplaceWriteCardInfo(param).then(res => {//补卡
          if (res.code == 0) {
            let resultCard = JSON.stringify(res.data);
            WriteCardInfo(resultCard, function (tempJson) {
              if (tempJson != undefined && tempJson != "") {
                if (tempJson.Result) {//写卡成功
                  promptInfoFun(this, 2, res.message);
                }
                else {
                  //写卡失败
                  promptInfoFun(this, 1, res.message);
                  //补卡失败回滚
                  RollBacICkReplaceWriteCardInfo({businessId:''}).then(res => {
                  })
                }
              }
            });
          } else {
            promptInfoFun(this, 1, res.message);
          }
        });
      },
      lowApplication() {//低保户申请
        this.curObj == '' || typeof (this.curObj) == undefined ? promptInfoFun(this, 1, '请选择用户！') : this.$refs.lowIncomeDialog.dialogVisible = true
      },
      handleCurrentChange(val) {//列表点击事件
        this.curObj = val
      },
      /**
       *val 对应绑定的参数
       *this this对象
       * this.tipsDataCopy   存储面包屑数据的数组
       * param  对应搜索条件的对象名
       */
      delTips(val) {
        this.tipsDataCopy = delTips(val, this.$parent.$refs.childSelect, this.tipsDataCopy, "query"); //返回删除后的数据传给组件
        this.$parent.$refs.childSelect.searchFun()
      },
      /**
       *val 搜索数据值
       *model 对应绑定的属性
       * arr   下拉框循环的数组（输入框传“”）
       * name  对应的搜索lable
       */
      //处理搜索条件,面包屑
      getText(val, model, arr, name) {
        let obj = getText(val, model, arr, this.tipsDataCopy, this, name); //返回的组件需要的对象
        this.tipsDataCopy.push(obj);
      }
    },
    mounted() {
      let _this = this
      this.$refs.searchTips.$refs.myChild.GetTable(this.query.tableId); // 先获取所有自定义字段赋值
      this.checksData = this.$refs.searchTips.$refs.myChild.checkData; // 获取自定义字段中选中了字段\
      _this.$nextTick(() => {
        _this.tableHeight = document.getElementsByClassName('tree_container')[0].offsetHeight - document.getElementById('table').offsetTop - 65
        window.onresize = function () {
          _this.tableHeight = document.getElementsByClassName('tree_container')[0].offsetHeight - document.getElementById('table').offsetTop - 65
        }
      })
    }
  }
</script>
<style lang="scss">
  .tr_container{
    .cl-operation1{margin: 46px 0 14px 0;}
    .el-table thead tr th {
      background: #F0F2F5 !important;
    }
    .el-button--small{padding: 7px 6px;}
  }
</style>
