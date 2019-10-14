<template>
  <div class="cl-container">
    <div>
      <div id="conditionBox">
        <!--查询条件组建 s-->
        <SelectHead ref="childSelect"></SelectHead>
        <!--查询条件组建 e-->
        <div class="cl-operation1">
          <el-button type="primary" size="small" class="cl-search" @click="addNewFun"><i class="icon iconfont">&#xe689;</i> 添加</el-button>
          <el-button type="primary" size="small" class="cl-search fr cl-color1" @click="setCustomData()"><i class="icon iconfont">&#xe678;</i> 表格自定义</el-button>
          <el-button type="success" size="small" class="cl-search fr" @click="exportExcel"><i class="icon iconfont">&#xe683;</i> 导出Excel</el-button>
        </div>
        <!--自定义组建 s-->
        <customTable ref="myChild" />
        <!--自定义组建 e-->
      </div>
      <!--列表组建 s-->
      <el-table id="table" :data="tableData" :height="tableHeight" style="width: 100%" border @sort-change="sortChanges">
        <el-table-column
          type="index"
          label="序号"
          width="80"
          align="center"
          fixed="left"/>
        <template v-for="(item ,index) in tableHead" >
          <el-table-column
            v-if="item.IsFreeze"
            :key="index"
            min-width="200px"
            sortable='custom'
            :prop="item.ColProp"
            :align="item.Position"
            :label="item.ColDesc"
            :fixed= "item.Freeze"/>
          <el-table-column
            v-else
            :key="index"
            min-width="200px"
            sortable='custom'
            :prop="item.ColProp"
            :align="item.Position"
            :label="item.ColDesc"/>
        </template>

        <el-table-column label="操作" width="300px" align="center" fixed="right">
          <template slot-scope="scope" v-show="scope=='临时表册'">
            <a class="operation3" @click="handleUser(scope.$index, scope.row)">表册用户</a>
          </template>
          <template slot-scope="scope" v-show="scope!='临时表册'">
            <a class="operation3" @click="handleUser(scope.$index, scope.row)">表册用户</a>
            <a class="operation1" @click="handleEdit(scope.$index, scope.row)">表册编辑</a>
            <a class="operation4" @click="" v-if="scope.row.isDelete" @click="handleEmpty(scope.$index, scope.row)">清空</a>
            <el-tooltip v-else effect="dark" content="已产生抄表数据，不可清空" placement="bottom-start">
              <a style="color: #C0C8CC;margin: 10px;">清空</a>
            </el-tooltip>

            <a class="operation2" @click="handleDelete(scope.$index, scope.row)" v-if="scope.row.isDelete">删除</a>
            <el-tooltip v-else effect="dark" content="该表册已应用，不可删除" placement="bottom-start">
              <a style="color: #C0C8CC;margin: 10px;">删除</a>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="sbap.page"
        :limit.sync="sbap.limit"
        @pagination="searchFun"/>
      <!--列表组建 e-->
    </div>
    <Dialog ref="childDialog"></Dialog>
    <!--编辑或新增窗口 e-->
    <!--表册移交 s-->
    <Schedule ref="childSchedule"></Schedule>
    <!--表册移交 e-->
    <!--表册用户定位弹窗 s-->
    <FormsDialog ref="formsDialog"></FormsDialog>
    <!--表册用户定位弹窗 e-->
  </div>
</template>

