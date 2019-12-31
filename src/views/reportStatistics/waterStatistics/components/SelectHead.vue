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
      <el-form-item label="水厂" prop="SA_WaterFactory_Id" :class="!ifMore||screenWidth>1440?'firstItemsOther':''">
        <el-select v-model="param.SA_WaterFactory_Id" placeholder="请选择" size="small">
          <el-option v-for="(item,index) in waterFactory" :key="index" :label="item.Name" :value="item.Id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="用水性质" prop="SA_MeterReadPlan_Id">
        <el-select v-model="param.SA_MeterReadPlan_Id" placeholder="请选择" size="small">
          <el-option v-for="(item,index) in waterFactory" :key="index" :label="item.Name" :value="item.Id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="水表类型" prop="SA_MeterReader_Id">
        <el-select v-model="param.SA_MeterReader_Id" placeholder="请选择" size="small" @change="getText(param.SA_MeterReader_Id,'SA_MeterReader_Id',meterArry,'抄表员')">
          <el-option label="全部" value="-1"></el-option>
          <el-option v-for="(item,index) in waterFactory" :key="index" :label="item.Name" :value="item.Id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="用户类型" prop="SA_MeterReader_Id">
        <el-select v-model="param.SA_MeterReader_Id" placeholder="请选择" size="small" @change="getText(param.SA_MeterReader_Id,'SA_MeterReader_Id',meterArry,'抄表员')">
          <el-option label="全部" value="-1"></el-option>
          <el-option v-for="(item,index) in waterFactory" :key="index" :label="item.Name" :value="item.Id"/>
        </el-select>
      </el-form-item>
      <transition name="fade">
        <el-form-item label="生效日期 " v-show="screenWdth<1600?ifMore:true"prop="InputData">
          <el-date-picker
            v-model="InputData"
            type="monthrange"
            :editable="false"
            :unlink-panels="true"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            @keydown.enter.native="handleFilter"

            @change="getTime"
          />
        </el-form-item>
      </transition>
      <el-form-item>
        <i v-show="screenWdth<1600&&ifMore" class="icon iconfont iconshouqi3" @click="ifMore=!ifMore"></i>
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
  import {getDictionaryOption} from "@/utils/permission"
  import { QueryMeterReadPlanByFactoryId } from "@/api/plan"
  import { WaterFactoryComboBoxListAuth } from "@/api/organize"//具有权限的水厂
  import { QueryMeterReaderByFactoryId } from "@/api/meterQuery" //抄表时间条件下，获取抄表员信息接口
  import { LoadRegisterBookAndMeterReader } from "@/api/meterReading"//抄表计划搜索条件下，获取表册及抄表员接口
  import { promptInfoFun } from "@/utils/index"
  import { getName } from "@/utils/projectLogic"

  export default {
    name: "SelectHead",
    data() {
      return {
        userTypes:[
          {name:'用户编号',Id:'1'},
          {name:'姓名/简码',Id:'2'},
        ],
        ifMore: false,
        param: {
          CustomerQueryType: "1", //用户查询类型 用户编号=1，姓名=2，简码=3
          CustomerQueryValue: "", //用户查询值
          SA_WaterFactory_Id: "-1", //水厂
          SA_MeterReadPlan_Id: "", //抄表计划Id
          SA_MeterReader_Id: "-1", //抄表员ID
          SA_RegisterBookInfo_Id: "-1", //表册Id
          UserType: "-1", //用户类型 = ['1201', '1202', '1203', '1204', '-1']
          InputEmpName: "", //录入人
          ReadDateStart: "", //抄表时间
          ReadDateEnd: "",
          ReadingQueryType: "1", //抄表查询类型 按抄表计划查询=1， 按抄表时间查询=2
          MeterReadState: "-1", //抄表状态 = ['1401', '1402', '-1']
          InputTimeStart: "", //录入时间
          InputTimeEnd: "",
          limit: 20,
          page: 1,
          sort: "",
          filed: "",
          tableId: "0000015"
        },
        waterFactory: [],
        InputData:[],
        screenWdth:'',
      }
    },
    methods: {
      /**
       * 触发父组建搜索方法
       * */
      searchFun(type) {
        this.$parent.searchFun();
      },
      getTime() {
      },
      getWaterFactoryList(){//  获取具有权限的水厂数据集合,若当前操作员没权限，则只显示当前所在水厂信息，待后期做
        WaterFactoryComboBoxListAuth().then(res => {
          if (res.code ==0 ) {
            this.waterFactory = res.data;
          } else {
            promptInfoFun(this,1,res.message)
          }
        })
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
      }
    },
    mounted() {
      this.screenWdth = window.screen.width
      this.waterFactory=this.$store.state.user.waterWorks
    }
  }
</script>
