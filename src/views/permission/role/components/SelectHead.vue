<template>
  <el-form
    :inline="true"
    :model="selectHead"
    class="head-search-form form-inline-small-input"
    size="small"
    label-width="100px"
    @submit.native.prevent
  >
    <el-form-item label="角色：">
      <el-input v-model="selectHead.roleName" placeholder @keyup.enter.native="handleFilter" />
    </el-form-item>
    <el-form-item label="人员名称：">
      <el-input v-model="selectHead.userName" placeholder @keyup.enter.native="handleFilter" />
    </el-form-item>
    <el-form-item label="人员编号：">
      <el-input v-model="selectHead.userNum" placeholder @keyup.enter.native="handleFilter" />
    </el-form-item>
    <el-form-item label="操作人：">
      <el-select v-model="selectHead.editUserId" placeholder="请选择">
        <el-option label="全部" value="-1" />
        <el-option
          v-for="item in editUserList"
          :key="item.Id"
          :label="item.Name"
          :value="item.Id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="建设时间：">
      <el-date-picker
        v-model="timevalue"
        type="daterange"
        range-separator="~"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :default-time="['00:00:00', '23:59:59']"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd HH:mm:ss"
        @change="getTime"
      ></el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" class="iconfont iconsousuo" @click="handleFilter">搜索</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { parseStartTime, parseEndTime } from "@/utils/index";
import {getSelectUser} from "@/api/account"//获取操作人下拉框
export default {
  props: {
    selectHead: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      timevalue: [],
      editUserList: []
    };
  },
  created() {
    let start = parseStartTime(new Date());
    let end = parseEndTime(new Date());
    this.timevalue.push(new Date(start));
    this.timevalue.push(new Date(end));
    this.selectHead.editStartTime = start;
    this.selectHead.editEndTime = end;
    getSelectUser().then((res)=>{
      this.editUserList=res.data
    })
  },
  methods: {
    getTime(v) {
      this.selectHead.editStartTime = v[0];
      this.selectHead.editEndTime = v[1];
    },
    handleFilter() {
      this.$emit("handleFilter", this.selectHead);
    }
  }
};
</script>
<style lang="scss" scoped>
</style>

