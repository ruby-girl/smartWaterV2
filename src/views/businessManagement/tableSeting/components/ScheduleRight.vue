<template>
  <div class="forms_box">
    <el-form
      :inline="true"
      :model="rbdp"
      class="head-search-form form-inline-small-input"
      size="small"
      label-width="100px">
      <el-form-item label="水厂  ">
        <el-select v-model="rbdp.SA_WaterFactory_Id" placeholder="请选择" size="small" @change="getMeterRead">
          <el-option v-for="(item,index) in waterFactory" :key="index" :label="item.Name" :value="item.Id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="所属区域  ">
        <el-select v-model="rbdp.SA_UserArea_Id" placeholder="请选择" size="small">
          <el-option label="全部" value="-1"></el-option>
          <el-option v-for="(item,index) in operatorArray" :key="index" :label="item.Name" :value="item.Id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="抄表员  ">
        <el-select v-model="rbdp.MeterReaderId" placeholder="请选择" size="small" @change="getMeterForm">
          <el-option label="全部" value="-1"></el-option>
          <el-option v-for="(item,index) in meterArry" :key="index" :label="item.Name" :value="item.Id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="表册  ">
        <el-select v-model="rbdp.SA_RegisterBookInfo_Id" placeholder="请选择" size="small">
          <el-option label="全部" value="-1"></el-option>
          <el-option v-for="(item,index) in formsArry" :key="index" :label="item.Name" :value="item.Id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" size="small" class="cl-search" @click="searchFun"><i
          class="icon iconfont">&#xe694;</i> 搜索
        </el-button>
      </el-form-item>
    </el-form>
    <div class="cl-operation1 clearfix">
      <el-button type="primary" size="small" class="cl-search fr cl-color1" @click="setCustomData()"><i
        class="icon iconfont">&#xe678;</i> 表格自定义
      </el-button>
      <el-button type="success" size="small" class="cl-search fr" @click="exportExcel"><i
        class="icon iconfont">&#xe683;</i> 导出Excel
      </el-button>
    </div>
    <!--自定义组建 s-->
    <CustomTable ref="formChilds"></CustomTable>
    <!--自定义组建 e-->
    <!--列表组建 s-->
    <el-table id="table3" :data="tableData" :height="tableHeight" style="width: 100%" border
              @selection-change="handleSelectionChange">
      <el-table-column
        fixed="left"
        align="center"
        type="selection"
        width="40">
      </el-table-column>
      <template v-for="(item ,index) in tableHead">
        <el-table-column
          v-if="item.IsFreeze"
          :key="index"
          min-width="200px"
          :prop="item.ColProp"
          :align="item.Position"
          :label="item.ColDesc"
          :fixed="item.Freeze"/>
        <el-table-column
          v-else
          :key="index"
          min-width="200px"
          :prop="item.ColProp"
          :align="item.Position"
          :label="item.ColDesc"/>
      </template>
    </el-table>
    <pagination
      :total="total"
      :page.sync="rbdp.page"
      :limit.sync="rbdp.limit"
      @pagination="searchFun"/>
    <!--列表组建 e-->
    <div class="move_box" id="move_box2" @mouseover="getAnimate()">
      <h3>移动所选用户</h3>
      <el-form>
        <el-form-item label="移动至:" label-width="60px">
          <el-checkbox v-model="curForm" @change="onlyOneFun">本表册</el-checkbox>
        </el-form-item>
        <el-form-item label="" label-width="60px">
          <el-input v-model="movIn.MeterReaderOrderNum" maxlength="20" style="width: 55px;padding: 0;text-align: center;margin: 8px 0 30px 0" size="mini" placeholder="序号" onkeyup="value=value.replace(/\D/g,'')" ref="NumInput"/>
          <el-radio-group v-model="movIn.Sort">
            <el-radio label="T">前</el-radio>
            <el-radio label="D">后</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item style="text-align: center">
          <el-button type="primary" size="small" @click="submitFun()">确认</el-button>
          <el-button size="small" @click="cancelFun()">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import { RegisterDetailGetList, RegisterMoveIn, ComboBoxListByMeterReader, GetList_Execl } from "@/api/registerBook"
  import { promptInfoFun } from "@/utils/index"
  import CustomTable from '@/components/CustomTable/index'//自定义组建
  import Pagination from '@/components/Pagination/index'//分页
  import { WaterFactoryComboBoxListAuth, MeterReaderList } from "@/api/organize"

  export default {
    name: "ScheduleRight",
    components: { CustomTable, Pagination },
    data() {
      return {
        curForm:false,//是否移动至本表册
        ceshi: '',//区域待完善
        dialogVisible: false,
        operatorArray: [],//区域待完善
        rbdp: {//表册
          SA_RegisterBookInfo_Id: "-1",
          SA_WaterFactory_Id: "",//水厂
          MeterReaderId: "-1",
          BookTypeKey: '',//水表类型
          SA_UserArea_Id: "",//区域
          limit: 10,
          page: 1,
          sort: "",
          filed: "",
          tableId: "0000011",
          ecqt: "1",
          Customer: "",
          SA_RegisterBookDetail_Id: ""
        },
        total: 0,
        tableData: [],
        customHeight: '',
        tableHeight: null,
        checksData: [],
        waterFactory: [],//水厂集合
        meterArry: [],//抄表员集合
        waterTypeArry: [],//水表类型
        formsArry: [],//表册集合
        movIn: {//移入表册
          rbdList: [],//移入数据集合
          MeterReaderOrderNum: "",//指定序号
          RegisterBookInfo_Id: "",//移动到的表格
          Sort: "T"//前为T(上) 或后者 D(下)
        },
        childFormId:''
      }
    },
    methods: {
      onlyOneFun(){//表册移交数据条件判断，数据需>=2条
        if(this.tableData.length<=1){
          this.curForm = false
          promptInfoFun(this,1,"当前表册数据少于2条，不可进行此操作！")
        }
      },
      handleSelectionChange(val) {//表册移交
        this.movIn.rbdList = val
      },
      submitFun(){
        if(this.curForm){//本表册移交
          this.movIn.RegisterBookInfo_Id =  this.rbdp.SA_RegisterBookInfo_Id
        }else {//不同表册移交
          if(this.movIn.RegisterBookInfo_Id == ''|| this.movIn.RegisterBookInfo_Id == '-1'){//判断是否选择右侧表册,过滤表册全部选项
            promptInfoFun(this,1,'请选择左侧表册查询后操作！')
            return
          }else if(this.movIn.RegisterBookInfo_Id === this.rbdp.SA_RegisterBookInfo_Id){
            promptInfoFun(this,1,'不能选择同一表册进行操作！')
            return
          }
          else if(this.movIn.rbdList.length<=0){
            promptInfoFun(this,1,'请选择需要移入数据！')
            return
          }
          document.getElementById('move_box2').classList.remove('on')
        }
        RegisterMoveIn(this.movIn).then(res => {
          if (res.code ==0 ) {
            promptInfoFun(this,2,res.message)
            this.searchFun()
            if(!this.curForm){
              this.$emit('searchFun')
            }
          } else {
            promptInfoFun(this,1,res.message)
          }
        })
      },
      searchFun(){//获取表册信息
        RegisterDetailGetList(this.rbdp).then(res => {
          if (res.code ==0 ) {
            this.childFormId = this.rbdp.SA_RegisterBookInfo_Id
            if(res.data.IsIsLocation){
              this.page = res.data.page
            }
            this.tableData = res.data.rbdList
            this.total = res.data.count
          } else {
            promptInfoFun(this,1,res.message)
          }
        })
      },
      getMeterRead(id){//获取抄表员
          MeterReaderList({SA_WaterFactory_Id:id}).then(res => {
            if (res.code ==0 ) {
              this.meterArry = res.data
            } else {
              promptInfoFun(this,1,res.message)
            }
          })
       },
      getMeterForm(id){//根据抄表员获取表册
        ComboBoxListByMeterReader({'MeterReaderId':id,'IsShowDefault': false}).then(res => {
          if (res.code ==0 ) {
            this.formsArry = res.data
          }
        })
      },
      setCustomData() {//表格自定义方法
        this.$refs.formChilds.isCustom = !this.$refs.formChilds.isCustom
        this.customHeight = this.$refs.formChilds.isCustom
      },
      exportExcel(){//导出
        GetList_Execl(this.rbdp).then(res => {
          window.location.href = `${this.common.excelPath}${res.data}`;
        })
      },
      getUp1(){
        this.tableHeight = document.documentElement.clientHeight - document.getElementById('table3').offsetTop - 235
      },
      cancelFun(){//取消移交
        document.getElementById('move_box2').classList.remove('on')
      },
      getAnimate(){//动画
        document.getElementById('move_box2').classList.add('on')
      }
    },
    computed: {
      tableHead: function() {//获取左侧表头信息
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
      customHeight() {//获取自定义模块高度左侧
        let self = this
        self.$nextTick(() => {//左侧列表高度
          this.tableHeight = document.documentElement.clientHeight - document.getElementById('table3').offsetTop - 235
        })
      }
    },
    mounted() {
        let _this = this
        _this.$nextTick(()=>{
          _this.$refs.formChilds.GetTable('0000011');//表册
          _this.checksData = this.$refs.formChilds.checkData//获取自定义字段中选中了字段
        })
      }
  }
</script>

