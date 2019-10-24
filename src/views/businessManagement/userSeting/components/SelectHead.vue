<template>
  <div>
    <el-form
      :inline="true"
      :model="param"
      class="head-search-form form-inline-small-input"
      size="small"
      label-width="100px"
      @submit.native.prevent>
      <el-form-item  label="用户：">
        <el-select v-model="param.CustomerQueryType" placeholder="请选择" style="width: 80px;float: left">
          <el-option label="编号" value="1"></el-option>
          <el-option label="姓名" value="2"></el-option>
          <el-option label="简码" value="3"></el-option>
        </el-select>
        <el-input v-model="param.CustomerQueryValue" maxlength="20" placeholder="(长度1-30)" style="width: 180px;float: left"/>
      </el-form-item>
      <el-form-item label="用户类型：">
        <el-select v-model="param.SA_RegisterBookInfo_Id" placeholder="请选择" size="small">
          <el-option label="全部" value="-1"></el-option>
          <el-option v-for="(item,index) in formsArray" :key="index" :label="item.Name" :value="item.Id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="用户状态：">
        <el-select v-model="param.MeterReadState" placeholder="请选择" size="small">
          <el-option label="全部" value="-1"></el-option>
          <el-option v-for="(item,index) in meterState" :key="index" :label="item.Name" :value="item.Id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" size="small" @click="searchFun" style="padding: 7px 15px"><i class="icon iconfont">&#xe694;</i>搜索</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { getPlan, LoadRegisterBookAndMeterReader, MeterReadingLocationQuery } from "@/api/meterReading"
  import { promptInfoFun } from "@/utils/index"

  export default {
    name: "SelectHead",
    data() {
      return {
        meterVisible: false,
        planArray:[],//抄表计划
        peopleArray:[],//抄表员
        formsArray:[],//表册
        meterState:[],//抄表状态
        param:{//分页查询条件
          SA_MeterReadPlan_Id:'',//抄表计划ID
          SA_MeterReader_Id:'',//抄表员ID
          SA_RegisterBookInfo_Id:'-1',//表册ID
          CustomerQueryType:'1',//用户类型
          CustomerQueryValue:'',//用户类型数值
          MeterReadState:'-1',//抄表状态
        },
        meterData:[//表册定位模拟数据
          {
            Name: '测试2',
            Id: 'b1a89723-89f4-4b5b-a8b3-0b5f566e9b6b',
            UserName: '小李1'
          },
          {
            Name: '机械表水表-X片区',
            Id: '7ba39783-3403-4209-b1ae-6724856f43a0',
            UserName: '小李'
          }
        ]
      }
    },
    methods: {
      /**
       * 触发父组建查询方法
       * */
      searchFun(){

      }
    }
  }
</script>
