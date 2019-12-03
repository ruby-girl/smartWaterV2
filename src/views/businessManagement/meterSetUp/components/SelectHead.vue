<template>
  <div>
    <el-form
      :inline="true"
      :model="param"
      class="head-search-form form-inline-small-input"
      size="small"
      label-width="100px"
      @submit.native.prevent>
      <el-form-item label="抄表计划：">
        <el-select v-model="param.SA_MeterReadPlan_Id" placeholder="请选择" size="small" @change="getUserInfo">
          <el-option v-for="(item,index) in planArray" :key="index" :label="item.Name" :value="item.Id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="抄表员：">
        <el-select v-model="param.SA_MeterReader_Id" placeholder="请选择" size="small">
          <el-option label="全部" value="-1" v-if="peopleArray.length>1"></el-option>
          <el-option v-for="(item,index) in peopleArray" :key="index" :label="item.Name" :value="item.Id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="表册：">
        <el-select v-model="param.SA_RegisterBookInfo_Id" placeholder="请选择" size="small">
          <el-option label="全部" value="-1" v-if="formsArray.length>1"></el-option>
          <el-option v-for="(item,index) in formsArray" :key="index" :label="item.Name" :value="item.Id"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="param.CustomerQueryType" placeholder="请选择" class="user-select-box" style="width: 100px;float: left;margin-left: 30px">
          <el-option label="编号" value="1"></el-option>
          <el-option label="姓名/简码" value="2"></el-option>
        </el-select>
        <el-input v-model="param.CustomerQueryValue" maxlength="20" placeholder="(长度1-30)" style="width: 180px;float: left"/>
      </el-form-item>
      <el-form-item label="抄表状态：">
        <el-select v-model="param.MeterReadState" placeholder="请选择" size="small">
          <el-option label="全部" value="-1"></el-option>
          <el-option v-for="(item,index) in meterState" :key="index" :label="item.Name" :value="item.Id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" size="mini" class="cl-search" @click="searchFun"><i class="icon iconfont">&#xe694;</i>搜索</el-button>
      </el-form-item>
      <el-button type="primary" size="mini" class="cl-search fr cl-color1" @click="setCustomData()"><i class="icon iconfont">&#xe678;</i> 表格自定义</el-button>
    </el-form>

    <!--多用户弹窗 s-->
    <el-dialog
      :close-on-click-modal="false"
      top="25vh"
      title="多用户表册信息"
      :visible.sync="meterVisible"
      class="my_header"
      width="600px">
      <el-table :data="meterData" border @row-click="getCurMeter" height="300">
        <el-table-column type="index" width="150" align="center" label="序号"></el-table-column>
        <el-table-column property="Name" align="center" label="表册名称"></el-table-column>
      </el-table>
    </el-dialog>
    <!--多用户弹窗 e-->
  </div>
</template>
<script>
  import { getPlan, LoadRegisterBookAndMeterReader, MeterReadingLocationQuery } from "@/api/meterReading"
  import { getDictionaryOption } from "@/utils/permission"
  import { promptInfoFun } from "@/utils/index"

  import Bus from '@/utils/bus'
  export default {
    name: "SelectHead",
    data() {
      return {
        meterVisible: false,
        planArray:[],//抄表计划
        peopleArray:[],//抄表员
        formsArray:[],//表册
        meterState:[],//抄表状态
        param:{//分页搜索条件
          page: 1,
          limit: 10,
          filed: '',
          sort: "",
          SA_MeterReadPlan_Id: '',//抄表计划ID
          SA_MeterReader_Id: '',//抄表员ID
          SA_RegisterBookInfo_Id: '',//表册ID
          CustomerQueryType: '1',//用户类型
          CustomerQueryValue: '',//用户类型数值
          MeterReadState: '-1',//抄表状态
          tableId: '0000014'
        },
        meterData:[]//表册定位模拟数据
      }
    },
    methods: {
      getplanArray() {//获取抄表计划下拉数据集合
        getPlan().then(res => {
          if (res.code ==0 ) {
            this.planArray = res.data;
            if (res.data.length > 1) {
              this.param.SA_MeterReadPlan_Id = res.data[0].Id
              this.getUserInfo(res.data[0].Id)
            }
          } else {
            promptInfoFun(this,1,res.message)
          }
        })
      },
      getUserInfo(val){//表册抄表员与抄表计划联动搜索
        let selectedWorkName = {}
        selectedWorkName = this.planArray.find((item)=>{
          return item.Id === val;
        });
        Bus.$emit('planName', selectedWorkName)//给兄弟组件传值

        LoadRegisterBookAndMeterReader({'MeterReadPlanId':val}).then(res => {
          if (res.code ==0 ) {
            this.peopleArray = res.data.MeterReaders;//抄表员
            this.formsArray = res.data.RegisterBooks;//表册
            this.param.SA_MeterReader_Id = '-1'//默认选中第一个
            this.param.SA_RegisterBookInfo_Id = res.data.RegisterBooks[0].Id
          } else {
            promptInfoFun(this,1,res.message)
          }
        })
      },
      setCustomData() {//表格自定义
        this.$parent.setCustomData()
      },
      /**
       * 触发父组建搜索方法
       * */
      searchFun(){
        this.$parent.param =  Object.assign({},this.param)
        let id = this.param.SA_MeterReadPlan_Id,
          type = this.param.CustomerQueryType,
          value = this.param.CustomerQueryValue;
        if(value!=''){
          MeterReadingLocationQuery({'SA_MeterReadPlan_Id':id,'CustomerQueryType':type,'CustomerQueryValue':value}).then(res => {//先进行表册定位
            if (res.code == 0 ) {
              if(res.data.length <=0 ){//没有该人员信息
                promptInfoFun(this,1,'未搜索到数据')
              }else if(res.data.length ==1){//此时有一条数据默认覆盖当前表册
                this.param.SA_RegisterBookInfo_Id = res.data[0].Id
                this.$parent.searchFun();
              }else{//此时有一条以上数据，需手动选择后确认表册信息
                this.meterData = res.data
                this.meterVisible = true
              }
            }
          })
        }else{
          this.$parent.searchFun();
        }
      },
      getCurMeter(row){//多表册手动选择
        this.param.SA_RegisterBookInfo_Id = row.Id
        this.meterVisible = false
        this.$parent.searchFun();
      }
    },
    mounted() {
      this.getplanArray()
      this.meterState = getDictionaryOption('抄表状态')
    }
  }
</script>
