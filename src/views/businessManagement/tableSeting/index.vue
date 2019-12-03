<template>
  <div class="cl-container">
    <div>
      <div id="conditionBox">
        <!--查询条件组建 s-->
        <SelectHead ref="childSelect"></SelectHead>
        <!--查询条件组建 e-->
        <div class="cl-operation1">
          <el-button type="primary" size="mini" class="cl-search" @click="addNewFun"><i class="icon iconfont">&#xe689;</i> 添加</el-button>
          <el-button type="primary" size="mini" class="cl-search fr cl-color1" @click="setCustomData()"><i class="icon iconfont">&#xe678;</i> 表格自定义</el-button>
          <el-button type="success" size="mini" class="cl-search fr" @click="exportExcel"><i class="icon iconfont">&#xe683;</i> 导出Excel</el-button>
        </div>
        <!--自定义组建 s-->
        <customTable ref="myChild" />
        <!--自定义组建 e-->
      </div>
      <!--列表组建 s-->
      <el-table id="table" :data="tableData" :height="tableHeight" style="width: 100%" border @sort-change="sortChanges">
        <el-table-column type="index" fixed="left" label="序号" width="60" align="center">
          <template slot-scope="scope">
            <span>{{(rbp.page - 1) * rbp.limit+ scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <template v-for="(item ,index) in tableHead" >
          <el-table-column
            v-if="item.IsFreeze"
            :key="index"
            min-width="200px"
            :sortable="item.IsSortBol ? 'custom' : null"
            :prop="item.ColProp"
            :align="item.Position"
            :label="item.ColDesc"
            :fixed= "item.Freeze"/>
          <el-table-column
            v-else
            :key="index"
            min-width="200px"
            :sortable="item.IsSortBol ? 'custom' : null"
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
    <!--编辑或新增窗口 s-->
    <Dialog ref="childDialog"></Dialog>
    <!--表册移交 s-->
    <ScheduleLeft ref="childSchedule"></ScheduleLeft>
    <!--表册用户定位弹窗 s-->
    <FormsDialog ref="formsDialog"></FormsDialog>
    <!--用户定位-->
    <Location ref="locationDialog"></Location>
  </div>
</template>

<script>
  import '@/styles/organization.scss'
  import Dialog from './components/Dialog'//新增或添加组建
  import customTable from '@/components/CustomTable/index'//自定义组建
  import Pagination from '@/components/Pagination/index'//分页
  import ScheduleLeft from './components/ScheduleLeft'//表册
  import Location from './components/Location'//用户定位
  import SelectHead from './components/SelectHead'//查询条件组建
  import FormsDialog from './components/FormsDialog'//查询条件组建
  import { GetRegisterList, GetObjById, DeleteBlObj, ClearRegisterBook, GetRegisterList_Execl, GetOrientationList} from "@/api/registerBook"
  import { parseTime, promptInfoFun } from "@/utils/index"
  import { WaterFactoryComboBoxListAuth, MeterReaderList } from "@/api/organize"

  export default {
    name: 'tableSeting',
    components: { customTable, Pagination, SelectHead, Dialog, ScheduleLeft, FormsDialog, Location },
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
              promptInfoFun(this,2,res.message)
              this.searchFun()
            } else {
              promptInfoFun(this,1,res.message)
            }
          })
        })
      },
      handleUser(row,type){//用户表册,type==2时候为定位
        this.$refs.childSchedule.dialogVisible = true
        this.$refs.childSchedule.getTableInfo()//获取用户表册自定义表头信息
        type == 2 ? this.$refs.childSchedule.rbdp.SA_RegisterBookDetail_Id = row.Id : ''
        this.$refs.childSchedule.rbdp.SA_WaterFactory_Id = row.SA_WaterFactory_Id//水厂
        this.$refs.childSchedule.rbdp.MeterReaderId = row.MeterReader_Id//抄表员
        this.$refs.childSchedule.getMeterForm(row.MeterReader_Id)//手动选择当前抄表员加载当前表册信息
        type == 2? this.$refs.childSchedule.rbdp.SA_RegisterBookInfo_Id = row.SA_RegisterBookInfo_Id : this.$refs.childSchedule.rbdp.SA_RegisterBookInfo_Id = row.Id//表册ID
        this.$refs.childSchedule.searchFun()

     /*   if(formID == 0){//初始化临时表册数据
          this.$refs.childSchedule.searchFun1()
        }else{//初始化正式表册数据
          this.$refs.childSchedule.rbdp.SA_WaterFactory_Id = row.SA_WaterFactory_Id
          this.$refs.childSchedule.rbdp.MeterReaderId = row.MeterReader_Id
          type == 2 ? this.$refs.childSchedule.rbdp.SA_RegisterBookDetail_Id = row.Id : this.$refs.childSchedule.rbdp.SA_RegisterBookInfo_Id = row.Id//从列表点击表册用户时候传SA_RegisterBookInfo_Id,定位时候传表册SA_RegisterBookDetail_Id
          this.$refs.childSchedule.getMeterForm(row.MeterReader_Id)//手动选择当前抄表员加载当前表册信息
          this.$refs.childSchedule.searchFun(row)
        }*/
      },
      handleEmpty(row){//清空
        ClearRegisterBook({'RegisterBookId':row.Id}).then(res => {
          if (res.code ==0 ) {
            promptInfoFun(this,2,res.message)
          } else {
            promptInfoFun(this,1,res.message)
          }
        })
      },
      searchFun() {//查询事件
        GetRegisterList(this.rbp).then(res => {
          if (res.code ==0 ) {
            this.total = res.count;
            this.tableData = res.data;
          } else {
            promptInfoFun(this,1,res.message)
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
        GetOrientationList(params).then(res => {
          if (res.code == 0) {
            if(res.count>1){//当返回信息大于一条用户信息时候，需进行手动确认
              this.$refs.formsDialog.rbp = params
              this.$refs.formsDialog.total = res.count
              this.$refs.formsDialog.gridData = res.data
              this.$refs.formsDialog.formsVisible = true
            }else if(res.count <= 0){
              promptInfoFun(this,1,'暂无该用户信息')
            }else {//有且仅有一条用户信息时直接跳转至用户表册
              /*直接跳转*/
              this.handleUser(res.data[0],2)
            }
          } else {
            promptInfoFun(this,1,res.message)
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
              //this.$refs.childSchedule.rbdp1.SA_WaterFactory_Id = res.data[0].Id//用户移交默认选当前登录人员所在水厂
              this.getMeterReaderList(1,res.data[0].Id)//查询条件
              this.getMeterReaderList(2,res.data[0].Id)//增加弹窗根据选中水厂获取默认抄表员数据
              this.getMeterReaderList(3,res.data[0].Id)//用户表册弹窗根据选中水厂获取默认抄表员数据
          } else {
            promptInfoFun(this,1,res.message)
          }
        })
      },
      getMeterReaderList(type,id){//通过水厂获得抄表员
        MeterReaderList({SA_WaterFactory_Id:id}).then(res => {
          if (res.code ==0 ) {
            switch (type) {//首页查询条件
              case 1:
                this.$refs.childSelect.meterArry = res.data
                    break
              case 2://新增或编辑条件
                this.$refs.childDialog.meterArry = res.data
                break
              case 3://表册移交条件
                this.$refs.childSchedule.meterArry = res.data
                break
            }
          } else {
            promptInfoFun(this,1,res.message)
          }
        })
      }
    },
    mounted() {
      let _this = this
      _this.$refs.myChild.GetTable(this.rbp.tableId);
      _this.checksData = this.$refs.myChild.checkData//获取自定义字段中选中了字段
      _this.tableHeight = document.getElementsByClassName('cl-container')[0].offsetHeight - document.getElementById('table').offsetTop - 50
      _this.getWaterFactoryList()
    }
  }
</script>

