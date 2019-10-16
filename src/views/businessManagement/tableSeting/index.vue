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
          <template slot-scope="scope">
            <a class="operation3" @click="handleUser(scope.row)">表册用户</a>
            <a class="operation1" @click="handleEdit(scope.row)">表册编辑</a>
            <a class="operation4" @click="" @click="handleEmpty(scope.row)">清空</a>
            <a class="operation2" @click="handleDelete(scope.row)">删除</a>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="rbp.page"
        :limit.sync="rbp.limit"
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
  import { GetRegisterList, GetObjById, DeleteBlObj, ClearRegisterBook, GetRegisterList_Execl, GetOrientationList} from "@/api/registerBook"
  import { parseTime } from "@/utils/index"
  import { WaterFactoryComboBoxListAuth, MeterReaderList } from "@/api/organize"


  export default {
    name: 'tableSeting',
    components: { customTable, Pagination, SelectHead, Dialog, Schedule, FormsDialog },
    data() {
      return {
        tableHeight: null,//表格高度
        total: 0,
        rbp: {//查询条件对象集
          page: 1,
          limit: 10,
          filed:'',
          sort:"",
          SA_WaterFactory_Id: "",
          MeterReaderId: "-1",
          BookTypeKey: "-1",
          BookNo: "",
          BookName: "",
          tableId: "0000009"
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
        GetRegisterList_Execl(this.rbp).then(res => {
          window.location.href = `${this.common.excelPath}${res.data}`;
        })
      },
      handleEdit(row) {//编辑方法
        this.$refs.childDialog.dialogVisible = true
        this.$refs.childDialog.title = '编辑'
        GetObjById({'RegisterBookId':row.Id}).then(res => {
           this.$refs.childDialog.rb = {
               Id: res.data.Id,
               SA_WaterFactory_Id: res.data.SA_WaterFactory_Id,
               BookName: res.data.BookName,
               BookTypeKey: JSON.stringify(res.data.BookTypeKey),
               MeterReaderId: res.data.MeterReaderId
           }
        })
      },
      addNewFun() {//新增方法
        this.$refs.childDialog.dialogVisible = true
        this.$refs.childDialog.title = '添加'
      },
      handleDelete(row) {//删除方法
        this.$confirm("是否确认删除该表册？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          iconClass:"el-icon-question questionIcon",
          customClass: "warningBox",
          showClose: false
        }).then(() => {
          DeleteBlObj({'RegisterBookId': row.Id}).then(res => {
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
      handleUser(row){//用户表册
        this.$refs.childSchedule.dialogVisible = true
        this.$refs.childSchedule.getTableInfo()//获取用户表册自定义表头信息
        if(row.Id==0){//初始化临时表册数据
          this.$refs.childSchedule.rbdp1.ecqt = row.ecqt
          this.$refs.childSchedule.searchFun1()
        }else{//初始化正式表册数据
          this.$refs.childSchedule.rbdp.ecqt = row.ecqt
          this.$refs.childSchedule.searchFun()
        }
      },
      handleEmpty(row){//清空
        ClearRegisterBook({'RegisterBookId':row.Id}).then(res => {
          if (res.code ==0 ) {
            this.$message({
              message: res.message,
              type: 'success',
              duration: 4000
            });
          } else {
            this.$message({
              message: res.message,
              type: 'warning',
              duration: 4000
            });
          }
        })
      },
      searchFun() {//查询事件
        GetRegisterList(this.rbp).then(res => {
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
        this.rbp.filed = prop
        this.rbp.sort = order=='ascending'?'ASC':(order=='descending'?'DESC':'')
        if(this.tableData.length>0){
          this.rbp.page = 1
          this.searchFun()
        }
      },
      setChildFun(params){//触发表册用户定位弹框
        this.$refs.formsDialog.rbp = params
        GetOrientationList(params).then(res => {
          if (res.code == 0) {
            if(res.count>1){//当返回信息大于一条用户信息时候，需进行手动确认
              this.$refs.formsDialog.gridData = res.data
              this.$refs.formsDialog.formsVisible = true
            }else if(res.count <= 0){
              this.$message({
                message: "暂无该用户信息！",
                type: 'warning',
                duration: 4000
              });
            }else {//有且仅有一条用户信息时直接跳转至用户表册
              /*直接跳转*/
              this.handleUser(res.data[0])
            }
          } else {
            this.$message({
              message: res.message,
              type: 'warning',
              duration: 4000
            });
          }
        })
      },
      getWaterFactoryList(){//获取具有权限的水厂数据集合
        WaterFactoryComboBoxListAuth().then(res => {
          if (res.code ==0 ) {
              this.$refs.childDialog.waterFactory = res.data;
              this.$refs.childSelect.waterFactory = res.data;
              this.$refs.childSchedule.waterFactory = res.data;
              this.rbp.SA_WaterFactory_Id = res.data[0].Id;//查询条件
              this.$refs.childDialog.rb.SA_WaterFactory_Id = res.data[0].Id//增加弹窗默认选当前登录人员所在水厂
              this.$refs.childSchedule.rbdp.SA_WaterFactory_Id = res.data[0].Id//用户移交默认选当前登录人员所在水厂
              this.getMeterReaderList(1,res.data[0].Id)//查询条件
              this.getMeterReaderList(2,res.data[0].Id)//增加弹窗根据选中水厂获取默认抄表员数据
          } else {
            this.$message({
              message: res.message,
              type: 'warning',
              duration: 4000
            });
          }
        })
      },
      getMeterReaderList(type,id){//通过水厂获得抄表员
        MeterReaderList({SA_WaterFactory_Id:id}).then(res => {
          if (res.code ==0 ) {
            type==2?this.$refs.childDialog.meterArry = res.data : this.$refs.childSelect.meterArry = res.data
          } else {
            this.$message({
              message: res.message,
              type: 'warning',
              duration: 4000
            });
          }
        })
      }
    },
    mounted() {
      this.$refs.myChild.GetTable(this.rbp.tableId);
      this.checksData = this.$refs.myChild.checkData//获取自定义字段中选中了字段
      this.tableHeight = document.getElementsByClassName('cl-container')[0].offsetHeight - document.getElementById('table').offsetTop - 50
      this.getWaterFactoryList()
    }
  }
</script>

