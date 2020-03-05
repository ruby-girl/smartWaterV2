<template>
  <div>
    <el-form
      ref="formName1"
      :inline="true"
      :model="param"
      :class="ifMore?'head-search-form form-inline-small-input search-head-box on':'head-search-form form-inline-small-input search-head-box'"
      size="small"
      label-width="70px"
      @submit.native.prevent>
      <el-form-item label="水厂" prop="WaterFactoryId">
        <el-select v-model="param.WaterFactoryId" placeholder="请选择" size="small" @change="getText(param.WaterFactoryId,'WaterFactoryId',waterFactory,'水厂')">
          <el-option v-for="(item,index) in waterFactory" :key="index" :label="item.Name" :value="item.Id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="用水性质" prop="WaterPropertyName">
        <el-select v-model="param.WaterPropertyName" placeholder="请选择" size="small" @change="getText(param.WaterPropertyName,'WaterPropertyName','','用水性质')">
          <el-option label="全部" value="-1" v-if="userWterTypes.length>1"></el-option>
          <el-option v-for="(item,index) in userWterTypes" :key="index" :label="item.UseWaterTypeName" :value="item.UseWaterTypeName"/>
        </el-select>
      </el-form-item>
      <el-form-item label="水表类型" prop="WaterMeterType">
        <el-select v-model="param.WaterMeterType" placeholder="请选择" size="small" @change="getText(param.WaterMeterType,'WaterMeterType',waterMeterArray,'水表类型')">
          <el-option label="全部" value="-1" v-if="waterMeterArray.length>1"></el-option>
          <el-option v-for="(item,index) in waterMeterArray" :key="index" :label="item.Name" :value="item.Id"/>
        </el-select>
      </el-form-item>
      <transition name="fade">
      <el-form-item label="用户类型" prop="CustomerType" v-show="screenWdth<1600?ifMore:true">
        <el-select v-model="param.CustomerType" placeholder="请选择" size="small" @change="getText(param.CustomerType,'CustomerType',userArray,'用户类型')">
          <el-option label="全部" value="-1" v-if="userArray.length>1"></el-option>
          <el-option v-for="(item,index) in userArray" :key="index" :label="item.Name" :value="item.Id"/>
        </el-select>
      </el-form-item>
      </transition>
     <!-- <transition name="fade">
        <el-form-item label="生效日期" v-show="screenWdth<1600?ifMore:true" prop="createStartTimes">
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
            @change="getTime"
          />
        </el-form-item>
      </transition>-->
      <el-form-item>
        <i v-show="screenWdth<1600&&ifMore" :class="screenWdth<1600? 'icon iconfont iconshouqi3 secondClass':'icon iconfont iconshouqi3'" @click="ifMore=!ifMore"></i>
        <i v-show="screenWdth<1600&&!ifMore" class="icon iconfont iconjianqu3" @click="ifMore=!ifMore"></i>
        <el-button type="primary" size="mini" class="cl-search" round @click="searchFun(1)"><i
          class="icon iconfont">&#xe694;</i>
          查询
        </el-button>
        <el-button round size="mini" class="cl-reset" @click="resetFun(1)"><i class="icon iconfont">&#xe64e;</i>重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { SelectReportWaterProperty } from "@/api/userSetting"
  import {getDictionaryOption} from "@/utils/permission"
  import {promptInfoFun} from "@/utils/index"
  import {getName} from "@/utils/projectLogic"

  export default {
    name: "SelectHead",
    data() {
      return {
        createStartTimes:[],
        waterFactory:[],
        waterMeterArray:[],
        userArray:[],
        userWterTypes:[],
        ifMore: false,
        param: {
          WaterFactoryId: "",
          WaterFactoryName: "",
          StartEnabledTime: "",
          EndEnabledTime: "",
          WaterPropertyName: "-1",
          WaterMeterType: '-1',
          WaterMeterTypeName: "",
          CustomerType: '-1',
          CustomerTypeName: "",
          createUserId: "",
          createStartTime: "",
          createEndTime: "",
          editUserId: "",
          editStartTime: "",
          editEndTime: "",
          limit: 0,
          page: 0,
          sort: "",
          filed: "",
          tableId: "0000069"
        },
        screenWdth:'',
      }
    },
    methods: {
      /**
       * 触发父组建搜索方法
       * */
      searchFun() {
        this.$parent.param = Object.assign({},this.param)
        this.$parent.searchFun();
      },
      getTime(data) {
        this.getText(this.createStartTimes,'createStartTimes','','生效日期')
        if(data !=null){
          this.param.StartEnabledTime = data[0]
          this.param.EndEnabledTime = data[1]
        }else{
          this.param.StartEnabledTime = ''
          this.param.EndEnabledTime = ''
        }
      },
      resetFun(type){
        this.InputData = []
        this.param.ReadDateStart = "",
          this.param.ReadDateEnd = "",
          this.param.InputTimeStart = "",
          this.param.InputTimeEnd = "",
          this.param.CustomerQueryType = '1'
        this.$refs['formName1'].resetFields();
        this.$parent.tipsData = []
        setTimeout(()=>{
          this.searchFun(type)
        },200)
      },
      getText(val, model, arr, name) {
        this.$emit("getText", val, model, arr, name);
      },
      setText(text,model,arr){
        let name = getName(this.query.CustomerQueryType)
        this.getText(text,model,arr,name)
      },
      getWaterPorter(data){//获取用水性质
        SelectReportWaterProperty({isLadder:data}).then(res => {
          if(res.code==0){
            let data = res.data
            this.userWterTypes = data
          }
        })
      }
    },
    mounted() {
      this.screenWdth = window.screen.width
      this.waterFactory = this.$store.state.user.waterWorks
      this.param.WaterFactoryId = this.waterFactory[0].Id
      this.waterMeterArray = getDictionaryOption('水表类型')
      this.userArray = getDictionaryOption('用户类型')
      //this.getWaterPorter()
    }
  }
</script>
