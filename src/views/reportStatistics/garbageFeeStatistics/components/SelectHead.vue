<template>
  <el-form
    ref="formName"
    :inline="true"
    :model="grp"
    :class="ifMore?'head-search-form form-inline-small-input search-head-otherbox on':'head-search-form form-inline-small-input search-head-otherbox'"
    size="small"
    label-width="90px"
    @submit.native.prevent>
    <el-form-item label="水厂" prop="SA_WaterFactory_Id" style="margin-left: -60px">
      <el-select v-model="grp.SA_WaterFactory_Id" placeholder="请选择" size="small"  @change="getText(grp.SA_WaterFactory_Id,'SA_WaterFactory_Id',waterFactory,'水厂')">
        <el-option v-for="(item,index) in waterFactory" :key="index" :label="item.Name" :value="item.Id"/>
      </el-select>
    </el-form-item>
    <el-form-item label="水表类型" prop="WaterMeter">
      <el-select v-model="grp.WaterMeter" placeholder="请选择" size="small"  @change="getText(grp.WaterMeter,'WaterMeter',waterMeterArray,'水表类型')">
        <el-option label="全部" value="-1"></el-option>
        <el-option v-for="(item,index) in waterMeterArray" :key="index" :label="item.Name" :value="item.Id"/>
      </el-select>
    </el-form-item>
    <el-form-item label="用户类型" prop="UserType">
      <el-select v-model="grp.UserType" placeholder="请选择" size="small"  @change="getText(grp.UserType,'UserType',userArray,'操作人')">
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

  export default {
    name: "SelectHead",
    data() {
      return {
        waterFactory:[],
        waterMeterArray:[],
        userArray:[],
        ifMore:false,
        grp:{
          SA_WaterFactory_Id: "",
          StarDateTime: "",
          EndDateTime: "",
          WaterMeter: "-1",
          UserType: "-1",
          limit: 10,
          page: 1,
          sort: "",
          filed: "",
          tableId: ""
        },
        createStartTimes:[],
        screenWdth:''
      }
    },
    methods: {
      /**
       * 触发父组建查询方法
       * */
      searchFun(){
        this.$parent.grp = Object.assign({},this.grp)
        this.$parent.searchFun();
      },
      getTime1(data) {
        this.getText(this.createStartTimes,'createStartTimes','','日期')
        if(data !=null){
          this.grp.StarDateTime = data[0]
          this.grp.EndDateTime = data[1]
        }else{
          this.grp.StarDateTime = ''
          this.grp.EndDateTime = ''
        }
      },
      /**
       * 获取操作人信息
       * */
      getText(val, model, arr, name) {
        this.$parent.getText(val, model, arr, name)
      },
      resetFun(formName){
        this.$refs[formName].resetFields();
        this.grp.StarDateTime = ''
        this.grp.EndDateTime = ''
        this.createStartTimes = []
        this.$parent.tipsDataCopy = []
        this.searchFun()
      }
    },
    mounted() {
      this.screenWdth = window.screen.width
      this.waterFactory = this.$store.state.user.waterWorks
      this.grp.SA_WaterFactory_Id = this.waterFactory[0].Id
      this.waterMeterArray = getDictionaryOption('水表类型')
      this.userArray = getDictionaryOption('用户类型')
    }
  }
</script>