<script>
  import '@/styles/organization.scss'
  import Dialog from './components/Dialog'//新增或添加组建
  import customTable from '@/components/CustomTable/index'//自定义组建
  import Pagination from '@/components/Pagination/index'//分页
  import Schedule from './components/Schedule'//表册
  import SelectHead from './components/SelectHead'//查询条件组建
  import FormsDialog from './components/FormsDialog'//查询条件组建
  import { BlockAreaGetList, BlockAreaAdd, BlockAreaUpDate, BlockAreaDelete, BlockAreaExecl, BlockAreaGetObjById } from "@/api/organize"//http 请求
  import { parseTime } from "@/utils/index"

  export default {
    name: 'tableSeting',
    components: { customTable, Pagination, SelectHead, Dialog, Schedule, FormsDialog },
    data() {
      return {
        ID:'',
        waterFactory:[],//水厂数据集合
        tableHeight: null,//表格高度
        total: 0,
        sbap: {//查询条件对象集
          page: 1,
          limit: 10,
          filed:'',
          sort:"",
          BlockAreaName: '',//片区名称
          editUserId: '-1',//操作者
          editStartTime: '',//操作开始结束时间
          editEndTime: '',
          tableId: '0000007'
        },
        tableData: [],//表格数据
        checkAllData: [],
        checksData: [],
        customHeight: '',//自定义高度
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
      customHeight() {//获取自定义模块高度
        let self = this
        self.$nextTick(() => {
          self.tableHeight = document.getElementsByClassName('cl-container')[0].offsetHeight - document.getElementById('table').offsetTop - 50
        })
      }
    },
    methods: {
      setCustomData() {//表格自定义方法
        this.$refs.myChild.isCustom = !this.$refs.myChild.isCustom
        this.customHeight = this.$refs.myChild.isCustom
      },
      exportExcel() {//导出事件
        BlockAreaExecl(this.sbap).then(res => {
          window.location.href = `${this.common.excelPath}${res.data}`;
        })
      },
      handleEdit(scope,row) {//编辑方法
        this.ID = row.Id
        this.$refs.childDialog.dialogVisible = true
        this.$refs.childDialog.title = '编辑'
        let sbap = {Id: row.Id}
        BlockAreaGetObjById(sbap).then(res => {
          if (res.code == 0) {
            this.$refs.childDialog.ruleForm.newAreaName = res.data.BlockAreaName
            this.$refs.childDialog.ruleForm.waterFactoryName = res.data.WfList
          }
        })
      },
      addNewFun() {//新增方法
        this.$refs.childDialog.dialogVisible = true
        this.$refs.childDialog.title = '添加'
      },
      handleDelete(scope,row) {//删除方法
        this.$confirm("是否确认删除该表册？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          iconClass:"el-icon-question questionIcon",
          customClass: "warningBox",
          showClose: false
        }).then(() => {
          BlockAreaDelete({Id: row.Id}).then(res => {
            if (res.code == 0) {
              this.$message({
                message: res.message,
                type: 'success',
                duration: 4000
              });
              this.searchFun()
            } else {
              this.$message({
                message: res.message,
                type: 'warning',
                duration: 4000
              });
            }
          })
        })
      },
      handleUser(){//表册移交
        this.$refs.childSchedule.dialogVisible = true
        this.$refs.childSchedule.getTableInfo()
      },
      handleEmpty(){//清空

      },
      searchFun() {//查询事件
        BlockAreaGetList(this.sbap).then(res => {
          if (res.code ==0 ) {
            this.total = res.count;
            this.tableData = res.data;
          } else {
            this.$message({
              message: res.message,
              type: 'warning',
              duration: 4000
            });
          }
        })
      },
      sortChanges({prop, order }){//排序
        this.sbap.filed = prop
        this.sbap.sort=order=='ascending'?'ASC':(order=='descending'?'DESC':'')
        if(this.tableData.length>0){
          this.sbap.page = 1
          this.searchFun()
        }
      },
      setChildFun(){//触发表册用户定位弹框
        this.$refs.formsDialog.formsVisible = true
      }
    },
    mounted() {
      this.$refs.myChild.GetTable(this.sbap.tableId);
      this.checksData = this.$refs.myChild.checkData//获取自定义字段中选中了字段
      this.tableHeight = document.getElementsByClassName('cl-container')[0].offsetHeight - document.getElementById('table').offsetTop - 50
    }
  }
</script>

