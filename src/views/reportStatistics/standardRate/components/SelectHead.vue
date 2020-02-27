<template>
  <el-form
    ref="formName"
    :inline="true"
    :model="param"
    :class="ifMore?'head-search-form form-inline-small-input search-head-otherbox on':'head-search-form form-inline-small-input search-head-otherbox'"
    size="small"
    label-width="90px"
    @submit.native.prevent>
    <!--不支持查看全部水厂 根据权限展示水厂-->
    <el-form-item label="水厂" prop="WaterFactoryId" style="margin-left: -60px">
      <el-select v-model="param.WaterFactoryId" placeholder="请选择" size="small" @change="getText(param.WaterFactoryId,'WaterFactoryId',waterFactory,'水厂')">
        <el-option v-for="(item,index) in waterFactory" :key="index" :label="item.Name" :value="item.Id"/>
      </el-select>
    </el-form-item>
      <el-form-item label="抄表计划日期" prop="createStartTimes" v-show="screenWdth<1600?ifMore:true">
        <el-date-picker
          :editable="false"
          @keydown.enter.native="searchFun"
          v-model="createStartTimes"
          :unlink-panels="true"
          size="small"
          type="monthrange"
          value-format ="yyyy-MM"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="getTime1"
        />
      </el-form-item>
    <el-form-item label="">
      <i v-show="screenWdth<1600&&ifMore" class="icon iconfont iconshouqi3" @click="ifMore=!ifMore"></i>
      <i v-show="screenWdth<1600&&!ifMore" class="icon iconfont iconjianqu3" @click="ifMore=!ifMore"></i>
      <el-button type="primary" size="mini" @click="searchFun" round><i class="icon iconfont">&#xe694;</i>查询</el-button>
      <el-button round size="mini" class="cl-reset" @click="resetFun('formName')"><i class="icon iconfont">&#xe64e;</i>重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import { QueryMeterReadPlanByFactoryId } from "@/api/plan"
  import { LoadRegisterBookAndMeterReader} from "@/api/meterReading"
  import { promptInfoFun } from "@/utils/index"

  export default {
    name: "SelectHead",
    data() {
      return {
        waterFactory:[],
        planArry:[],
        peopleArray:[],
        ifMore:false,
        param:{
          WaterFactoryId: "",
          WaterFactoryName: "",
          MeterReadPlanId: "",
          MeterReadPlanName: "",
          MeterReadUserId: "",
          MeterReadUserName: "",
          PlanStartTime: "",
          PlanEndTime: "",
          createUserId: "",
          createStartTime: "",
          createEndTime: "",
          editUserId: "",
          editStartTime: "",
          editEndTime: "",
          limit: 10,
          page: 1,
          sort: "",
          filed: "",
          tableId: "0000068"
        },
        createStartTimes:[],
        screenWdth:'',
        planInfoData:[]
      }
    },
    methods: {
      /**
       * 触发父组建查询方法
       * */
      searchFun(){
        this.$parent.param = Object.assign({},this.param)
        this.$parent.searchFun();
      },
      getTime1(data) {
        this.getText(this.createStartTimes,'createStartTimes','','抄表计划日期')
        if(data !=null){
          this.param.PlanStartTime = data[0]
          this.param.PlanEndTime = data[1]
        }else{
          this.param.PlanStartTime = ''
          this.param.PlanEndTime = ''
        }
      },
      getText(val, model, arr, name) {
        this.$parent.getText(val, model, arr, name)
      },
      resetFun(formName){
        this.$refs[formName].resetFields();
        this.param.PlanStartTime = ''
        this.param.PlanEndTime = ''
        this.createStartTimes = []
        this.$parent.tipsDataCopy = []
        this.searchFun()
      }
    },
    mounted() {
      this.screenWdth = window.screen.width
      this.waterFactory = this.$store.state.user.waterWorks
      this.param.WaterFactoryId = this.waterFactory[0].Id
    }
  }
</script>
