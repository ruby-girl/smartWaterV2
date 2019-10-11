<template>
  <el-form
    :inline="true"
    :model="param"
    class="head-search-form form-inline-small-input"
    size="small"
    label-width="100px"
    @submit.native.prevent>
    <el-form-item label="抄表计划：">
      <el-select v-model="param.SA_MeterReadPlan_Id" placeholder="请选择" size="small" @keyup.enter.native="searchFun">
        <el-option v-for="(item,index) in planArray" :key="index" :label="item.Name" :value="item.Id"/>
      </el-select>
    </el-form-item>
    <el-form-item label="抄表员：">
      <el-select v-model="param.SA_MeterReader_Id" placeholder="请选择" size="small" @keyup.enter.native="searchFun">
        <el-option label="全部" value="-1"></el-option>
        <el-option v-for="(item,index) in peopleArray" :key="index" :label="item.Name" :value="item.Id"/>
      </el-select>
    </el-form-item>
    <el-form-item label="表册：">
      <el-select v-model="param.SA_RegisterBookInfo_Id" placeholder="请选择" size="small" @keyup.enter.native="searchFun">
        <el-option label="全部" value="-1"></el-option>
        <el-option v-for="(item,index) in formsArray" :key="index" :label="item.Name" :value="item.Id"/>
      </el-select>
    </el-form-item>
    <el-form-item  label="用户：">
      <el-select v-model="param.CustomerQueryType" placeholder="请选择" style="width: 80px;float: left">
        <el-option label="编号" value="1"></el-option>
        <el-option label="姓名" value="2"></el-option>
        <el-option label="简码" value="3"></el-option>
      </el-select>
      <el-input v-model="param.CustomerQueryValue" maxlength="20" placeholder="(长度1-30)" @keyup.enter.native="handleFilter" style="width: 180px;float: left"/>
    </el-form-item><br/>
    <el-form-item label="抄表状态：">
      <el-select v-model="param.MeterReadState" placeholder="请选择" size="small" @keyup.enter.native="searchFun">
        <el-option label="全部" value="-1"></el-option>
        <el-option v-for="(item,index) in meterState" :key="index" :label="item.Name" :value="item.Id"/>
      </el-select>
    </el-form-item>
    <el-form-item label="">
      <el-button type="primary" size="small" class="cl-search" @click="searchFun"><i class="icon iconfont">&#xe694;</i>搜索</el-button>
    </el-form-item>
    <el-button type="primary" size="small" class="cl-search fr cl-color1" @click="setCustomData()"><i class="icon iconfont">&#xe678;</i> 表格自定义</el-button>
  </el-form>
</template>

<script>
  import { GetLoginNameList } from "@/api/user"
  import { getPlan } from "@/api/meterReading"
  import { getDictionaryOption } from "@/utils/permission"

  export default {
    name: "SelectHead",
    data() {
      return {
        planArray:[],//抄表计划
        peopleArray:[],//抄表员
        formsArray:[],//表册
        meterState:[],//抄表状态
        param:{//分页查询条件
          SA_MeterReadPlan_Id:'',//抄表计划ID
          SA_MeterReader_Id:'',//抄表员ID
          SA_RegisterBookInfo_Id:'',//表册ID
          CustomerQueryType:'1',//用户类型
          CustomerQueryValue:'',//用户类型数值
          MeterReadState:'-1',//抄表状态
        },
      }
    },
    methods: {
      getplanArray() {//获取抄表计划下拉数据集合
        getPlan().then(res => {
          if (res.code ==0 ) {
            this.planArray = res.data;
          } else {
            this.$message({
              message: res.message,
              type: 'warning',
              duration: 4000
            });
          }
        })
      },
      setCustomData() {
        this.$parent.setCustomData()
      },
      /**
       * 触发父组建查询方法
       * */
      searchFun(){
        this.$parent.searchFun();
      },
      /**
       * 获取操作人信息
       * */
      GetLoginNameList() {
        GetLoginNameList().then(res => {
          if (res.code ==0 ) {
            this.operatorArray = res.data;
          } else {
            this.$message({
              message: res.message,
              type: 'warning',
              duration: 4000
            });
          }
        })
      },
    },
    mounted() {
      this.param = this.$parent.sbap;//从父组件获取初始化查询参数
      this.getplanArray()
      this.meterState = getDictionaryOption('抄表状态')
    }
  }
</script>
