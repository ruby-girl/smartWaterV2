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
    <Statistics></Statistics>
    <el-table id="table" :data="tableData" :height="tableHeight" style="width: 100%" border @sort-change="sortChanges">
      <el-table-column
        type="index"
        label="序号"
        width="80"
        align="center"
        fixed="left"/>
      <template v-for="(item ,index) in tableHead">
        <el-table-column
          v-if="item.IsFreeze"
          :key="index"
          min-width="200px"
          sortable='custom'
          :prop="item.ColProp"
          :align="item.Position"
          :label="item.ColDesc"
          :fixed="item.Freeze"/>
        <el-table-column
          v-else
          :key="index"
          min-width="200px"
          sortable='custom'
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
      :page.sync="dp.page"
      :limit.sync="dp.limit"
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
  import Statistics from './Statistics'
  import AddDialog from './AddDialog'
  import EditDialog from './EditDialog'
  import DetailDialog from './DetailDialog'

  export default {
    name: "TableQuery",
    components: {Pagination, customTable, Statistics, AddDialog, EditDialog, DetailDialog},
    data(){
      return {
        tableData:[],
        tableHeight: null,//表格高度
        total:0,
        checksData:[],
        dp:{},
        tableData:[{}],
        tableHeight: null,//表格高度
        customHeight:'',
        checksData:'',
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
      exportExcel() {},
      searchFun(){
        alert(2)
      },
      sortChanges(){},
      handleEdit(row){//编辑
        this.$refs.editDialog.dialogVisible = true;
      },
      handleDetail(row){//详情
        this.$refs.detailDialog.dialogVisible = true;
      },
      handleDelete(row) {//删除方法
        this.$confirm("是否确认删除该用户？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          iconClass:"el-icon-question questionIcon",
          customClass: "warningBox",
          showClose: false
        }).then(() => {

        })
      },
      addNewFun(){//新增用户
        this.$refs.addDialog.dialogVisible = true;
      },
      makeCard(){},
      lowApplication(){},
      setCustomData() {//表格自定义
        this.$refs.tableChild.isCustom = !this.$refs.tableChild.isCustom//给子组件变量赋值
        this.customHeight = this.$refs.tableChild.isCustom
      },
    },
    mounted() {
      let _this = this
      this.dp = this.$parent.dp
      this.$refs.tableChild.GetTable(this.dp.tableId);//调用子组件方法获取表头信息
      this.checksData = this.$refs.tableChild.checkData//获取自定义字段中选中了字段
      _this.$nextTick(() => {
        _this.tableHeight = document.getElementsByClassName('tree_container')[0].offsetHeight - document.getElementById('table').offsetTop - 50
      })
      window.onresize = function () {
        _this.tableHeight = document.getElementsByClassName('tree_container')[0].offsetHeight - document.getElementById('table').offsetTop - 50
      }
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
