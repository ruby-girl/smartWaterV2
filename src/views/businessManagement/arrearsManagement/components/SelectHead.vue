<template>
  <el-form
    :inline="true"
    :model="selectHead"
    class="head-search-form backgrounf-fff form-inline-small-input"
    size="small"
    label-width="80px"
    @submit.native.prevent
  >
    <div class="dialog-title-border-shadow">
      <el-radio-group v-model="selectHead.selectType">
        <el-radio :label="'1'">按用户查询</el-radio>
        <el-radio :label="'2'">按水厂查询</el-radio>
      </el-radio-group>
    </div>
   <div style="padding:15px;padding-bottom:0;">
      <el-form-item label="用户：" label-width="65px">
          <el-select
            v-model="selectHead.Enumcqt"
            placeholder="请选择"
            style="width: 100px;float: left"
          >
            <el-option label="用户编号" value="1"></el-option>
            <el-option label="姓名/简码" value="2"></el-option>
            <el-option label="水表编号" value="6"></el-option>
          </el-select>
          <el-input
            v-model="selectHead.Customer"
            maxlength="20"
            @keyup.enter.native="handleFilter"
            style="width: 180px;float: left"
          />
        </el-form-item>
    <el-form-item label="水厂：" v-if="this.waterWorks.length>1">
      <el-select
        v-model="selectHead.SA_WaterFactory_Id"
        placeholder="请选择"
        @keydown.enter.native="handleFilter"
      >
        <el-option label="全部" value="-1" />
        <el-option v-for="item in waterWorks" :key="item.Id" :label="item.Name" :value="item.Id" />
      </el-select>
    </el-form-item>
     <el-form-item label="操作时间：">
      <el-date-picker
        v-model="timevalue"
        type="datetimerange"
        :editable="false"
        :unlink-panels="true"
        range-separator="~"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :default-time="['00:00:00', '23:59:59']"
        format="yyyy-MM-dd HH:mm:ss"
        value-format="yyyy-MM-dd HH:mm:ss"
        @change="getTime"
        @keydown.enter.native="handleFilter"
      ></el-date-picker>
    </el-form-item>
     <el-form-item label="所属区域：">
       <el-select
        v-model="selectHead.SA_UserArea_Id"
        placeholder="请选择"
        @keydown.enter.native="handleFilter"
      >
        <el-option label="全部" value="-1" />
        <!-- <el-option v-for="item in areaList" :key="item.Id" :label="item.Name" :value="item.Id" /> -->
      </el-select>
    </el-form-item>
     <transition-group name="fade">
     
        <el-form-item label="费用类型：" v-show="ifMore" key="type">
          <el-select
            v-model="selectHead.Enumot"
            placeholder="请选择"
            @keydown.enter.native="handleFilter"
          >
            <el-option label="全部" value="-1" />
            <el-option
              v-for="item in Enumot"
              :key="item.Id"
              :label="item.Name"
              :value="item.Id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="用户类型：" v-show="ifMore" key="state">
          <el-select
            v-model="selectHead.Enumut"
            placeholder="请选择"
            @keydown.enter.native="handleFilter"
          >
            <el-option label="全部" value="-1" />
            <el-option
              v-for="item in Enumut"
              :key="item.Id"
              :label="item.Name"
              :value="item.Id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="水表类型：" v-show="ifMore" key="Enumwm">
          <el-select
            v-model="selectHead.Enumwm"
            placeholder="请选择"
            @keydown.enter.native="handleFilter"
          >
            <el-option label="全部" value="-1" />
            <el-option
              v-for="item in Enumwm"
              :key="item.Id"
              :label="item.Name"
              :value="item.Id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="费用状态：" v-show="ifMore" key="Enumcf">
          <el-select
            v-model="selectHead.Enumcf"
            placeholder="请选择"
            @keydown.enter.native="handleFilter"
          >
            <el-option label="全部" value="-1" />
            <el-option
              v-for="item in Enumcf"
              :key="item.Id"
              :label="item.Name"
              :value="item.Id"
            />
          </el-select>
        </el-form-item>
     
    </transition-group>
    <el-form-item>
      <el-button type="primary" size="mini" @click="handleFilter">
        <i class="iconfont iconsousuo"></i>搜索
      </el-button>
      <i v-show="ifMore" class="icon iconfont getUpDown" @click="toggleShow(false)">收起 &#xe692;</i>
      <i v-show="!ifMore" class="icon iconfont getUpDown" @click="toggleShow(true)">展开 &#xe68f;</i>
    </el-form-item>
   </div>
  </el-form>
</template>
<script>
import {GetAreaList} from "@/api/userArea"//区域列表
import { getDictionaryOption } from "@/utils/permission";
export default {
  props: {
    selectHead: {
      type: Object,
      default: function() {
        return {};
      }
    },
    typeList: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      Enumot:[],//费用类型
      Enumut:[],//用户类型
      Enumwm:[],//水表类型
      Enumcf:[],//费用状态
      timevalue: [],
      areaList:[],//区域列表
      ifMore:false
    };
  },
  created() {
    GetAreaList().then(res=>{
      this.areaList=res.data
    })
    this.Enumwm=getDictionaryOption('水表类型')
    this.Enumut=getDictionaryOption('用户类型')
    this.Enumot=getDictionaryOption('费用类型')
    this.Enumcf=getDictionaryOption('费用状态')
     this.waterWorks=this.$store.state.user.waterWorks
    if(this.waterWorks.length==1){
      this.selectHead.SA_WaterFactory_Id=this.waterWorks[0].Id
    }
  },

  methods: {
    getTime(v) {
      if (v) {
        this.selectHead.Star_ArrearsDate = v[0];
        this.selectHead.End_ArrearsDate = v[1];
      } else {
        this.selectHead.Star_ArrearsDate = "";
        this.selectHead.End_ArrearsDate = "";
      }
    },
    handleFilter() {
      this.$emit("handleFilter", this.selectHead);
    },
    toggleShow(type) {
      this.ifMore = type;
      this.$emit("toggleShow", type);
    }
  }
};
</script>
<style lang="scss" scoped>
.backgrounf-fff{
  background: #fff;
  .dialog-title-border-shadow{
    line-height: 40px;
    padding-left: 20px;
  }
}
.getUpDown {
  font-size: 14px;
  color: #00b3a0;
  display: inline-block;
  margin-left: 20px;
  cursor: pointer;
}
</style>

