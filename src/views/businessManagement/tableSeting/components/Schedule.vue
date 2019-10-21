<template>
  <el-dialog
    class="forms_dialog"
    :close-on-click-modal="false"
    top="5vh"
    :visible.sync="dialogVisible"
    width="90%">
    <div class="schedule_sidebox clearfix">
      <!--左侧表册-->
      <div :class="!ifShow ? 'schedule_box allWidth' : 'schedule_box'">
        <h2>表册</h2>
        <div class="forms_box">
          <el-form
            id="form_ser"
            :inline="true"
            :model="rbdp"
            size="small"
            label-width="100px">
            <el-form-item label="水厂：">
              <el-select v-model="rbdp.SA_WaterFactory_Id" placeholder="请选择" size="small" @change="getMeterRead">
                <el-option v-for="(item,index) in waterFactory" :key="index" :label="item.Name" :value="item.Id" />
              </el-select>
            </el-form-item>
            <el-form-item label="所属区域：">
              <el-select v-model="rbdp.SA_UserArea_Id" placeholder="请选择" size="small">
                <el-option label="全部" value="-1"></el-option>
                <el-option v-for="(item,index) in operatorArray" :key="index" :label="item.Name" :value="item.Id" />
              </el-select>
            </el-form-item>
            <el-form-item label="抄表员：">
              <el-select v-model="rbdp.MeterReaderId" placeholder="请选择" size="small" @change="getMeterForm">
                <el-option label="全部" value="-1"></el-option>
                <el-option v-for="(item,index) in meterArry" :key="index" :label="item.Name" :value="item.Id" />
              </el-select>
            </el-form-item>
            <el-form-item label="表册：">
              <el-select v-model="rbdp.SA_RegisterBookInfo_Id" placeholder="请选择" size="small" >
                <el-option label="全部" value="-1"></el-option>
                <el-option v-for="(item,index) in formsArry" :key="index" :label="item.Name" :value="item.Id" />
              </el-select>
            </el-form-item>
            <el-form-item label=""><el-button type="primary" size="small" class="cl-search" @click="searchFun"><i class="icon iconfont">&#xe694;</i> 搜索</el-button></el-form-item>
          </el-form>
          <div class="cl-operation1 clearfix">
            <el-button type="primary" size="small" class="cl-search fr cl-color1" @click="setCustomData()"><i class="icon iconfont">&#xe678;</i> 表格自定义</el-button>
            <el-button type="success" size="small" class="cl-search fr" @click="exportExcel"><i class="icon iconfont">&#xe683;</i> 导出Excel</el-button>
          </div>
          <!--自定义组建 s-->
          <CustomTable ref="formChilds"></CustomTable>
          <!--自定义组建 e-->
          <!--列表组建 s-->
          <el-table ref="singleTable" id="table1" :data="tableData" :height="tableHeight" style="width: 100%" border @selection-change="handleSelectionChange1">
            <el-table-column
              fixed="left"
              type="selection"
              align="center"
              width="40">
            </el-table-column>
            <template v-for="(item ,index) in tableHead" >
              <el-table-column
                v-if="item.IsFreeze"
                :key="index"
                min-width="200px"
                :prop="item.ColProp"
                :align="item.Position"
                :label="item.ColDesc"
                :fixed= "item.Freeze"/>
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
          <div class="move_box" id="move_box1" @mouseover="getAnimate()">
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
          <span class="telescopic telescopic2" @click="getUp" v-show="!ifShow">展开</span>
        </div>
      </div>
      <!--右侧表册-->
      <div :class="!ifShow ? 'schedule_box hide' : 'schedule_box'">
        <h2>表册</h2>
        <Schedule2 ref="childSchedule2" id="myform" class="none" v-on:searchFun="searchFun"></Schedule2>
        <span class="telescopic telescopic1" @click="getUp">收起</span>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeFun" size="small">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { RegisterDetailGetList, GetOrientationList, RegisterMoveOut, RegisterMoveIn, ComboBoxListByMeterReader, SortRegisterBookDetailMove, GetList_Execl } from "@/api/registerBook"
  import CustomTable from '@/components/CustomTable/index'//自定义组建
  import Pagination from '@/components/Pagination/index'//分页
  import Schedule2 from './Schedule2'
  import { promptInfoFun } from "@/utils/index"

  export default {
    name: "Schedule",
    components: { CustomTable, Pagination, Schedule2 },
    data() {
      return {
        curForm:false,//是否移动至本表册
        ceshi:'',//区域待完善
        dialogVisible: false,
        operatorArray:[],//区域待完善
        rbdp: {//临时表册参数
          limit: 10,
          page: 1,
          sort: "",
          filed: "",
          tableId: "0000010",
          ecqt: "",
          Customer: "",
          SA_WaterFactory_Id: "",
          SA_RegisterBookInfo_Id: "-1",
          MeterReaderId: "",
          BookTypeKey: "",
          SA_UserArea_Id: ""
        },
        total:0,
        tableData:[],
        customHeight:'',
        tableHeight:null,
        checksData: [],
        waterFactory:[],//水厂集合
        meterArry:[],//抄表员集合
        formsArry:[],//表册集合
        ifShow: false,
        movIn: {//移入表册
          rbdList: [],//移入数据集合
          MeterReaderOrderNum: "",//指定序号
          RegisterBookInfo_Id: "",//移动到的表格
          Sort: "T"//前为T(上) 或后者 D(下)
        },
      }
    },
    methods: {
      onlyOneFun(){//表册移交数据条件判断，数据需>=2条
        if(this.tableData.length<=1){
          this.curForm = false
          promptInfoFun(this,1,"当前表册数据少于2条，不可进行此操作！")
        }
      },
      getUp(){//收缩功能
        let _this = this
        if(_this.$refs.childSchedule2.waterFactory==''){
          _this.$refs.childSchedule2.waterFactory = _this.waterFactory
          _this.$refs.childSchedule2.rbdp.SA_WaterFactory_Id = _this.rbdp.SA_WaterFactory_Id//水厂
          _this.$refs.childSchedule2.getMeterRead(_this.rbdp.SA_WaterFactory_Id)
        }
        _this.ifShow = !_this.ifShow
        if(!_this.ifShow){
          document.getElementById('myform').classList.add('none')
        }else {
          setTimeout(()=>{
            document.getElementById('myform').classList.remove('none')
            document.getElementById('move_box2').classList.remove('on')
            _this.$refs.childSchedule2.getUp1()
            _this.tableHeight = document.documentElement.clientHeight - document.getElementById('table1').offsetTop - 235
          },200)
        }
      },
      setCustomData() {//表格自定义方法
        this.$refs.formChilds.isCustom = !this.$refs.formChilds.isCustom
        this.customHeight = this.$refs.formChilds.isCustom
      },
      handleSelectionChange1(val){//表册移交
        this.movIn.rbdList = val
      },
      exportExcel(){//导出
        GetList_Execl().then(res => {})
      },
      searchFun(){//获取表册信息
        RegisterDetailGetList(this.rbdp).then(res => {
          if (res.code ==0 ) {
            console.log(res)
           // this.$refs.singleTable.setCurrentRow(row);
            this.$refs.childSchedule2.movIn.RegisterBookInfo_Id = this.rbdp.SA_RegisterBookInfo_Id//给右侧表册赋值表册ID
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
      getTableInfo(){//获取表头信息
        let _this = this
        _this.$nextTick(()=>{
          _this.$refs.formChilds.GetTable('0000010');//表册
          _this.checksData = this.$refs.formChilds.checkData//获取自定义字段中选中了字段
          _this.tableHeight = document.documentElement.clientHeight - document.getElementById('table1').offsetTop - 235
        })
      },
      getAnimate(){//动画
        document.getElementById('move_box1').classList.add('on')
      },
      submitFun(){//确认移交
        this.movIn.RegisterBookInfo_Id = this.$refs.childSchedule2.childFormId
        if(this.curForm){//本表册移交
             this.movIn.RegisterBookInfo_Id =  this.rbdp.SA_RegisterBookInfo_Id
          }else {//不同表册移交
            if(this.movIn.RegisterBookInfo_Id == ''|| this.movIn.RegisterBookInfo_Id == '-1'){//判断是否选择右侧表册,过滤表册全部选项
              promptInfoFun(this,1,'请选择右侧表册查询后操作！')
              return
            }else if(this.$refs.childSchedule2.rbdp.SA_RegisterBookInfo_Id === this.rbdp.SA_RegisterBookInfo_Id){
              promptInfoFun(this,1,'不能选择同一表册进行操作！')
              return
            }
            else if(this.movIn.rbdList.length<=0){
              promptInfoFun(this,1,'请选择需要移入数据！')
              return
            }
            document.getElementById('move_box1').classList.remove('on')
          }
            RegisterMoveIn(this.movIn).then(res => {
              if (res.code ==0 ) {
                promptInfoFun(this,2,res.message)
                this.searchFun()
                if(!this.curForm){
                  this.$refs.childSchedule2.searchFun()
                }
              } else {
                promptInfoFun(this,1,res.message)
              }
            })
      },
      cancelFun(){//取消移交
          document.getElementById('move_box1').classList.remove('on')
      },
      closeFun(){//弹窗关闭
        this.dialogVisible = false
        document.getElementById('move_box1').classList.remove('on')
        document.getElementById('move_box2').classList.remove('on')
        this.ifShow = false
      },
      getMeterRead(id){//根据水厂获取抄表员
        this.$parent.getMeterReaderList(3,id)
      },
      getMeterForm(id){//根据抄表员获取表册
        ComboBoxListByMeterReader({'MeterReaderId':id,'IsShowDefault': false}).then(res => {
          if (res.code ==0 ) {
            this.formsArry = res.data
          }
        })
      }
    },
    watch: {
      customHeight() {//获取自定义模块高度左侧
        let self = this
        self.$nextTick(() => {//左侧列表高度
          this.tableHeight = document.documentElement.clientHeight - document.getElementById('table1').offsetTop - 235
        })
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
    }
  }
</script>
<style lang="scss">
  .forms_dialog{
    .el-row{padding: 0 20px}
    .el-dialog__header {background-color: #EBEBEB !important;padding: 0 !important;}
    .el-dialog__headerbtn{display: none}
    .el-dialog__body{background: #EBEBEB;padding: 8px 0 18px 0;}
    .el-dialog__footer{background: #EBEBEB;padding: 0 0 10px 0;}
    h2{margin: 0 0 0 0;font: normal 14px/40px 'Microsoft YaHei';background: #006663;color: #fff;padding: 0 30px;height: 40px;overflow: hidden}
    .forms_box{
      .cl-color1{margin-left: 10px;}
      background: #fff;position: relative;padding: 25px 18px 0 18px;
    }
    .move_box{
      background: #F5F5F5;width: 230px;position: absolute;top: -40px;left: 50%;margin-left: -115px;padding: 0 0 15px 12px;box-shadow: 1px 1px 5px #ddd;border-bottom-left-radius: 15px;
      border-bottom-right-radius: 15px;height: 48px;overflow: hidden;cursor: pointer;
      h3{font: normal 16px/15px 'Microsoft YaHei';color: #46494C;text-align: center;}
      .el-form-item { margin-bottom: 0;}
      .el-radio{margin-right: 10px;}
    }
    .telescopic{position: absolute;display: block;top:30%;color: #777C82;font: normal 16px 'Microsoft YaHei';width: 30px;margin: 0 auto;word-wrap: break-word;
      -webkit-box-shadow: 1px 1px 5px #cecece;background: #fff;padding: 15px 0;z-index: 999;text-align: center;cursor: pointer;
      box-shadow: 1px 1px 5px #cecece;
    }
    #table1 th, #table3 th{padding: 9px 0;}
    .telescopic1{
      left: 18px;
      border-bottom-right-radius: 15px;
      border-top-right-radius: 15px;
    }
    .telescopic2{
      right: 0px;top: 25%;
      border-bottom-left-radius: 15px;
      border-top-left-radius: 15px;
    }
    .on{
      animation:move .5s;
      -webkit-animation:move .5s;
      animation-fill-mode:forwards;
      -webkit-animation-fill-mode:forwards
    }
    @keyframes move{
      0%{height:48px;}
      100%{height:207px;}
    }
    @-webkit-keyframes move{
      0%{height:48px;}
      100%{height:207px;}
    }

    .none {display: none}
    .schedule_sidebox{padding: 0 18px}
    .schedule_box{width: 50%;float: left;box-sizing: border-box;overflow: hidden;transition:width .2s;-webkit-transition:width .2s;position: relative }
    .schedule_box:last-child{padding-left: 18px; ;box-sizing: border-box}
    .hide{
      width: 0;height: 0;
    }
    .allWidth{
      width: 100%;
      padding-left: 0 !important;
    }
  }
</style>
