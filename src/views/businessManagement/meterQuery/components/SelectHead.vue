<template>
  <div>
    <el-form
      v-show="typeCheck==1"
      :inline="true"
      :model="param1"
      :class="ifMore?'head-search-form form-inline-small-input search-head-box on':'head-search-form form-inline-small-input search-head-box'"
      size="small"
      label-width="70px"
      @submit.native.prevent>
      <el-form-item label="水厂" v-if="waterFactory.length>1" prop="SA_WaterFactory_Id">
        <el-select v-model="param1.SA_WaterFactory_Id" placeholder="请选择" size="small" @change="getPlanList">
          <el-option label="全部" value="-1"></el-option>
          <el-option v-for="(item,index) in waterFactory" :key="index" :label="item.Name" :value="item.Id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="抄表计划" prop="SA_MeterReadPlan_Id">
        <el-select v-model="param1.SA_MeterReadPlan_Id" placeholder="请选择" size="small" @change="getCbyInfo">
          <el-option v-for="(item,index) in planArry" :key="index" :label="item.Name" :value="item.Id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="抄表员" prop="SA_MeterReader_Id">
        <el-select v-model="param1.SA_MeterReader_Id" placeholder="请选择" size="small" @change="getText(param1.SA_MeterReader_Id,'SA_MeterReader_Id',meterArry)">
          <el-option label="全部" value="-1"></el-option>
          <el-option v-for="(item,index) in meterArry" :key="index" :label="item.Name" :value="item.Id"/>
        </el-select>
      </el-form-item>
      <transition name="fade">
        <el-form-item label="抄表状态" v-show="screenWdth<1920?ifMore:true" prop="MeterReadState">
          <el-select v-model="param1.MeterReadState" placeholder="请选择" size="small" @change="getText(param1.MeterReadState,'MeterReadState',meterState)">
            <el-option label="全部" value="-1"></el-option>
            <el-option v-for="(item,index) in meterState" :key="index" :label="item.Name" :value="item.Id"/>
          </el-select>
        </el-form-item>
      </transition>
      <transition name="fade">
        <el-form-item label="表册" v-show="screenWdth<1680?ifMore:true" prop="SA_RegisterBookInfo_Id">
          <el-select v-model="param1.SA_RegisterBookInfo_Id" placeholder="请选择" size="small" @change="getText(param1.SA_RegisterBookInfo_Id,'SA_RegisterBookInfo_Id',formArry)">
            <el-option label="全部" value="-1"></el-option>
            <el-option v-for="(item,index) in formArry" :key="index" :label="item.Name" :value="item.Id"/>
          </el-select>
        </el-form-item>
      </transition>
      <transition name="fade">
        <el-form-item v-show="ifMore" prop="CustomerQueryValue">
          <el-select v-model="param1.CustomerQueryType" placeholder="请选择" class="user-select-box"
                     style="width: 100px;float: left;margin-left: 30px" @change="getText(param1.CustomerQueryType,'CustomerQueryType',userTypes)">
            <el-option v-for="(item,index) in userTypes" :label="item.name" :value="item.Id" :key="index"></el-option>
          </el-select>
          <el-input v-model="param1.CustomerQueryValue" maxlength="20" placeholder="(长度1-10)"
                    style="width: 180px;float: left"/>
        </el-form-item>
      </transition>
      <transition name="fade">
        <el-form-item label="用户类型  " v-show="ifMore"  prop="UserType">
          <el-select v-model="param1.UserType" placeholder="请选择" size="small" @change="getText(param1.UserType,'UserType',userArry)">
            <el-option label="全部" value="-1"></el-option>
            <el-option v-for="(item,index) in userArry" :key="index" :label="item.Name" :value="item.Id"/>
          </el-select>
        </el-form-item>
      </transition>
      <transition name="fade">
        <el-form-item label="录入人  " v-show="ifMore"  prop="InputEmpName">
          <el-input v-model="param1.InputEmpName" maxlength="20" placeholder="请输入录入人" @change="getText(param1.InputEmpName,'InputEmpName')"/>
        </el-form-item>
      </transition>
      <transition name="fade">
        <el-form-item label="录入日期  " v-show="ifMore" prop="InputData">
          <el-date-picker
            v-model="InputData"
            type="daterange"
            :editable="false"
            :unlink-panels="true"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd HH:mm:ss"
            @keydown.enter.native="handleFilter"
            @change="getTime1"
          />
        </el-form-item>
      </transition>
      <el-form-item>
        <i v-show="ifMore" class="icon iconfont iconshouqi3" @click="ifMore=!ifMore"></i>
        <i v-show="!ifMore" class="icon iconfont iconjianqu3" @click="ifMore=!ifMore"></i>
        <el-button type="primary" size="mini" class="cl-search" round @click="searchFun(1)"><i
          class="icon iconfont">&#xe694;</i>
          搜索
        </el-button>
        <el-button round size="mini" class="cl-reset" @click="resetFun(1)"><i class="icon iconfont">&#xe64e;</i>重置</el-button>
      </el-form-item>
    </el-form>
    <el-form
      v-show="typeCheck==2"
      :inline="true"
      :model="param2"
      :class="ifMore2?'head-search-form form-inline-small-input search-head-box on':'head-search-form form-inline-small-input search-head-box'"
      size="small"
      label-width="70px"
      @submit.native.prevent>
      <el-form-item label="水厂" v-if="waterFactory.length>1" prop="SA_WaterFactory_Id">
        <el-select v-model="param2.SA_WaterFactory_Id" placeholder="请选择" size="small" @change="getPlanList">
          <el-option label="全部" value="-1"></el-option>
          <el-option v-for="(item,index) in waterFactory" :key="index" :label="item.Name" :value="item.Id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="抄表员  " prop="SA_MeterReader_Id">
        <el-select v-model="param2.SA_MeterReader_Id" placeholder="请选择" size="small" @change="getText(param2.SA_MeterReader_Id,'SA_MeterReader_Id',meterArry)">
          <el-option label="全部" value="-1"></el-option>
          <el-option v-for="(item,index) in meterArry" :key="index" :label="item.Name" :value="item.Id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="抄表状态" prop="MeterReadState">
        <el-select v-model="param2.MeterReadState" placeholder="请选择" size="small" @change="getText(param2.MeterReadState,'MeterReadState',meterState)">
          <el-option label="全部" value="-1"></el-option>
          <el-option v-for="(item,index) in meterState" :key="index" :label="item.Name" :value="item.Id"/>
        </el-select>
      </el-form-item>
      <transition name="fade">
        <el-form-item label="抄表日期  " v-show="screenWdth<1680?ifMore2:true" prop="meterData">
          <el-date-picker
            v-model="meterData"
            type="daterange"
            :editable="false"
            :unlink-panels="true"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd HH:mm:ss"
            @keydown.enter.native="handleFilter"
            @change="getTime"
          />
        </el-form-item>
      </transition>
      <transition name="fade">
        <el-form-item label="表册  " v-show="ifMore2" prop="SA_RegisterBookInfo_Id">
          <el-select v-model="param2.SA_RegisterBookInfo_Id" placeholder="请选择" size="small" @change="getText(param2.SA_RegisterBookInfo_Id,'SA_RegisterBookInfo_Id',formArry)">
            <el-option label="全部" value="-1"></el-option>
            <el-option v-for="(item,index) in formArry" :key="index" :label="item.Name" :value="item.Id"/>
          </el-select>
        </el-form-item>
      </transition>
      <transition name="fade">
        <el-form-item v-show="ifMore2" prop="CustomerQueryValue">
          <el-select v-model="param2.CustomerQueryType" placeholder="请选择" class="user-select-box"
                     style="width: 100px;float: left;margin-left: 30px" @change="getText(param2.CustomerQueryType,'CustomerQueryType',userTypes)">
            <el-option v-for="(item,index) in userTypes" :label="item.name" :value="item.Id" :key="index"></el-option>
          </el-select>
          <el-input v-model="param2.CustomerQueryValue" maxlength="20" placeholder="(长度1-10)"
                    style="width: 180px;float: left"/>
        </el-form-item>
      </transition>
      <transition name="fade">
        <el-form-item label="用户类型  " v-show="ifMore2" prop="UserType">
          <el-select v-model="param2.UserType" placeholder="请选择" size="small" @change="getText(param2.UserType,'UserType',userArry)">
            <el-option label="全部" value="-1"></el-option>
            <el-option v-for="(item,index) in userArry" :key="index" :label="item.Name" :value="item.Id"/>
          </el-select>
        </el-form-item>
      </transition>
      <transition name="fade">
        <el-form-item label="录入人  " v-show="ifMore2" prop="InputEmpName">
          <el-input v-model="param2.InputEmpName" maxlength="20" placeholder="请输入录入人" @change="getText(param2.InputEmpName,'InputEmpName')"/>
        </el-form-item>
      </transition>
      <transition name="fade">
        <el-form-item label="录入日期  " v-show="ifMore2" prop="InputData2">
          <el-date-picker
            v-model="InputData2"
            type="daterange"
            :editable="false"
            :unlink-panels="true"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd HH:mm:ss"
            @keydown.enter.native="handleFilter"
            @change="getTime3"
          />
        </el-form-item>
      </transition>
      <i v-show="ifMore2" class="icon iconfont iconshouqi3" @click="ifMore2=!ifMore2"></i>
      <i v-show="!ifMore2" class="icon iconfont iconjianqu3" @click="ifMore2=!ifMore2"></i>
      <el-button type="primary" size="mini" round class="cl-search" @click="searchFun(2)"><i class="icon iconfont">&#xe694;</i>搜索</el-button>
      <el-button round size="mini" class="cl-reset" @click="resetFun(2)"><i class="icon iconfont">&#xe64e;</i>重置</el-button>
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

  export default {
    name: "SelectHead",
    data() {
      return {
        userTypes:[
          {name:'姓名',Id:'1'},
          {name:'姓名/简码',Id:'2'},
        ],
        typeCheck:1,
        ifMore: false,
        ifMore2: false,
        param1: {
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
          limit: 10,
          page: 0,
          sort: "",
          filed: "",
          tableId: "0000015"
        },
        param2: {
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
          limit: 10,
          page: 0,
          sort: "",
          filed: "",
          tableId: "0000015"
        },
        waterFactory: [],
        meterData: [],
        InputData:[],
        InputData2:[],
        meterArry: [],//抄表员
        meterState:[],//抄表状态
        formArry: [],//表册类型
        userArry:[],//用户类型
        planArry:[],
        screenWdth:''
      }
    },
    methods: {
      /**
       * 触发父组建搜索方法
       * */
      searchFun(type) {
        type == 1 ? this.ifMore ? this.InputData = this.InputData : this.InputData = [] : this.ifMore2 ? this.InputData2 = this.InputData2 : this.InputData2 = []
        type==1?this.$parent.param =  Object.assign({},this.param1):this.$parent.param =  Object.assign({},this.param2)
        if( this.typeCheck==2 && this.meterData.length<=0 ){//当选择抄表日期类型时候，抄表日期为必填项
          promptInfoFun(this,1,'请选择抄表日期！')
          return
        }
        this.$parent.searchFun();
      },
      getTime() {
        const date = this.meterData;
        if (date) {
          this.param2.ReadDateStart = date[0];
          this.param2.ReadDateEnd = date[1];
        } else {
          this.param2.ReadDateStart = "";
          this.param2.ReadDateEnd = "";
        }
      },
      getTime1() {
        const date = this.InputData;
        if (date) {
          this.param1.InputTimeStart = date[0];
          this.param1.InputTimeEnd = date[1];
        } else {
          this.param1.InputTimeStart = "";
          this.param1.InputTimeEnd = "";
        }
      },
      getTime3() {
        const date = this.InputData2;
        if (date) {
          this.param2.InputTimeStart = date[0];
          this.param2.InputTimeEnd = date[1];
        } else {
          this.param2.InputTimeStart = "";
          this.param2.InputTimeEnd = "";
        }
      },
      getWaterFactoryList(){//  获取具有权限的水厂数据集合,若当前操作员没权限，则只显示当前所在水厂信息，待后期做
        WaterFactoryComboBoxListAuth().then(res => {
          if (res.code ==0 ) {
            this.waterFactory = res.data;
            this.getPlanList('-1');//默认查全部抄表计划
          } else {
            promptInfoFun(this,1,res.message)
          }
        })
      },
      getPlanList(id){//通过水厂获得抄表计划，或抄表员信息
        this.getText(id,'SA_WaterFactory_Id',this.waterFactory)
        if(this.typeCheck==1){//计划
          QueryMeterReadPlanByFactoryId({SA_WaterFactory_Id:id}).then(res => {
            if (res.code ==0 ) {
              this.planArry = res.data;
              this.param1.SA_MeterReadPlan_Id = res.data[0].Id
              this.getCbyInfo(res.data[0].Id)//搜索默认抄表计划
            } else {
              promptInfoFun(this,1,res.message)
            }
          })
        }else {//抄表时间
          QueryMeterReaderByFactoryId({SA_WaterFactory_Id:id}).then(res => {
            if (res.code ==0 ) {
              this.meterArry = res.data.MeterReaders
              this.formArry = res.data.RegisterBooks
            } else {
              promptInfoFun(this,1,res.message)
            }
          })
        }
      },
      getCbyInfo(id){ //获取抄表员及表册联动信息，区分抄表计划及抄表日期
        LoadRegisterBookAndMeterReader({'MeterReadPlanId' : id}).then(res => {
          if (res.code ==0 ) {
            this.getText(id,'SA_MeterReadPlan_Id',this.planArry)
            this.meterArry = res.data.MeterReaders
            this.formArry = res.data.RegisterBooks
          } else {
            promptInfoFun(this,1,res.message)
          }
        })
      },
      setparams(val){//根据搜索方向判断搜索条件值
        this.typeCheck = val
        this.ifMore = false
        if(val == 1){
          this.meterData = ''
          this.param1.ReadDateStart = ''
          this.param1.ReadDateEnd = ''
          this.param1.ReadingQueryType = '1'
        }else {
          this.param2.SA_MeterReadPlan_Id = ''
          this.param2.ReadingQueryType = '2'
        }
        this.getPlanList('-1');//默认查全部抄表计划
      },
      getText(val, model, arr) {
        this.$emit("getText", val, model, arr);
      },
    },
    mounted() {
      this.screenWdth = window.screen.width
      this.formArry = getDictionaryOption('表册类型')
      this.meterState = getDictionaryOption('抄表状态')
      this.userArry = getDictionaryOption('用户类型')
      this.waterFactory=this.$store.state.user.waterWorks
      this.getPlanList('-1');//默认查全部抄表计划
      if(this.$route.query.CustomerNo){
        this.typeCheck = 2
        this.param.ReadingQueryType = '2'
        this.param.CustomerQueryValue = this.$route.query.CustomerNo
        let date=new Date;
        let year =date.getFullYear();
        let month =date.getMonth()+1;
        let day =date.getDate();

        this.meterData =  [new Date(year, month, day, 0, 0), new Date(year, month-6, day, 23, 59, 59)]//默认近半年时间
        this.param.ReadDateStart = new Date(year, month, day, 0, 0)
        this.param.ReadDateEnd = new Date(year, month-6, day, 23, 59, 59)
        this.searchFun()
      }
    }
  }
</script>
