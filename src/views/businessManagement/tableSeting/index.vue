<template>
  <div class="cl-container">
    <div class="table-setting-box">
      <SelectHead ref="childSelect" @getText="getText"></SelectHead>
      <div class="table-setting">
        <el-button size="mini" type="primary" round @click="addNewFun"><i class="icon iconfont">&#xe689;</i>添加</el-button>
        <el-button size="mini" class="cl-operation-btn" round @click="allocationForm" ><i class="icon iconfont">&#xe6ab;</i> 表册分配</el-button>
      </div>
      <search-tips :tipsData="tipsData" ref="searchTips" @delTips="delTips" @excel="exportExcel"/>
      <el-table id="table" :data="tableData" :height="tableHeight" style="width: 100%" border
                @sort-change="sortChanges">
        <el-table-column type="index" fixed="left" label="#" width="60" align="center">
          <template slot-scope="scope">
            <span>{{(rbp.page - 1) * rbp.limit+ scope.$index + 1}}</span>
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
        <el-table-column label="操作" width="140px" align="center" fixed="right">
          <template slot-scope="scope">
            <el-tooltip effect="light" content="表册用户" placement="bottom-start">
              <a class="operation3" @click="handleUserInfo(scope.row)"><i class="iconfont icon iconbiaoceshezhi-biaoceyonghu"></i></a>
            </el-tooltip>
            <el-tooltip effect="light" content="表册编辑" placement="bottom-start">
              <a class="operation1" @click="handleEdit(scope.row)"><i class="iconfont icon iconsuoyoubiaogelidebianji"></i></a>
            </el-tooltip>
            <el-tooltip effect="light" content="清空" placement="bottom-start">
              <a class="operation4" @click="handleEmpty(scope.row)"><i class="iconfont icon iconbiaoceshezhi-qingkong"></i></a>
            </el-tooltip>
            <el-tooltip effect="light" content="删除" placement="bottom-start">
              <a class="operation2" @click="handleDelete(scope.row)"><i class="icon iconfont iconsuoyoubiaogelideshanchu"></i></a>
            </el-tooltip>
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
    <!--表册分配 s-->
    <AllocationForm ref="childSchedule"  @fatherMethod="searchFun"></AllocationForm>
    <!--表册用户定位弹窗 s-->
    <FormsDialog ref="formsDialog"></FormsDialog>
    <!--用户定位-->
    <Location ref="locationDialog"></Location>
  </div>
</template>

