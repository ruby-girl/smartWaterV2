<template>
  <div>
    <el-form
      ref="formName"
      :inline="true"
      :model="query"
      :class="ifMore?'head-search-form form-inline-small-input search-head-otherbox on':'head-search-form form-inline-small-input search-head-otherbox'"
      size="small"
      label-width="70px"
      @submit.native.prevent>
      <el-form-item prop="CustomerQueryValue">
        <el-select v-model="query.CustomerQueryType" placeholder="请选择" class="short-select-item" style="width: 100px;float: left;">
          <el-option v-for="(item,index) in dataTypes" :key="index" :label="item.Name" :value="item.Id"/>
        </el-select>
        <el-input v-model="query.CustomerQueryValue" maxlength="50" placeholder="(长度1-50)" style="width: 180px;float: left;margin-left: 10px;" @blur="setText(query.CustomerQueryValue,'CustomerQueryValue',userType)"/>
      </el-form-item>
      <el-form-item label="用户类型" prop="UserType" >
        <el-select v-model="query.UserType" placeholder="请选择" size="small" @change="getText(query.UserType,'UserType',userType,'用户类型')">
          <el-option label="全部" value="-1"></el-option>
          <el-option v-for="(item,index) in userType" :key="index" :label="item.Name" :value="item.Id"/>
        </el-select>
      </el-form-item>
      <transition name="fade">
        <el-form-item label="用户状态" prop="UserState" v-show="screenWdth<1600?ifMore:true">
          <el-select v-model="query.UserState" placeholder="请选择" size="small" @change="getText(query.UserState,'UserState',userStaus,'用户状态')">
            <el-option label="全部" value="-1"></el-option>
            <el-option v-for="(item,index) in userStaus" :key="index" :label="item.Name" :value="item.Id"/>
          </el-select>
        </el-form-item>
      </transition>
      <el-form-item label="">
        <i v-show="screenWdth<1600&&ifMore" class="icon iconfont iconshouqi3" @click="ifMore=!ifMore"></i>
        <i v-show="screenWdth<1600&&!ifMore" class="icon iconfont iconjianqu3" @click="ifMore=!ifMore"></i>
        <el-button type="primary" size="mini" @click="searchFun" round><i class="icon iconfont">&#xe694;</i>查询</el-button>
        <el-button round size="mini" class="cl-reset" @click="resetFun('formName')"><i class="icon iconfont">&#xe64e;</i>重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { promptInfoFun } from "@/utils/index"
  import { getDictionaryOption } from "@/utils/permission"
  import { getName } from "@/utils/projectLogic"

  export default {
    name: "SelectHead",
    data() {
      return {
        dataTypes:[
          {Name:'用户编号',Id:'1'},
          {Name:'姓名/简码',Id:'2'},
          {Name:'电话',Id:'3'},
          {Name:'证件号',Id:'4'},
          {Name:'用户地址',Id:'5'},
        ],
        ifMore:false,
        userType:[],//用户类型
        userStaus:[],//用户状态
        meterVisible: false,
        planArray:[],//抄表计划
        peopleArray:[],//抄表员
        formsArray:[],//表册
        meterState:[],//抄表状态
        query:{
          //右侧用户列表查询条件
          CustomerQueryType: "1",
          CustomerQueryValue: "",
          UserType: "-1",
          UserState: "-1",
          AreaId: "-1",
          WaterTypeId: -1,
          limit: 20,
          page: 1,
          sort: "",
          filed: "",
          createUserId: "",
          createStartTime: "",
          createEndTime: "",
          editUserId: "",
          editStartTime: "",
          editEndTime: "",
          tableId: "0000016"
        },
        meterData:[],
        screenWdth:''
      }
    },
    methods: {
      /**
       * 触发父组建搜索方法
       * */
      searchFun(){
        this.$parent.query =  Object.assign({},this.query)
        this.$parent.searchTableFun()
      },
      resetFun(formName){
        this.query.CustomerQueryType = '1'
        this.$refs[formName].resetFields();
        this.$parent.$refs.tableChild.tipsDataCopy = []
        this.searchFun()
      },
      getText(val, model, arr, name) {
        this.$parent.getText(val, model, arr, name)
      },
      setText(text,model,arr){
        let name = getName(this.query.CustomerQueryType)
        this.getText(text,model,arr,name)
      }
    },
    mounted() {
      this.screenWdth = window.screen.width
      this.userType = getDictionaryOption('用户类型')
      this.userStaus = getDictionaryOption('用水用户状态')
    }
  }
</script>
