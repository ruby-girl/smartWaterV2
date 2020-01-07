<template>
  <div>
    <el-form
      :inline="true"
      :model="formRbp"
      class="head-search-form"
      size="small"
      label-width="70px"
      @submit.native.prevent>
      <el-form-item prop="CustomerQueryValue">
        <el-select v-model="formRbp.ecqt" placeholder="请选择" class="short-select-item"
                   style="width: 100px;float: left;">
          <el-option label="用户编号" value="1"/>
          <el-option label="姓名" value="2"/>
          <el-option label="电话" value="4"/>
        </el-select>
        <el-input v-model="formRbp.Customer" maxlength="50" placeholder="(长度1-50)"
                  style="width: 180px;float: left;margin-left: 10px;"/>
      </el-form-item>
      <el-form-item label="">
        <el-button v-show="type==='1'" type="primary" size="mini" @click="searchFun(1)" round><i class="icon iconfont">&#xe694;</i>查询</el-button>
        <el-button v-show="type==='2'" type="primary" size="mini" @click="searchFun(2)" round><i class="icon iconfont">&#xe694;</i>查询</el-button>
      </el-form-item>
    </el-form>
    <div class="cl-operation1 fr">
      <el-button size="mini" v-show="type=='1'" class="cl-operation-btn" round @click="deleteFun()"><i class="icon iconfont">&#xe63c;</i> 删除
      </el-button>
      <el-button size="mini" class="cl-operation-btn" round @click="distributionFun"><i class="icon iconfont">&#xe66d;</i> 分配至</el-button>
      <my-tree class="moveTree" v-show="moveTreeShow" ref="myChildFp" :treeData="moveTrees" :searchtype=searchtype  @changeSecode="moveChangeSecode" :ifLogos="1"></my-tree>
    </div>
    <el-table :row-class-name="tableRowClassName"
              highlight-current-row
              :data="tableData"
              border
              ref="multipleTable" height="450px"
              @selection-change="handleSelectionChange"
              @sort-change="sortChanges">
      <el-table-column
        type="selection"
        align="center"
        width="55">
      </el-table-column>
      <el-table-column
        v-if="this.type=='1'"
        prop="MeterReaderOrderNum"
        width="55"
        align="center"
        label="#">
      </el-table-column>
      <el-table-column
        prop="CustomerNo"
        label="用户编号"
        align="center"
        min-width="120px"
        sortable>
      </el-table-column>
      <el-table-column
        prop="CustomerName"
        label="姓名"
        align="center"
        min-width="80px"
        sortable>
      </el-table-column>
      <el-table-column
        prop="SA_UserArea"
        label="所属区域"
        align="center"
        min-width="120px"
        sortable>
      </el-table-column>
      <el-table-column
        prop="Tel"
        label="电话"
        align="center"
        min-width="120px"
        sortable>
      </el-table-column>
      <el-table-column
        prop="Address"
        label="用户地址"
        align="center"
        min-width="120px"
        sortable>
      </el-table-column>
      <el-table-column
        prop="WaterMeterType"
        label="水表类型"
        align="center"
        min-width="120px"
        sortable>
      </el-table-column>
      <el-table-column
        prop="SA_WaterFactory"
        label="水厂"
        align="center"
        min-width="120px"
        sortable>
      </el-table-column>
      <el-table-column
        v-if="this.type=='1'"
        fixed="right"
        label="排序号"
        align="center"
        width="88">
        <template slot-scope="scope">
          <el-input v-model="scope.row.nums" placeholder="" size="mini" @keyup.enter.native="sameRegisterMove(scope.row)" @blur="setNums(scope.row)"
                    onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" ></el-input>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0&&flag==1"
      :total="total"
      :page.sync="rbp.page"
      :limit.sync="rbp.limit"
      @pagination="getList"/>
    <pagination
      v-show="total>0&&flag==2"
      :total="total"
      :page.sync="rbp.page"
      :limit.sync="rbp.limit"
      @pagination="getList"/>
    <FormsDialog ref="formsDialog"></FormsDialog>
  </div>
</template>

