<template>
  <el-dialog
    class="forms_dialog"
    :close-on-click-modal="false"
    top="5vh"
    :visible.sync="dialogVisible"
    width="95%">
    <el-row :gutter="18">
      <el-col :span="12">
        <h2>临时表册</h2>
        <div class="forms_box">
           <el-form
             :inline="true"
             :model="rbdp"
             class="head-search-form form-inline-small-input"
             size="small"
             label-width="100px">
             <el-form-item label="水厂：">
               <el-select v-model="rbdp.SA_WaterFactory_Id" placeholder="请选择" size="small">
                 <el-option v-for="(item,index) in waterFactory" :key="index" :label="item.Name" :value="item.Id" />
               </el-select>
             </el-form-item>
             <el-form-item label="所属区域：">
               <el-select v-model="rbdp.sA_UserArea_Id" placeholder="请选择" size="small">
                 <el-option label="全部" value="-1"></el-option>
                 <el-option v-for="(item,index) in operatorArray" :key="index" :label="item.Name" :value="item.Id" />
               </el-select>
             </el-form-item>
             <el-form-item label="水表类型：">
               <el-select v-model="rbdp.BookTypeKey" placeholder="请选择" size="small">
                 <el-option label="全部" value="-1"></el-option>
                 <el-option v-for="(item,index) in waterTypeArry" :key="index" :label="item.Name" :value="item.Id" />
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
             <el-form-item label=""><el-button type="primary" size="small" class="cl-search" @click="searchFun"><i class="icon iconfont">&#xe694;</i> 搜索</el-button></el-form-item>
           </el-form>
           <div class="cl-operation1 clearfix">
             <el-button type="primary" size="small" class="cl-search fr cl-color1" @click="setCustomData(1)"><i class="icon iconfont">&#xe678;</i> 表格自定义</el-button>
             <el-button type="success" size="small" class="cl-search fr" @click="exportExcel"><i class="icon iconfont">&#xe683;</i> 导出Excel</el-button>
           </div>
           <!--自定义组建 s-->
           <CustomTable ref="formChilds"></CustomTable>
           <!--自定义组建 e-->
           <!--列表组建 s-->
           <el-table id="table2" :data="tableData" :height="tableHeight" style="width: 100%" border @sort-change="sortChanges">
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
           </el-table>
           <pagination
             v-show="total>0"
             :total="total"
             :page.sync="rbdp.page"
             :limit.sync="rbdp.limit"
             @pagination="searchFun"/>
           <!--列表组建 e-->
           <div class="move_box" id="move_box1" @mouseover="getAnimate(1)">
             <h3>移动用户至表册</h3>
             <el-form>
               <el-form-item label="移动至表册序号:" label-width="115px">
                 <el-input v-model="dialogVisible" maxlength="20" style="width: 65px;" size="small"/>
               </el-form-item>
               <el-form-item label="">
                 <el-radio-group v-model="dialogVisible">
                   <el-radio label="前"></el-radio>
                   <el-radio label="后"></el-radio>
                 </el-radio-group>
               </el-form-item>
               <el-form-item style="text-align: center">
                 <el-button type="primary" size="small" @click="submitFun(1)">确认</el-button>
                 <el-button size="small" @click="cancelFun(1)">取消</el-button>
               </el-form-item>
             </el-form>
           </div>
         </div>
      </el-col>
      <el-col :span="12">
        <h2>表册</h2>
        <div class="forms_box">
          <el-form
            :inline="true"
            :model="rbdp"
            class="head-search-form form-inline-small-input"
            size="small"
            label-width="100px"
            @submit.native.prevent>
            <el-form-item label="水厂：">
              <el-select v-model="rbdp.SA_WaterFactory_Id" placeholder="请选择" size="small"  @keyup.enter.native="">
                <el-option v-for="(item,index) in waterFactory" :key="index" :label="item.Name" :value="item.Id" />
              </el-select>
            </el-form-item>
            <el-form-item label="抄表员：">
              <el-select v-model="rbdp.meterReaderId" placeholder="请选择" size="small"  @keyup.enter.native="">
                <el-option label="全部" value="-1"></el-option>
                <el-option v-for="(item,index) in operatorArray" :key="index" :label="item.Name" :value="item.Id" />
              </el-select>
            </el-form-item>
            <el-form-item  label="用户：">
              <el-select v-model="rbdp.ecqt" placeholder="请选择" style="width: 80px;float: left">
                <el-option label="编号" value="1"></el-option>
                <el-option label="姓名" value="2"></el-option>
                <el-option label="简码" value="3"></el-option>
              </el-select>
              <el-input v-model="rbdp.Customer" maxlength="20" placeholder="(长度1-30)" @keyup.enter.native="" style="width: 180px;float: left"/>
            </el-form-item>
            <el-form-item label="表册：">
              <el-select v-model="rbdp.ComboBoxListByWaterFactory" placeholder="请选择" size="small"  @keyup.enter.native="">
                <el-option label="全部" value="-1"></el-option>
                <el-option v-for="(item,index) in operatorArray" :key="index" :label="item.Name" :value="item.Id" />
              </el-select>
            </el-form-item>
            <el-form-item label=""><el-button type="primary" size="small" class="cl-search" @click=""><i class="icon iconfont">&#xe694;</i> 搜索</el-button></el-form-item>
          </el-form>
          <div class="cl-operation1 clearfix">
            <el-button type="primary" size="small" class="cl-search fr cl-color1" @click="setCustomData(2)"><i class="icon iconfont">&#xe678;</i> 表格自定义</el-button>
            <el-button type="success" size="small" class="cl-search fr" @click="exportExcel"><i class="icon iconfont">&#xe683;</i> 导出Excel</el-button>
          </div>
          <!--自定义组建 s-->
          <CustomTable ref="formChilds2"></CustomTable>
          <!--自定义组建 e-->
          <!--列表组建 s-->
          <el-table id="table3" :data="tableData2" :height="tableHeight3" style="width: 100%" border @sort-change="sortChanges">
            <el-table-column
              type="index"
              label="序号"
              width="80"
              align="center"
              fixed="left"/>
            <template v-for="(item ,index) in tableHead2" >
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
            v-show="total>0"
            :total="total"
            :page.sync="rbdp.page"
            :limit.sync="rbdp.limit"
            @pagination="searchFun"/>
          <!--列表组建 e-->
          <div class="move_box" id="move_box2" @mouseover="getAnimate(2)">
            <h3>移动用户至临时表册</h3>
            <el-form>
              <el-form-item label="移动至表册序号:" label-width="115px">
                <el-input v-model="dialogVisible" maxlength="20" style="width: 65px;" size="small"/>
              </el-form-item>
              <el-form-item label="">
                <el-radio-group v-model="dialogVisible">
                  <el-radio label="前"></el-radio>
                  <el-radio label="后"></el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item style="text-align: center">
                <el-button type="primary" size="small" @click="submitFun(2)">确认</el-button>
                <el-button size="small" @click="cancelFun(2)">取消</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false" size="small">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { RegisterDetailGetList } from "@/api/registerBook"
  import CustomTable from '@/components/CustomTable/index'//自定义组建
  import Pagination from '@/components/Pagination/index'//分页

  /*0000010  0000011*/
  export default {
    name: "Schedule",
    components: { CustomTable, Pagination },
    data() {
      return {
        dialogVisible: false,
        operatorArray:[],
        rbdp:{
          SA_WaterFactory_Id:'',//水厂
          sA_UserArea_Id:'-1',//区域
          BookTypeKey:'-1',//水表类型
          ecqt:'',//用户类型
          Customer:'',//用户value
          meterReaderId:'-1',//抄表员
          ComboBoxListByWaterFactory:'-1',//表册
          limit: 0,
          page: 0,
          sort: "",
          filed: "",
          tableId: ""
        },
        total:0,
        tableData:[],
        tableData2:[],
        customHeight:'',
        customHeight2:'',
        tableHeight:null,
        tableHeight3:null,
        checksData: [],
        checksData2: [],
        waterFactory:[],//水厂集合
        waterTypeArry:[]
      }
    },
    methods: {
      setCustomData(type) {//表格自定义方法
        if(type==1){
          this.$refs.formChilds.isCustom = !this.$refs.formChilds.isCustom
          this.customHeight = this.$refs.formChilds.isCustom
        }else{
          this.$refs.formChilds2.isCustom = !this.$refs.formChilds2.isCustom
          this.customHeight2 = this.$refs.formChilds2.isCustom
        }
      },
      sortChanges({prop, order }){//排序
        this.rbdp.filed = prop
        this.rbdp.sort=order=='ascending'?'ASC':(order=='descending'?'DESC':'')
        if(this.tableData.length>0){
          this.rbdp.page = 1
          this.searchFun()
        }
      },
      exportExcel(){},
      searchFun(){},
      getTableInfo(){
        let _this = this
        _this.$nextTick(()=>{
          _this.$refs.formChilds.GetTable('0000010');//临时表册
          _this.checksData = this.$refs.formChilds.checkData//获取自定义字段中选中了字段
          _this.$refs.formChilds2.GetTable('0000011');//表册
          _this.checksData2 = this.$refs.formChilds2.checkData//获取自定义字段中选中了字段
          this.tableHeight = document.documentElement.clientHeight - document.getElementById('table2').offsetTop - 200
          this.tableHeight3 = document.documentElement.clientHeight - document.getElementById('table3').offsetTop - 200
        })
      },
      getAnimate(type){//动画
        type==1 ? document.getElementById('move_box1').classList.add('on') : document.getElementById('move_box2').classList.add('on')
      },
      submitFun(type){//确认移交
        type==1 ? document.getElementById('move_box1').classList.remove('on') : document.getElementById('move_box2').classList.remove('on')
      },
      cancelFun(type){//取消移交
        type==1 ? document.getElementById('move_box1').classList.remove('on') : document.getElementById('move_box2').classList.remove('on')
      }
    },
    watch: {
      customHeight() {//获取自定义模块高度左侧
        let self = this
        self.$nextTick(() => {//左侧列表高度
          this.tableHeight = document.documentElement.clientHeight - document.getElementById('table2').offsetTop - 200
        })
      },
      customHeight2() {//获取自定义模块高度右侧
        let self = this
        self.$nextTick(() => {//右侧列表高度
          this.tableHeight3 = document.documentElement.clientHeight - document.getElementById('table3').offsetTop - 200
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
    .el-dialog__body{background: #EBEBEB;padding: 18px;}
    .el-dialog__footer{background: #EBEBEB;padding: 0 0 10px 0;}
    h2{margin: 0 0 0 0;font: normal 14px/40px 'Microsoft YaHei';background: #006663;color: #fff;padding: 0 30px}
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
  }
</style>
