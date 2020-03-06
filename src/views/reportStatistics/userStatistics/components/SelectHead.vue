<template>
  <el-form
    ref="formName"
    :inline="true"
    :model="report"
    :class="ifMore?'head-search-form form-inline-small-input search-head-otherbox on':'head-search-form form-inline-small-input search-head-otherbox'"
    size="small"
    label-width="90px"
    @submit.native.prevent>
    <el-form-item label="水厂" prop="WaterFactoryId" style="margin-left: -60px">
      <el-select v-model="report.WaterFactoryId" placeholder="请选择" size="small" @keyup.enter.native="searchFun" @change="getText(report.WaterFactoryId,'WaterFactoryId',waterFactory,'水厂')">
        <el-option label="全部" value="-1" v-if="waterFactory.length>1"></el-option>
        <el-option v-for="(item,index) in waterFactory" :key="index" :label="item.Name" :value="item.Id"/>
      </el-select>
    </el-form-item>
    <el-form-item label="用户类型" prop="UserType">
      <el-select v-model="report.UserType" placeholder="请选择" size="small" @keyup.enter.native="searchFun" @change="getText(report.UserType,'UserType',userArray,'用户类型')">
        <el-option label="全部" value="-1" v-if="userArray.length>1"></el-option>
        <el-option v-for="(item,index) in userArray" :key="index" :label="item.Name" :value="item.Id"/>
      </el-select>
    </el-form-item>
    <el-form-item label="用水性质" prop="UseWaterTypeName">
      <el-select v-model="report.UseWaterTypeId" placeholder="请选择" size="small" @keyup.enter.native="searchFun" @change="getText(report.UseWaterTypeId,'UseWaterTypeId',userWterTypes,'用水性质')">
        <el-option label="全部" value="-1" v-if="userWterTypes.length>1"></el-option>
        <el-option v-for="(item,index) in userWterTypes" :key="index" :label="item.UseWaterTypeName" :value="item.Id"/>
      </el-select>
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
  import {GetWaterPropertyList} from "@/api/userSetting"
  import {getDictionaryOption} from "@/utils/permission"

  export default {
    name: "SelectHead",
    data() {
      return {
        waterFactory:[],
        userArray:[],
        userWterTypes:[],
        ifMore:false,
        report:{
          UserType: "-1",
          UserTypeName: "",
          WaterFactoryId: "",
          WaterFactoryName: "",
          UseWaterTypeId: "-1",
          UseWaterTypeName: "",
          createUserId: "",
          createStartTime: "",
          createEndTime: "",
          editUserId: "",
          editStartTime: "",
          editEndTime: "",
          limit: 20,
          page: 1,
          sort: "",
          filed: "",
          tableId: ""
        },
        createStartTimes:[],
        operatorArray:[],
        screenWdth:''
      }
    },
    methods: {
      /**
       * 触发父组建查询方法
       **/
      searchFun(){
        if(this.report.WaterFactoryId == '-1'){
          this.report.WaterFactoryName = '全部'
        }else {
          this.waterFactory.forEach(i=>{
            i.Id ==  this.report.WaterFactoryId ? this.report.WaterFactoryName = i.Name :''
          })
        }
        if(this.report.UserType == '-1'){
          this.report.UserTypeName = '全部'
        }else {
          this.userArray.forEach(i=>{
            i.Id ==  this.report.UserType ? this.report.UserTypeName = i.Name :''
          })
        }
        if(this.report.UseWaterTypeId == '-1'){
          this.report.UseWaterTypeName = '全部'
        }else {
          this.userWterTypes.forEach(i=>{
            i.Id ==  this.report.UseWaterTypeId ? this.report.UseWaterTypeName = i.UseWaterTypeName :''
          })
        }
         this.$parent.report = Object.assign({},this.report)
         this.$parent.searchFun();
      },
      /**
       * 获取操作人信息
       **/
      getWaterPorter() {
        GetWaterPropertyList(this.param).then(res => {
          if(res.code==0){
            this.userWterTypes = res.data
          }
        })
      },
      getText(val, model, arr, name) {
        this.$parent.getText(val, model, arr, name)
      },
      resetFun(formName){
        this.$refs[formName].resetFields();
        this.report.editStartTime = ''
        this.report.editEndTime = ''
        this.createStartTimes = []
        this.$parent.tipsDataCopy = []
        this.searchFun()
      }
    },
    mounted() {
      this.screenWdth = window.screen.width
      this.waterFactory = this.$store.state.user.waterWorks
      this.$store.state.user.waterWorks.length>1 ? this.report.WaterFactoryId = '-1' : this.report.WaterFactoryId=this.$store.state.user.waterWorks[0].Id
      this.userArray = getDictionaryOption('用户类型')
      this.getWaterPorter()
    }
  }
</script>