<script>
  import FormsDialog from './FormsDialog'//查询条件组建
  import myTree from "@/components/Tree/index";
  import { GetOrientationList,RegisterDetailGetList, RegisterMoveIn, SortRegisterBookDetailMoveOut } from "@/api/registerBook"
  import Pagination from '@/components/Pagination/index'//分页
  import { promptInfoFun } from "@/utils/index"
  export default {
    name: "AllocationTable",
    components: {Pagination,myTree,FormsDialog},
    props:['moveTree'],
    data() {
      return {
        searchtype:true,
        rowNums:'',//排序号
        moveTreeShow:false,
        moveTrees:[],//移动至表册
        type:'1',//是否显示区域选择项
        tableData:[],
        areaArry:[],//区域
        dataTypes:[],
        total:0,
        formRbp: {
          limit: 10,
          page: 1,
          sort: "",
          filed: "",
          ecqt: '1',
          Customer: "",
          SA_WaterFactory_Id: "",
          SA_RegisterBookDetail_Id: "",
          SA_RegisterBookInfo_Id: ""
        },
        tbdp:{//未定位查询条件
          SA_RegisterBookInfo_Id: "",
          SA_WaterFactory_Id: "",
          MeterReaderId: "",
          BookTypeKey: -1,
          SA_UserArea_Id: "",
          limit: 10,
          page: 1,
          sort: "",
          filed: "",
          ecqt: 1,
          Customer: "",
          SA_RegisterBookDetail_Id: ""
        },
        rbp: {},
        multipleSelection:[],
        flag:2,//区分已分配表册中，定位和未定位两种查询情况
        mop:{//删除或移入到别的表册对象
          rbdList:[],
          RegisterBookInfo_Id:'',
          MeterReaderOrderNum:''
        }
      }
    },
    methods:{
      searchFun(num) {//定位列表查询
        this.flag = num
        if (this.flag == 1) {//已分配
          if(this.formRbp.SA_RegisterBookInfo_Id.trim() == ''){
            promptInfoFun(this,1,'请选择表册')
          }else if(this.formRbp.Customer==''){
            promptInfoFun(this,1,'请输入查询条件')
          }else{
            this.rbp = Object.assign({}, this.formRbp)
            GetOrientationList(this.rbp).then(res => {
              if (res.code == 0) {
                res.data.forEach(item=>{
                  item.nums = ''
                })
                if(res.data.length==1){
                   this.formRbp.SA_RegisterBookDetail_Id = res.data[0].Id
                   this.rbp = Object.assign({}, this.formRbp)
                   this.getList()
                }else if(res.data.length>1) {
                  this.$refs.formsDialog.rbp = this.rbp
                  this.$refs.formsDialog.total = res.data.length
                  this.$refs.formsDialog.gridData = res.data
                  this.$refs.formsDialog.formsVisible = true
                }else {
                  promptInfoFun(this, 1, '暂无信息！')
                }
              } else {
                promptInfoFun(this, 1, res.message)
              }
            })
          }
        }else {//未分配
          this.getRegister2()
        }
      },
      sortChanges({prop, order }){//排序
        this.rbp.filed = prop
        this.rbp.sort = order=='ascending'?'ASC':(order=='descending'?'DESC':'')
        if(this.tableData.length>0){
          this.rbp.page = 1
          this.searchFun()
        }
      },
      handleSelectionChange(val) {//列表复选框手动设置排序号
        this.multipleSelection = val
        val.forEach(item=>{
          item.nums = this.rowNums
        })
        let array = this.getArrDifference(val,this.tableData)
          array.forEach(i=>{
            i.nums = ''
         })
      },
      getArrDifference(arr1, arr2) {//过滤两数组中不同的元素
        return arr1.concat(arr2).filter(function(v, i, arr) {
          return arr.indexOf(v) === arr.lastIndexOf(v);
        });
      },
      getRegister2(){//区分是否定位
        this.tbdp.ecqt =  this.formRbp.ecqt
        this.tbdp.Customer =  this.formRbp.Customer
        this.tbdp.SA_RegisterBookInfo_Id =  this.formRbp.SA_RegisterBookInfo_Id
        this.tbdp.SA_UserArea_Id =  this.formRbp.SA_UserArea_Id
        this.rbp = Object.assign({},this.tbdp)
        this.getList()
      },
      getRegister(){//点击左侧柱状图事件未分配表册及已分配表册中未定位表册列表信息
          this.formRbp.ecqt = '1'
          this.formRbp.Customer = ''
          this.tbdp.ecqt =  '1'
          this.tbdp.Customer =  ''
          this.tbdp.SA_RegisterBookDetail_Id =  ''
          this.tbdp.SA_RegisterBookInfo_Id =  this.formRbp.SA_RegisterBookInfo_Id
          this.tbdp.SA_UserArea_Id =  this.formRbp.SA_UserArea_Id
          this.rbp = Object.assign({},this.tbdp)
          this.getList()
      },
      getList(param){//定位列表查询公用方法
        param = this.rbp
        RegisterDetailGetList(param).then(res => {
          if (res.code ==0 ) {
            res.data.rbdList.forEach(item=>{
              item.nums = ''
            })
            this.tableData = res.data.rbdList
            this.total = res.data.count
            if(res.data.IsIsLocation){
              this.$refs.multipleTable.setCurrentRow(this.tableData[res.data.index]);
              this.rbp.page = res.data.page
              this.rbp.count = res.data.count
            }
          } else {
            promptInfoFun(this,1,res.message)
          }
        })
      },
      tableRowClassName({row, rowIndex}) {//为table添加当前行索引
        row.index = rowIndex;
      },
      moveChangeSecode(data){//分配至表册回调函
        if(data.IsResponse){//IsResponse 为true时候 方可点击选择表册
          this.moveTreeShow = false
          this.mop.rbdList = this.multipleSelection
          this.mop.RegisterBookInfo_Id = data.Id
          this.$confirm("确认移动当前信息？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
            customClass: "warningBox",
            showClose: false
          }).then(() => {
            RegisterMoveIn(this.mop).then(res => {
              if (res.code == 0) {
                promptInfoFun(this,2,res.message)
                this.getList()
              } else {
                promptInfoFun(this,1,res.message)
              }
            });
          });
        }
      },
      deleteFun() {//移出已分配表册用户至未分配表册
        this.mop.RegisterBookInfo_Id = '0'
        this.mop.MeterReaderOrderNum = 0
        this.mop.rbdList = this.multipleSelection
        RegisterMoveIn(this.mop).then(res => {
          if (res.code == 0) {
            promptInfoFun(this, 2, res.message)
            this.getList()
          } else {
            promptInfoFun(this, 1, res.message)
          }
        })
      },
      sameRegisterMove(row){//本表册移动
        this.mop.MeterReaderOrderNum = parseInt(row.nums)//d动态获取
        this.mop.RegisterBookInfo_Id = this.formRbp.SA_RegisterBookInfo_Id//d动态获取
        this.mop.rbdList = this.multipleSelection
        SortRegisterBookDetailMoveOut(this.mop).then(res => {
          if (res.code ==0 ) {
            promptInfoFun(this,2,res.message)
            this.searchFun(this.flag)
          } else {
            promptInfoFun(this,1,res.message)
          }
        })
      },
      setNums(row){//排序号
        this.rowNums = row.nums
        this.multipleSelection.forEach(item=>{
          item.nums = this.rowNums
        })
        let array = this.getArrDifference(this.multipleSelection,this.tableData)
        array.forEach(i=>{
          i.nums = ''
        })
      },
      distributionFun(){
        this.multipleSelection.length<=0 ?  promptInfoFun(this,1,'请选择要移动的数据！') : this.moveTreeShow = !this.moveTreeShow
        this.moveTrees = this.moveTree
      },
      handleUser(row){//用户表册,type==2时候为定位
        this.formRbp.SA_RegisterBookDetail_Id = row.Id
        this.formRbp.SA_RegisterBookInfo_Id = this.tbdp.SA_RegisterBookInfo_Id
        this.rbp = Object.assign({}, this.formRbp)
        this.getList()
      },
    }
  }
</script>
