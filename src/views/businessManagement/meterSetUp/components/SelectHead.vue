<template>
  <div>
    <el-form
      :inline="true"
      :model="param"
      class="head-search-form form-inline-small-input"
      size="small"
      label-width="100px"
      @submit.native.prevent>
      <el-form-item label="抄表计划：">
        <el-select v-model="param.SA_MeterReadPlan_Id" placeholder="请选择" size="small" @change="getUserInfo">
          <el-option v-for="(item,index) in planArray" :key="index" :label="item.Name" :value="item.Id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="抄表员：">
        <el-select v-model="param.SA_MeterReader_Id" placeholder="请选择" size="small">
          <el-option label="全部" value="-1"></el-option>
          <el-option v-for="(item,index) in peopleArray" :key="index" :label="item.Name" :value="item.Id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="表册：">
        <el-select v-model="param.SA_RegisterBookInfo_Id" placeholder="请选择" size="small">
          <el-option v-for="(item,index) in formsArray" :key="index" :label="item.Name" :value="item.Id"/>
        </el-select>
      </el-form-item>
      <el-form-item  label="用户：">
        <el-select v-model="param.CustomerQueryType" placeholder="请选择" style="width: 80px;float: left">
          <el-option label="编号" value="1"></el-option>
          <el-option label="姓名/简码" value="2"></el-option>
        </el-select>
        <el-input v-model="param.CustomerQueryValue" maxlength="20" placeholder="(长度1-30)" style="width: 180px;float: left"/>
      </el-form-item><br/>
      <el-form-item label="抄表状态：">
        <el-select v-model="param.MeterReadState" placeholder="请选择" size="small">
          <el-option label="全部" value="-1"></el-option>
          <el-option v-for="(item,index) in meterState" :key="index" :label="item.Name" :value="item.Id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" size="small" class="cl-search" @click="searchFun"><i class="icon iconfont">&#xe694;</i>搜索</el-button>
      </el-form-item>
      <el-button type="primary" size="small" class="cl-search fr cl-color1" @click="setCustomData()"><i class="icon iconfont">&#xe678;</i> 表格自定义</el-button>
    </el-form>

    <!--多用户弹窗 s-->
    <el-dialog
      :close-on-click-modal="false"
      top="25vh"
      title="多用户表册信息"
      :visible.sync="meterVisible"
      class="my_header"
      width="600px">
      <el-table :data="meterData" border @row-click="getCurMeter" height="300">
        <el-table-column property="Name" align="center" label="表册名称"></el-table-column>
        <el-table-column property="Id" align="center" label="用户编号"></el-table-column>
        <el-table-column property="UserName" align="center" label="姓名"></el-table-column>
      </el-table>
    </el-dialog>
    <!--多用户弹窗 e-->
  </div>
</template>

<script>
  import { getPlan, LoadRegisterBookAndMeterReader, MeterReadingLocationQuery } from "@/api/meterReading"
  import { getDictionaryOption } from "@/utils/permission"
  import { promptInfoFun } from "@/utils/index"

  import Bus from '@/utils/bus'
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
          SA_RegisterBookInfo_Id:'',//表册ID
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
      getplanArray() {//获取抄表计划下拉数据集合
        getPlan().then(res => {
          if (res.code ==0 ) {
            this.planArray = res.data;
            this.param.SA_MeterReadPlan_Id = res.data[0].Id;//默认选择第一个
            this.getUserInfo(res.data[0].Id)
          } else {
            promptInfoFun(this,1,res.message)
          }
        })
      },
      getUserInfo(val){//表册抄表员与抄表计划联动查询
        let selectedWorkName = {}
        selectedWorkName = this.planArray.find((item)=>{
          return item.Id === val;
        });
        Bus.$emit('planName', selectedWorkName)//给兄弟组件传值

        LoadRegisterBookAndMeterReader({'MeterReadPlanId':val}).then(res => {
          if (res.code ==0 ) {
            this.peopleArray = res.data.MeterReaders;//抄表员
            this.formsArray = res.data.RegisterBooks;//表册
            this.param.SA_MeterReader_Id = '-1'//默认选中第一个
            this.param.SA_RegisterBookInfo_Id = res.data.RegisterBooks[0].Id
          } else {
            promptInfoFun(this,1,res.message)
          }
        })
      },
      setCustomData() {//表格自定义
        this.$parent.setCustomData()
      },
      /**
       * 触发父组建查询方法
       * */
      searchFun(){
        let id = this.param.SA_MeterReadPlan_Id,
          type = this.param.CustomerQueryType,
          value = this.param.CustomerQueryValue;
        if(value!=''){
          MeterReadingLocationQuery({'SA_MeterReadPlan_Id':id,'CustomerQueryType':type,'CustomerQueryValue':value}).then(res => {//先进行表册定位
            if (res.code == 0 ) {
              if(res.data.length <=0 ){//没有该人员信息
                promptInfoFun(this,1,'未查询到数据')
              }else if(res.data.length ==1){//此时有一条数据默认覆盖当前表册
                //this.param.SA_RegisterBookInfo_Id = res.data[0].Id
                this.param.SA_RegisterBookInfo_Id = this.meterData[0].Id
                this.$parent.searchFun();
              }else{//此时有一条以上数据，需手动选择后确认表册信息
                //this.meterData = res.data
                this.meterVisible = true
              }
            }
          })
        }else{
          this.$parent.searchFun();
        }
      },
      getCurMeter(row){//多表册手动选择
        this.param.SA_RegisterBookInfo_Id = row.Id
        this.meterVisible = false
        this.$parent.searchFun();
      }
    },
    mounted() {
      this.param = this.$parent.param;//从父组件获取初始化查询参数
      this.getplanArray()
      this.meterState = getDictionaryOption('抄表状态')
    }
  }
</script>