<script>
  import SearchTips from "@/components/SearchTips/index";
  import '@/styles/organization.scss'
  import Dialog from './components/Dialog'//新增或添加组建
  import customTable from '@/components/CustomTable/index'//自定义组建
  import Pagination from '@/components/Pagination/index'//分页
  import AllocationForm from './components/AllocationForm'
  import Location from './components/Location'//用户定位
  import SelectHead from './components/SelectHead'//查询条件组建
  import FormsDialog from './components/FormsDialog'//查询条件组建
  import { GetRegisterList, GetObjById, DeleteBlObj, ClearRegisterBook, GetRegisterList_Execl, GetOrientationList} from "@/api/registerBook"
  import { parseTime, promptInfoFun } from "@/utils/index"
  import { WaterFactoryComboBoxListAuth, MeterReaderList } from "@/api/organize"
  import { delTips, getText, pushItem } from "@/utils/projectLogic"; //搜索条件面包屑

  export default {
    name: 'tableSeting',
    components: { customTable, Pagination, SelectHead, Dialog, AllocationForm, FormsDialog, Location, SearchTips },
    data() {
      return {
        tableHeight: null,//表格高度
        total: 0,
        rbp: {//查询条件对象集
          tableId: "0000009"
        },
        tableData: [],//表格数据
        checkAllData: [],
        checksData: [],
        tipsData: [], //传入子组件的值
        tipsDataCopy: [], //表单变化的值
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
    methods: {
      exportExcel() {//导出事件
        if(this.tableData.length<=0){
          promptInfoFun(this,1,'当前列表无数据，不可导出')
          return false
        }
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
      handleUser(row){//用户表册,type==2时候为定位
        this.$refs.childSchedule.dialogVisible = true
        if(row.SA_RegisterBookInfo_Id == '0'){//未分配表册
          this.$refs.childSchedule.userType = '2'
          this.$nextTick(()=>{
            this.$refs.childSchedule.$refs.waterTableChild2.formRbp.ecqt = '1'
            this.$refs.childSchedule.$refs.waterTableChild2.formRbp.Customer = row.CustomerNo
            this.$refs.childSchedule.$refs.waterTableChild2.formRbp.SA_RegisterBookInfo_Id = '0'
            this.$refs.childSchedule.$refs.waterTableChild2.searchFun(2)
          })
        }else {//已分配表册
          this.$refs.childSchedule.userType = '1'
          this.$nextTick(()=>{
            this.$refs.childSchedule.$refs.myChild.searchText = row.SA_RegisterBookInfo_Id
            this.$refs.childSchedule.$refs.myChild.idType = false
            this.$refs.childSchedule.$refs.myChild.getNodeByName()
            this.$refs.childSchedule.$refs.waterTableChild1.formRbp.ecqt = '1'
            this.$refs.childSchedule.$refs.waterTableChild1.formRbp.Customer = row.CustomerNo
            this.$refs.childSchedule.$refs.waterTableChild1.formRbp.SA_RegisterBookInfo_Id = row.SA_RegisterBookInfo_Id
            this.$refs.childSchedule.$refs.waterTableChild1.searchFun(1)
          })
        }
      },
      handleUserInfo(row){
        this.$refs.childSchedule.dialogVisible = true
        if (row.Id == '0') {//未分配
          this.$nextTick(() => {
            this.$refs.childSchedule.userType = '2'
            this.$refs.childSchedule.$refs.waterTableChild2.getRegister(1)
          })
        }else{//已分配表册，但是不定位
          this.$nextTick(() => {
            this.$refs.childSchedule.$refs.myChild.searchText = row.Id
            this.$refs.childSchedule.$refs.myChild.idType = false
            this.$refs.childSchedule.$refs.myChild.getNodeByName()
            this.$refs.childSchedule.userType = '1'
            this.$refs.childSchedule.$refs.waterTableChild1.formRbp.SA_RegisterBookInfo_Id = row.Id
            this.$refs.childSchedule.$refs.waterTableChild1.getRegister(2)
          })
        }
      },
      allocationForm(){//表册分配 临时表册
        this.$refs.childSchedule.dialogVisible = true
        this.$refs.childSchedule.userType = '2'
        this.$nextTick(() => {
          this.$refs.childSchedule.$refs.waterTableChild2.getRegister(1)
        })
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
            this.tipsData = pushItem(this.tipsDataCopy)
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
              this.rbp.SA_WaterFactory_Id = res.data[0].Id;//查询条件
              this.$refs.childDialog.rb.SA_WaterFactory_Id = res.data[0].Id//增加弹窗默认选当前登录人员所在水厂
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
            }
          } else {
            promptInfoFun(this,1,res.message)
          }
        })
      },
      /**
       *val 对应绑定的参数
       *this this对象
       * this.tipsDataCopy   存储面包屑数据的数组
       * param  对应搜索条件的对象名
       */
      delTips(val) {
        this.tipsDataCopy = delTips(val, this.$refs.childSelect, this.tipsDataCopy, "rbp"); //返回删除后的数据传给组件
        this.$refs.childSelect.searchFun()
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
      _this.$refs.searchTips.$refs.myChild.GetTable(this.rbp.tableId); // 先获取所有自定义字段赋值
      _this.checksData = this.$refs.searchTips.$refs.myChild.checkData; // 获取自定义字段中选中了字段
      _this.tableHeight = document.getElementsByClassName('cl-container')[0].offsetHeight - document.getElementById('table').offsetTop - 70
      _this.getWaterFactoryList()
    }
  }
</script>

