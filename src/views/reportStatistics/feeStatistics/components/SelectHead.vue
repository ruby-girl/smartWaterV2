<template>
  <el-form
    ref="formName"
    :inline="true"
    :model="param"
    :class="ifMore?'head-search-form form-inline-small-input search-head-otherbox on':'head-search-form form-inline-small-input search-head-otherbox'"
    size="small"
    label-width="90px"
    @submit.native.prevent>
    <el-form-item label="水厂" prop="SA_WaterFactory_Id" style="margin-left: -60px">
      <el-select v-model="param.SA_WaterFactory_Id" placeholder="请选择" size="small" @keyup.enter.native="searchFun" @change="getText(param.SA_WaterFactory_Id,'SA_WaterFactory_Id',waterFactory,'水厂')">
        <el-option v-for="(item,index) in waterFactory" :key="index" :label="item.Name" :value="item.Id"/>
      </el-select>
    </el-form-item>
    <el-form-item label="水表类型" prop="waterMeterType">
      <el-select v-model="param.waterMeterType" placeholder="请选择" size="small" @keyup.enter.native="searchFun" @change="getText(param.waterMeterType ,'waterMeterType',waterMeterArray,'水表类型')">
        <el-option label="全部" value="-1"></el-option>
        <el-option v-for="(item,index) in waterMeterArray" :key="index" :label="item.Name" :value="item.Id" v-if="item.Id != '1102'"/>
      </el-select>
    </el-form-item>
    <el-form-item label="用户类型" prop="userType">
      <el-select v-model="param.userType" placeholder="请选择" size="small" @keyup.enter.native="searchFun" @change="getText(param.userType ,'userType ',userArray,'用户类型')">
        <el-option label="全部" value="-1"></el-option>
        <el-option v-for="(item,index) in userArray" :key="index" :label="item.Name" :value="item.Id"/>
      </el-select>
    </el-form-item>
    <transition name="fade">
      <el-form-item label="日期" prop="createStartTimes" v-show="screenWdth<1600?ifMore:true">
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
  import { getDictionaryOption } from "@/utils/permission"
  import { ComboBoxListZhuanYong } from "@/api/operationFlow"

  export default {
    name: "SelectHead",
    data() {
      return {
        ifMore:false,
        param:{
          page: 1,
          limit: 20,
          filed:'',
          sort:"",
          tableId: '0000071',
          YearMonth:'',
          waterMeterType:'-1',
          SA_WaterFactory_Id:'',
          userType:'-1'
        },
        waterMeterArray:[],
        waterFactory:[],
        createStartTimes:[],
        userArray:[],
        screenWdth:''
      }
    },
    watch: {
      waterWorks: function (newValue) {
        if (newValue) {
          this.waterFactory = newValue
        }
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
        this.getText(this.createStartTimes,'createStartTimes','','操作时间')
        if(data !=null){
          this.param.YearMonth = data.toString().replace(/,/,'~')
        }else{
          this.param.YearMonth = ''
        }
      },
      getText(val, model, arr, name) {
        this.$parent.getNoBack(val)
        this.$parent.getText(val, model, arr, name)
      },
      resetFun(formName){
        this.$refs[formName].resetFields();
        this.param.createStartTime = ''
        this.param.createEndTime = ''
        this.createStartTimes = []
        this.$parent.tipsDataCopy = []
        this.searchFun()
      }
    },
    mounted() {
      this.screenWdth = window.screen.width
      this.waterFactory = this.$store.state.user.waterWorks
      this.param.SA_WaterFactory_Id = this.waterFactory[0].Id
      this.$parent.getNoBack(this.param.SA_WaterFactory_Id)
      this.waterMeterArray = getDictionaryOption('水表类型')
      this.userArray = getDictionaryOption('用户类型')
    }
  }
</script>
