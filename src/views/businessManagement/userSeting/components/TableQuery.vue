<template>
  <div class="tr_container">
    <div class="cl-operation1">
      <el-button type="primary" size="small" class="cl-search" @click="addNewFun"><i class="icon iconfont">&#xe689;</i>添加</el-button>
      <el-button type="primary" size="small" class="fr" @click="setCustomData()" style="background: #FADB14;border: solid 1px #FADB14;"><i class="icon iconfont">&#xe678;</i> 表格自定义</el-button>
      <el-button type="success" size="small" class="fr" @click="exportExcel"><i class="icon iconfont">&#xe683;</i> 导出Excel</el-button>
      <el-button type="primary" size="small" class="fr" @click="lowApplication" style="background: #E5A903;border: solid 1px #E5A903;"><i class="icon iconfont">&#xe617;</i> 低保户申请</el-button>
      <el-button type="primary" size="small" class="fr" @click="makeCard" style="background: #75C200;border: solid 1px #75C200;"><i class="icon iconfont" >&#xe61a;</i> 制卡</el-button>
    </div>
    <!--表格自定义组建 s-->
    <customTable ref="tableChild" />
    <Statistics :StatisticsData="StatisticsData"></Statistics>

    <el-table id="table" :data="tableData" :height="tableHeight" style="width: 100%" border @sort-change="sortChanges">
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
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination/index'//分页组建
  import customTable from '@/components/CustomTable/index'//自定义表格组建
  import { promptInfoFun } from "@/utils/index"
  import Statistics from './Statistics'
  import AddDialog from './AddDialog'
  import EditDialog from './EditDialog'
  import DetailDialog from './DetailDialog'

  export default {
    name: "TableQuery",
    components: {Pagination, customTable, Statistics, AddDialog, EditDialog, DetailDialog},
    data(){
      return {
        tableData:[],//列表数据
        StatisticsData:'',//统计数据
        tableHeight: null,//表格高度
        total:0,
        checksData:[],
        query:{
          page:1,
          limit:10
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
        this.$parent.searchTableFun()
      },
      /******************排序**********************/
      sortChanges({prop, order }){//排序
        this.query.filed = prop
        this.query.sort = order=='ascending'?'ASC':(order=='descending'?'DESC':'')
        if(this.tableData.length>0){
          this.query.page = 1
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
      makeCard(){

      },
      lowApplication(){},
      /*******************表格自定义***********************/
      setCustomData() {
        this.$refs.tableChild.isCustom = !this.$refs.tableChild.isCustom//给子组件变量赋值
        this.customHeight = this.$refs.tableChild.isCustom
      },
    },
    mounted() {
      let _this = this
      this.query = this.$parent.query
      this.$refs.tableChild.GetTable(this.query.tableId);//调用子组件方法获取表头信息
      this.checksData = this.$refs.tableChild.checkData//获取自定义字段中选中了字段
      _this.$nextTick(() => {
        _this.tableHeight = document.getElementsByClassName('tree_container')[0].offsetHeight - document.getElementById('table').offsetTop - 50
        window.onresize = function () {
          _this.tableHeight = document.getElementsByClassName('tree_container')[0].offsetHeight - document.getElementById('table').offsetTop - 50
        }
      })
    }
  }
</script>
<style lang="scss">
  .tr_container{
    .el-table thead tr th {
      background: #F0F2F5 !important;
    }
    .el-button--small{padding: 7px 6px;}
  }
</style>
