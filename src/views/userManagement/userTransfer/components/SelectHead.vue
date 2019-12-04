<template>
  <el-form
    :inline="true"
    :model="selectHead"
    class="head-search-form form-inline-small-input"
    size="small"
    label-width="75px"
    @submit.native.prevent
  >
    <el-form-item label="水厂" v-if="this.waterWorks.length>1">
      <el-select v-model="selectHead.SA_WaterFactory_Id" placeholder="请选择" @keydown.enter.native="handleFilter">
        <el-option label="全部" value="-1" />
        <el-option
          v-for="item in waterWorks"
          :key="item.Id"
          :label="item.Name"
          :value="item.Id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="用户类型">
      <el-select v-model="selectHead.UserType" placeholder="请选择" @keydown.enter.native="handleFilter">
        <el-option label="全部" value="-1" />
        <el-option
          v-for="item in userType"
          :key="item.Id"
          :label="item.Name"
          :value="item.Id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="水表类型">
      <el-select v-model="selectHead.WaterTypeId" placeholder="请选择" @keydown.enter.native="handleFilter">
        <el-option label="全部" value="-1" />
        <el-option
          v-for="item in editUserList"
          :key="item.Id"
          :label="item.Name"
          :value="item.Id"
        />
      </el-select>
    </el-form-item>
    <el-form-item >
          <el-select
            v-model="selectHead.TransferCustomer"
            placeholder="请选择"
            class="user-select-box" style="width: 100px;float: left;margin-right:3px;"
          >
            <el-option label="原用户姓名" value="1"></el-option>
            <el-option label="新用户姓名" value="2"></el-option>
            <el-option label="用户编号" value="3"></el-option>
            <el-option label="用户电话" value="4"></el-option>
            <el-option label="用户证件号" value="5"></el-option>
            <el-option label="用户地址" value="6"></el-option>
          </el-select>
          <el-input
            v-model="selectHead.Customer"
            maxlength="20"
            @keyup.enter.native="handleFilter"
            style="width: 180px;float: left"
          />
        </el-form-item>
        <el-form-item label="过户操作员">
      <el-select v-model="selectHead.OpId" placeholder="请选择" @keydown.enter.native="handleFilter">
        <el-option label="全部" value="-1" />
        <el-option
          v-for="item in editUserList"
          :key="item.Id"
          :label="item.Name"
          :value="item.Id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="过户日期">
      <el-date-picker
         v-model="timevalue"
        type="daterange"
        :editable="false"
        :unlink-panels="true"
        range-separator="~"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        @keydown.enter.native="handleFilter"
        @change="getTime"
      ></el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-button round type="primary" size="mini"  @click="handleFilter"><i class="iconfont iconsousuo"></i>搜索</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import {getSelectUser} from "@/api/account"//获取操作人下拉框
import {getDictionaryOption} from "@/utils/permission"//字典
export default {
  props: {
        selectHeadObj: {}
  },
  watch:{
    selectHeadObj:{
       handler(val, oldVal) {      
       this.selectHead=Object.assign({},val)      
      },
      immediate: true
    }
  },
  data() {
    return {
      timevalue: [],
      editUserList: [],
      userType:[],
      waterWorks:[],//水厂
      selectHead:{}
    };
  },
  created() {
     this.waterWorks=this.$store.state.user.waterWorks
    if(this.waterWorks.length==1){
      this.selectHead.SA_WaterFactory_Id=this.waterWorks[0].Id
    }
    this.userType=getDictionaryOption('用户类型')
    getSelectUser().then((res)=>{//操作人
      this.editUserList=res.data
    })
  },
  methods: {
    getTime(v) {
      if (v) {
        this.selectHead.Star_TransferDate = v[0]+' 00:00:00';
        this.selectHead.End_TransferDate = v[1]+' 23:59:59';
      } else {
        this.selectHead.Star_TransferDate = "";
        this.selectHead.End_TransferDate = "";
      }
    },
    handleFilter() {
      this.$emit("handleFilter", this.selectHead);
    }
  }
};
</script>
<style lang="scss" scoped>
</style>

