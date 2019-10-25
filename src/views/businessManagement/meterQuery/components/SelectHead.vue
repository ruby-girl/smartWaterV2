<template>
  <div>
    <el-radio-group v-model="typeCheck" class="typeCheck" @change="setparams">
      <el-radio :label="1">按抄表计划查询</el-radio>
      <el-radio :label="2">按抄表日期查询</el-radio>
    </el-radio-group>
    <el-form
      :inline="true"
      :model="param"
      class="head-search-form form-inline-small-input"
      size="small"
      label-width="100px"
      @submit.native.prevent>
          <el-form-item label="水厂：">
            <el-select v-model="param.SA_WaterFactory_Id" placeholder="请选择" size="small" @change="getPlanList">
              <el-option label="全部" value="-1"></el-option>
              <el-option v-for="(item,index) in waterFactory" :key="index" :label="item.Name" :value="item.Id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="抄表计划：" v-show="typeCheck==1">
            <el-select v-model="param.SA_MeterReadPlan_Id" placeholder="请选择" size="small" @change="getCbyInfo">
              <el-option v-for="(item,index) in planArry" :key="index" :label="item.Name" :value="item.Id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="抄表员：">
            <el-select v-model="param.SA_MeterReader_Id" placeholder="请选择" size="small">
              <el-option label="全部" value="-1"></el-option>
              <el-option v-for="(item,index) in meterArry" :key="index" :label="item.Name" :value="item.Id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="抄表状态：">
            <el-select v-model="param.MeterReadState" placeholder="请选择" size="small">
              <el-option label="全部" value="-1"></el-option>
              <el-option v-for="(item,index) in meterState" :key="index" :label="item.Name" :value="item.Id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="表册：">
            <el-select v-model="param.SA_RegisterBookInfo_Id" placeholder="请选择" size="small">
              <el-option label="全部" value="-1"></el-option>
              <el-option v-for="(item,index) in formArry" :key="index" :label="item.Name" :value="item.Id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="抄表日期：" v-show="typeCheck==2">
            <el-date-picker
              v-model="meterData"
              type="datetimerange"
              :editable="false"
              :unlink-panels="true"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              @keydown.enter.native="handleFilter"
              @change="getTime"
            />
          </el-form-item>
          <el-form-item label="用户：">
            <el-select v-model="param.CustomerQueryType" placeholder="请选择" style="width: 80px;float: left">
              <el-option label="编号" value="1"></el-option>
              <el-option label="姓名" value="2"></el-option>
              <el-option label="简码" value="3"></el-option>
            </el-select>
            <el-input v-model="param.CustomerQueryValue" maxlength="20" placeholder="(长度1-10)"
                      style="width: 180px;float: left"/>
          </el-form-item>
          <el-form-item label="用户类型：" v-show="ifMore">
            <el-select v-model="param.UserType" placeholder="请选择" size="small">
              <el-option label="全部" value="-1"></el-option>
              <el-option v-for="(item,index) in userArry" :key="index" :label="item.Name" :value="item.Id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="录入人：" v-show="ifMore">
            <el-input v-model="param.InputEmpName" maxlength="20" placeholder="请输入录入人"/>
          </el-form-item>
          <el-form-item label="录入日期：" v-show="ifMore">
            <el-date-picker
              v-model="InputData"
              type="datetimerange"
              :editable="false"
              :unlink-panels="true"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              @keydown.enter.native="handleFilter"
              @change="getTime1"
            />
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" size="small" class="cl-search" @click="searchFun"><i
              class="icon iconfont">&#xe694;</i>
              搜索
            </el-button>
            <i v-show="ifMore" class="icon iconfont getUpDown" @click="ifMore=!ifMore">收起 &#xe692;</i>
            <i v-show="!ifMore" class="icon iconfont getUpDown" @click="ifMore=!ifMore">展开 &#xe68f;</i>
          </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {getDictionaryOption} from "@/utils/permission"
  import { QueryMeterReadPlanByFactoryId } from "@/api/plan"
  import { WaterFactoryComboBoxListAuth } from "@/api/organize"//具有权限的水厂
  import { QueryMeterReaderByFactoryId } from "@/api/meterQuery" //抄表时间条件下，获取抄表员信息接口
  import { LoadRegisterBookAndMeterReader } from "@/api/meterReading"//抄表计划查询条件下，获取表册及抄表员接口
  import { promptInfoFun } from "@/utils/index"

  export default {
    name: "SelectHead",
    data() {
      return {
        typeCheck:1,
        ifMore: false,
        param: {},
        waterFactory: [],
        meterData: [],
        InputData:[],
        meterArry: [],//抄表员
        meterState:[],//抄表状态
        formArry: [],//表册类型
        userArry:[],//用户类型
        planArry:[],
      }
    },
    methods: {
      /**
       * 触发父组建查询方法
       * */
      searchFun() {
        this.ifMore ? this.InputData = this.InputData : this.InputData = []
        this.param.UserType = this.ifMore ? this.param.UserType : ''
        this.param.InputEmpName = this.ifMore ? this.param.InputEmpName : ''
        this.param.InputTimeStart = this.ifMore ? this.param.InputTimeStart : ''
        this.param.InputTimeEnd = this.ifMore ? this.param.InputTimeEnd : ''
        if(this.typeCheck==2&&this.meterData.length<=0){//当选择抄表日期类型时候，抄表日期为必填项
          promptInfoFun(this,1,'请选择抄表日期！')
          return
        }
        this.$parent.searchFun();
      },
      getTime() {
        const date = this.meterData;
        if (date) {
          this.param.ReadDateStart = date[0];
          this.param.ReadDateEnd = date[1];
        } else {
          this.param.ReadDateStart = "";
          this.param.ReadDateEnd = "";
        }
      },
      getTime1() {
        const date = this.InputData;
        if (date) {
          this.param.InputTimeStart = date[0];
          this.param.InputTimeEnd = date[1];
        } else {
          this.param.InputTimeStart = "";
          this.param.InputTimeEnd = "";
        }
      },
      getWaterFactoryList(){//  获取具有权限的水厂数据集合,若当前操作员没权限，则只显示当前所在水厂信息，待后期做
        WaterFactoryComboBoxListAuth().then(res => {
          if (res.code ==0 ) {
            this.waterFactory = res.data;
            this.getPlanList('-1');//默认查全部抄表计划
          } else {
            promptInfoFun(this,1,res.message)
          }
        })
      },
      getPlanList(id){//通过水厂获得抄表计划，或抄表员信息
        if(this.typeCheck==1){//计划
          QueryMeterReadPlanByFactoryId({SA_WaterFactory_Id:id}).then(res => {
            if (res.code ==0 ) {
              this.planArry = res.data;
              this.param.SA_MeterReadPlan_Id = res.data[0].Id
              this.getCbyInfo(res.data[0].Id)//查询默认抄表计划
            } else {
              promptInfoFun(this,1,res.message)
            }
          })
        }else {//抄表时间
          QueryMeterReaderByFactoryId({SA_WaterFactory_Id:id}).then(res => {
            if (res.code ==0 ) {
              this.meterArry = res.data.MeterReaders
              this.formArry = res.data.RegisterBooks
            } else {
              promptInfoFun(this,1,res.message)
            }
          })
        }
      },
      getCbyInfo(id){ //获取抄表员及表册联动信息，区分抄表计划及抄表日期
        LoadRegisterBookAndMeterReader({'MeterReadPlanId' : id}).then(res => {
          if (res.code ==0 ) {
            this.meterArry = res.data.MeterReaders
            this.formArry = res.data.RegisterBooks
          } else {
            promptInfoFun(this,1,res.message)
          }
        })
      },
      setparams(val){//根据查询方向判断查询条件值
        if(val == 1){
          this.meterData = ''
          this.param.ReadDateStart = ''
          this.param.ReadDateEnd = ''
          this.param.ReadingQueryType = '1'
        }else {
          this.param.SA_MeterReadPlan_Id = ''
          this.param.ReadingQueryType = '2'
        }
        this.getPlanList('-1');//默认查全部抄表计划
      }
    },
    mounted() {
      this.param = this.$parent.param;//从父组件获取初始化查询参数
      this.formArry = getDictionaryOption('表册类型')
      this.meterState = getDictionaryOption('抄表状态')
      this.userArry = getDictionaryOption('用户类型')
      this.getWaterFactoryList()
    }
  }
</script>
