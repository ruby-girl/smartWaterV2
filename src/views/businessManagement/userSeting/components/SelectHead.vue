<template>
  <div>
    <el-form
      :inline="true"
      :model="query"
      class="head-search-form form-inline-small-input"
      size="small"
      label-width="100px"
      @submit.native.prevent>
      <el-form-item>
        <el-select v-model="query.CustomerQueryType" placeholder="请选择" class="short-select-item" style="width: 100px;float: left">
          <el-option label="编号" value="1"></el-option>
          <el-option label="姓名/简码" value="2"></el-option>
          <el-option label="电话" value="3"></el-option>
          <el-option label="证件号" value="4"></el-option>
          <el-option label="地址" value="5"></el-option>
        </el-select>
        <el-input v-model="query.CustomerQueryValue" maxlength="50" placeholder="(长度1-50)" style="width: 180px;float: left"/>
      </el-form-item>
      <el-form-item label="用户类型：">
        <el-select v-model="query.UserType" placeholder="请选择" size="small">
          <el-option label="全部" value="-1"></el-option>
          <el-option v-for="(item,index) in userType" :key="index" :label="item.Name" :value="item.Id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="用户状态：">
        <el-select v-model="query.UserState" placeholder="请选择" size="small">
          <el-option label="全部" value="-1"></el-option>
          <el-option v-for="(item,index) in userStaus" :key="index" :label="item.Name" :value="item.Id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" size="mini" @click="searchFun"><i class="icon iconfont">&#xe694;</i>搜索</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { promptInfoFun } from "@/utils/index"
  import { getDictionaryOption } from "@/utils/permission"

  export default {
    name: "SelectHead",
    data() {
      return {
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
          limit: 10,
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
        meterData:[]
      }
    },
    methods: {
      /**
       * 触发父组建搜索方法
       * */
      searchFun(){
        this.$parent.query =  Object.assign({},this.query)
        this.$parent.searchTableFun()
      }
    },
    mounted() {
      this.userType = getDictionaryOption('用户类型')
      this.userStaus = getDictionaryOption('用水用户状态')
    }
  }
</script>
