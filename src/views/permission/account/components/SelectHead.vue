<template>
  <el-form
    :inline="true"
    :model="selectHead"
    class="head-search-form form-inline-small-input"
    size="small"
    label-width="68px"
    @submit.native.prevent
  >
    <el-form-item label="人员编号">
      <el-input
        v-model="selectHead.empNo"
        oninput = "value=value.replace(/[^\d]/g,'')"
        placeholder="人员编号"
        @keyup.enter.native="handleFilter"
      />
    </el-form-item>
    <el-form-item label="人员姓名">
      <el-input
        maxlength="10"
        v-model="selectHead.empName"
        placeholder="人员姓名（长度1-10）"
        @keyup.enter.native="handleFilter"
      />
    </el-form-item>
     <el-form-item label="账号">
      <el-input
        maxlength="20"
        v-model="selectHead.loginName"
        placeholder="账号（长度1-20）"
        @keyup.enter.native="handleFilter"
      />
    </el-form-item>
    <el-form-item label="角色">
      <el-select v-model="selectHead.roldId" placeholder="请选择" @keydown.enter.native="handleFilter">
        <el-option label="全部" value="-1" />
        <el-option v-for="item in roleList" :key="item.Id" :label="item.Name" :value="item.Id" />
      </el-select>
    </el-form-item>
    <el-form-item label="状态">
      <el-select v-model="selectHead.userState" placeholder="请选择" @keydown.enter.native="handleFilter">
        <el-option label="全部" value="-1" />
        <el-option v-for="item in stateType" :key="item.Id" :label="item.Name" :value="item.Id" />
      </el-select>
    </el-form-item>
    <el-form-item label="操作人">
      <el-select v-model="selectHead.editUserId" placeholder="请选择" @keydown.enter.native="handleFilter">
        <el-option label="全部" value="-1" />
        <el-option v-for="item in editUserList" :key="item.Id" :label="item.Name" :value="item.Id" />
      </el-select>
    </el-form-item>
    <el-form-item label="操作时间">
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
        @change="getTime"
        @keydown.enter.native="handleFilter"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini"  @click="handleFilter"><i class="iconfont iconsousuo"></i>搜索</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { getSelectUser } from "@/api/account"; //获取操作人下拉框
import { getDictionaryOption } from "@/utils/permission";
export default {
  props: {
    selectHeadObj: {
      type: Object,
      default: function() {
        return {};
      }
    },
    roleList: {
      type: Array,
      default: function() {
        return [];
      }
    }
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
      oldOptions: [],
      editUserList: [],
      stateType: [],
      selectHead:{}
    };
  },
  created() {
    getSelectUser().then(res => {
      this.editUserList = res.data;
    });
    this.stateType = getDictionaryOption("用户状态");
  },

  methods: {
    getTime(v) {//计划时间
      if (v) {
        this.selectHead.editStartTime = v[0]+' 00:00:00';
        this.selectHead.editEndTime = v[1]+' 23:59:59';
      } else {
        this.selectHead.editStartTime = "";
        this.selectHead.editEndTime = "";
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

