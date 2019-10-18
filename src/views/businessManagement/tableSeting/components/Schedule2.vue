<template>
  <el-dialog
    class="forms_dialog"
    :close-on-click-modal="false"
    top="5vh"
    :visible.sync="dialogVisible"
    width="90%">
    <div class="schedule_sidebox clearfix">
      <div :class="!ifShow ? 'schedule_box hide' : 'schedule_box'">
        <h2>临时表册</h2>
        <div class="forms_box" id="myform">
           <el-form
             id="form_ser"
             :inline="true"
             :model="rbdp1"
             size="small"
             label-width="100px">
             <el-form-item label="水厂：">
               <el-select v-model="rbdp1.SA_WaterFactory_Id" placeholder="请选择" size="small">
                 <el-option v-for="(item,index) in waterFactory" :key="index" :label="item.Name" :value="item.Id" />
               </el-select>
             </el-form-item>
             <el-form-item label="所属区域：">
               <el-select v-model="rbdp1.SA_UserArea_Id" placeholder="请选择" size="small">
                 <el-option label="全部" value="-1"></el-option>
                 <el-option v-for="(item,index) in operatorArray" :key="index" :label="item.Name" :value="item.Id" />
               </el-select>
             </el-form-item>
             <el-form-item label="水表类型：">
               <el-select v-model="rbdp1.BookTypeKey" placeholder="请选择" size="small">
                 <el-option label="全部" value="-1"></el-option>
                 <el-option v-for="(item,index) in waterTypeArry" :key="index" :label="item.Name" :value="item.Id" />
               </el-select>
             </el-form-item>
             <el-form-item  label="用户：">
               <el-select v-model="rbdp1.ecqt" placeholder="请选择" style="width: 80px;float: left">
                 <el-option label="编号" value="1"></el-option>
                 <el-option label="姓名" value="2"></el-option>
                 <el-option label="简码" value="3"></el-option>
               </el-select>
               <el-input v-model="rbdp1.Customer" maxlength="20" placeholder="(长度1-30)" style="width: 180px;float: left"/>
             </el-form-item>
             <el-form-item label=""><el-button type="primary" size="small" class="cl-search" @click="searchFun1"><i class="icon iconfont">&#xe694;</i> 搜索</el-button></el-form-item>
           </el-form>
           <div class="cl-operation1 clearfix">
             <el-button type="primary" size="small" class="cl-search fr cl-color1" @click="setCustomData(1)"><i class="icon iconfont">&#xe678;</i> 表格自定义</el-button>
             <el-button type="success" size="small" class="cl-search fr" @click="exportExcel"><i class="icon iconfont">&#xe683;</i> 导出Excel</el-button>
           </div>
           <!--自定义组建 s-->
           <CustomTable ref="formChilds"></CustomTable>
           <!--自定义组建 e-->
           <!--列表组建 s-->
           <el-table id="table2" :data="tableData" :height="tableHeight" style="width: 100%" border @sort-change="sortChanges" @selection-change="handleSelectionChange1">
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
           </el-table>
           <pagination
             :total="total1"
             :page.sync="rbdp1.page"
             :limit.sync="rbdp1.limit"
             @pagination="searchFun1"/>
           <!--列表组建 e-->
           <div class="move_box" id="move_box1" @mouseover="getAnimate()">
             <h3>移动用户至表册</h3>
             <el-form>
               <el-form-item label="移动至表册序号:" label-width="115px">
                 <el-input v-model="movIn.MeterReaderOrderNum" maxlength="20" style="width: 65px;" size="small" onkeyup="value=value.replace(/\D/g,'')" ref="NumInput"/>
               </el-form-item>
               <el-form-item label="">
                 <el-radio-group v-model="movIn.Sort">
                   <el-radio label="T">前</el-radio>
                   <el-radio label="D">后</el-radio>
                 </el-radio-group>
               </el-form-item>
               <el-form-item style="text-align: center">
                 <el-button type="primary" size="small" @click="submitFun(1)">确认</el-button>
                 <el-button size="small" @click="cancelFun(1)">取消</el-button>
               </el-form-item>
             </el-form>
           </div>
           <span class="telescopic telescopic1" @click="getUp">收起</span>
        </div>
      </div>
      <div :class="!ifShow ? 'schedule_box allWidth' : 'schedule_box'">
        <h2>表册</h2>
        <div class="forms_box">
          <el-form
            :inline="true"
            :model="rbdp"
            class="head-search-form form-inline-small-input"
            size="small"
            label-width="100px">
            <el-form-item label="水厂：">
              <el-select v-model="rbdp.SA_WaterFactory_Id" placeholder="请选择" size="small" @change="getMeterRead">
                <el-option v-for="(item,index) in waterFactory" :key="index" :label="item.Name" :value="item.Id" />
              </el-select>
            </el-form-item>
            <el-form-item label="抄表员：">
              <el-select v-model="rbdp.MeterReaderId" placeholder="请选择" size="small" @change="getMeterForm">
                <el-option label="全部" value="-1"></el-option>
                <el-option v-for="(item,index) in meterArry" :key="index" :label="item.Name" :value="item.Id" />
              </el-select>
            </el-form-item>
            <el-form-item  label="用户：">
              <el-select v-model="rbdp.ecqt" placeholder="请选择" style="width: 80px;float: left">
                <el-option label="编号" value="1"></el-option>
                <el-option label="姓名" value="2"></el-option>
                <el-option label="简码" value="3"></el-option>
              </el-select>
              <el-input v-model="rbdp.Customer" maxlength="20" placeholder="(长度1-30)" style="width: 180px;float: left"/>
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
            <el-button type="primary" size="small" class="cl-search fr cl-color1" @click="setCustomData(2)"><i class="icon iconfont">&#xe678;</i> 表格自定义</el-button>
            <el-button type="success" size="small" class="cl-search fr" @click="exportExcel"><i class="icon iconfont">&#xe683;</i> 导出Excel</el-button>
          </div>
          <!--自定义组建 s-->
          <CustomTable ref="formChilds2"></CustomTable>
          <!--自定义组建 e-->
          <!--列表组建 s-->
          <el-table id="table3" :data="tableData2" :height="tableHeight3" style="width: 100%" border @selection-change="handleSelectionChange">
            <el-table-column
              fixed="left"
              align="center"
              type="selection"
              width="40">
            </el-table-column>
            <template v-for="(item ,index) in tableHead2" >
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
          <div class="move_box">
            <h3 @click="submitFun(2)">移动用户至临时表册</h3>
          </div>
          <span class="telescopic telescopic2" @click="getUp" v-show="!ifShow">展开</span>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeFun" size="small">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { RegisterDetailGetList, GetOrientationList, GetDefaultList, RegisterMoveOut, RegisterMoveIn, ComboBoxListByMeterReader, SortRegisterBookDetailMove, GetList_Execl } from "@/api/registerBook"
  import CustomTable from '@/components/CustomTable/index'//自定义组建
  import Pagination from '@/components/Pagination/index'//分页
  import { getDictionaryOption } from "@/utils/permission"
  import { promptInfoFun } from "@/utils/index"

  export default {
    name: "Schedule",
    components: { CustomTable, Pagination },
    data() {
      return {
        ceshi:'',//区域待完善
        dialogVisible: false,
        operatorArray:[],//区域待完善
        rbdp:{//表册
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
        rbdp1: {//临时表册参数
          limit: 10,
          page: 1,
          sort: "",
          filed: "",
          tableId: "0000010",
          ecqt: "1",
          Customer: "",
          SA_WaterFactory_Id: "",
          SA_RegisterBookInfo_Id: "0",
          MeterReaderId: "",
          BookTypeKey: "",
          SA_UserArea_Id: ""
        },
        total:0,
        total1:0,
        tableData:[],
        tableData2:[],
        customHeight:'',
        customHeight2:'',
        tableHeight:null,
        tableHeight3:null,
        checksData: [],
        checksData2: [],
        waterFactory:[],//水厂集合
        meterArry:[],//抄表员集合
        waterTypeArry:[],//水表类型
        formsArry:[],//表册集合
        ifShow:true,
        movIn: {//移入表册
          rbdList: [],//移入数据集合
          MeterReaderOrderNum: "0",//指定序号
          RegisterBookInfo_Id: "",//移动到的表格
          Sort: "T"//前为T(上) 或后者 D(下)
        },
        rbdList:[],//移出
      }
    },
    methods: {
      getUp(){//收缩功能
        this.ifShow = !this.ifShow
        if(!this.ifShow){
          document.getElementById('myform').classList.add('none')
        }else {
          setTimeout(()=>{
            document.getElementById('myform').classList.remove('none')
          },200)
        }
      },
      setCustomData(type) {//表格自定义方法
        if(type==1){
          this.$refs.formChilds.isCustom = !this.$refs.formChilds.isCustom
          this.customHeight = this.$refs.formChilds.isCustom
        }else{
          this.$refs.formChilds2.isCustom = !this.$refs.formChilds2.isCustom
          this.customHeight2 = this.$refs.formChilds2.isCustom
        }
      },
      sortChanges({prop, order }){//临时表册排序
        this.rbdp1.filed = prop
        this.rbdp1.sort=order=='ascending'?'ASC':(order=='descending'?'DESC':'')
        if(this.tableData.length>0){
          this.rbdp1.page = 1
          this.searchFun1()
        }
      },
      handleSelectionChange(val){//表册移交
        this.rbdList = val
      },
      handleSelectionChange1(val){//临时表册移交
        this.movIn.rbdList = val
      },
      exportExcel(){//导出
        GetList_Execl().then(res => {})
      },
      searchFun(){//获取表册集合
        RegisterDetailGetList(this.rbdp).then(res => {
          if (res.code ==0 ) {
              this.movIn.RegisterBookInfo_Id = this.rbdp.SA_RegisterBookInfo_Id//确认查询之后再保存当前表册ID，供表册移交使用
              this.tableData2 = res.data.rbdList
              this.total = res.count
          } else {
            promptInfoFun(this,1,res.message)
          }
        })
      },
      searchFun1(){//获取临时表册信息
        let rbdp = this.rbdp1
        GetDefaultList(rbdp).then(res => {
          if (res.code ==0 ) {
               this.tableData = res.data
               this.total1 = res.count
          } else {
            promptInfoFun(this,1,res.message)
          }
        })
      },
      getTableInfo(){//获取表头信息
        let _this = this
        _this.$nextTick(()=>{
          _this.$refs.formChilds.GetTable('0000010');//临时表册
          _this.checksData = this.$refs.formChilds.checkData//获取自定义字段中选中了字段

          _this.$refs.formChilds2.GetTable('0000011');//表册
          _this.checksData2 = this.$refs.formChilds2.checkData//获取自定义字段中选中了字段
          this.tableHeight = document.documentElement.clientHeight - document.getElementById('table2').offsetTop - 235
          this.tableHeight3 = document.documentElement.clientHeight - document.getElementById('table3').offsetTop - 235
        })
      },
      getAnimate(){//动画
        document.getElementById('move_box1').classList.add('on')
      },
      submitFun(type){//确认移交
        if(type==1){//移入
          if(this.movIn.RegisterBookInfo_Id == ''|| this.movIn.RegisterBookInfo_Id == '-1'){//判断是否选择右侧表册
            promptInfoFun(this,1,'请选择右侧表册查询后操作！')
            return
          }else if(this.movIn.rbdList.length<=0){
            promptInfoFun(this,1,'请选择需要移入数据！')
            return
          }else if(JSON.stringify(this.movIn.MeterReaderOrderNum) == ''){
            promptInfoFun(this,1,'请填写移动至表册序号！')
            this.$refs.NumInput.$el.querySelector('input').focus();
            return
          }
          document.getElementById('move_box1').classList.remove('on')
          RegisterMoveIn(this.movIn).then(res => {
            if (res.code ==0 ) {
              promptInfoFun(this,2,res.message)
              this.searchFun()
              this.searchFun1()
            } else {
              promptInfoFun(this,1,res.message)
            }
          })
        }else {//移出
          if(this.rbdList.length <=0){
            promptInfoFun(this,1,"请选择需要移入数据！")
          }else {
            RegisterMoveOut(this.rbdList).then(res => {
              if (res.code ==0 ) {
                promptInfoFun(this,2,res.message)
                this.searchFun()
                this.searchFun1()
              } else {
                promptInfoFun(this,1,res.message)
              }
            })
          }
        }
      },
      cancelFun(type){//取消移交
        if(type==1)
          document.getElementById('move_box1').classList.remove('on')
      },
      closeFun(){//弹窗关闭
        this.dialogVisible = false
        document.getElementById('move_box1').classList.remove('on')
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
          this.tableHeight = document.documentElement.clientHeight - document.getElementById('table2').offsetTop - 235
        })
      },
      customHeight2() {//获取自定义模块高度右侧
        let self = this
        self.$nextTick(() => {//右侧列表高度
          this.tableHeight3 = document.documentElement.clientHeight - document.getElementById('table3').offsetTop - 235
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
      },
      tableHead2: function() {//获取右侧表头信息
        const arrayHead = []
        const data = this.checksData2
        for (let i = 0; i < data.length; i++) { // 过滤选中列
          if (data[i].IsCheck) {
            arrayHead.push(data[i])
          }
        }
        return arrayHead
      }
    },
    mounted() {
      this.waterTypeArry = getDictionaryOption('水表类型')
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
      background: #fff;position: relative;padding: 25px 20px 0 20px;
    }
    .move_box{
      background: #F5F5F5;width: 230px;position: absolute;top: -40px;left: 50%;margin-left: -115px;padding: 0 28px 15px 28px;box-shadow: 1px 1px 5px #ddd;border-bottom-left-radius: 15px;
      border-bottom-right-radius: 15px;height: 48px;overflow: hidden;cursor: pointer;
      h3{font: normal 16px/15px 'Microsoft YaHei';color: #46494C;text-align: center;}
      .el-radio{display: block;margin-bottom: 13px;}
      .el-form-item { margin-bottom: 0;}
    }
    .telescopic{position: absolute;display: block;top:30%;color: #777C82;font: normal 16px 'Microsoft YaHei';width: 30px;margin: 0 auto;word-wrap: break-word;
      -webkit-box-shadow: 1px 1px 5px #cecece;background: #fff;padding: 15px 0;z-index: 999;text-align: center;cursor: pointer;
      box-shadow: 1px 1px 5px #cecece;
   }
    #table3 th{padding: 9px 0;}
    .telescopic1{
      right: 0;
      border-bottom-left-radius: 15px;
      border-top-left-radius: 15px;
    }
    .telescopic2{
      left: 0;top: 23%;
      border-bottom-right-radius: 15px;
      border-top-right-radius: 15px;
    }
    .on{
      animation:move .5s;
      -webkit-animation:move .5s;
      animation-fill-mode:forwards;
      -webkit-animation-fill-mode:forwards
    }
    @keyframes move{
      0%{height:48px;}
      100%{height:192px;}
    }
    @-webkit-keyframes move{
      0%{height:48px;}
      100%{height:192px;}
    }

    .none {display: none}
    .schedule_sidebox{padding: 0 18px}
    .schedule_box{width: 50%;float: left;box-sizing: border-box;overflow: hidden;transition:width .2s;-webkit-transition:width .2s; }
    .schedule_box:last-child{padding-left: 18px;box-sizing: border-box}
    .hide{
      width: 0;
    }
    .allWidth{
      width: 100%;
      padding-left: 0 !important;
    }
  }
</style>
