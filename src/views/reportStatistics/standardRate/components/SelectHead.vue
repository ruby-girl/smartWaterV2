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
      <el-select v-model="param.WaterFactoryId" placeholder="请选择" size="small" @change="GetNameList">
        <el-option v-for="(item,index) in waterFactory" :key="index" :label="item.Name" :value="item.Id"/>
      </el-select>
    </el-form-item>
    <el-form-item label="抄表计划" prop="MeterReadPlanId">
      <el-select v-model="param.MeterReadPlanId" placeholder="请选择" size="small" @change="getCbyInfo">
        <el-option-group
          v-for="group in planArry"
          :key="group.Year"
          :label="group.Year">
          <el-option
            v-for="item in group.Plans"
            :key="item.Id"
            :label="item.Name"
            :value="item.Id">
          </el-option>
        </el-option-group>
      </el-select>
    </el-form-item>
    <el-form-item label="抄表员" prop="MeterReadUserId">
      <el-select v-model="param.MeterReadUserId" placeholder="请选择" size="small"  @change="getText(param.MeterReadUserId,'MeterReadUserId',peopleArray,'抄表员')">
        <el-option label="全部" value="-1" v-if="peopleArray.length>1"></el-option>
        <el-option v-for="(item,index) in peopleArray" :key="index" :label="item.Name" :value="item.Id"/>
      </el-select>
    </el-form-item>
    <transition name="fade">
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
    </transition>
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
      /**
       * 获取操作人信息.及抄表员信息
       * */
      GetNameList(val) {
        this.getText(this.param.WaterFactoryId,'WaterFactoryId',this.waterFactory,'水厂')
        QueryMeterReadPlanByFactoryId({'SA_WaterFactory_Id':val}).then(res => {
          if (res.code ==0 ) {
            res.data.forEach(item=>{
              this.planInfoData = this.planInfoData.concat(item.Plans)
            })
            this.planArry = res.data;
            this.param.MeterReadPlanId = res.data[0].Plans[0].Id
            this.getCbyInfo(res.data[0].Plans[0].Id)//搜索默认抄表计划
          }
        })
      },
      getCbyInfo(id){
        LoadRegisterBookAndMeterReader({'MeterReadPlanId' : id}).then(res => {
          if (res.code ==0 ) {
            this.getText(id,'MeterReadPlanId',this.planInfoData,'抄表计划')
            this.peopleArray = res.data.MeterReaders;
            this.peopleArray.length > 1 ? this.param.MeterReadUserId = '-1' : this.param.MeterReadUserId = this.peopleArray[0].Id
          } else {
            promptInfoFun(this,1,res.message)
          }
        })
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
      this.GetNameList(this.waterFactory[0].Id)
    }
  }
</script>
