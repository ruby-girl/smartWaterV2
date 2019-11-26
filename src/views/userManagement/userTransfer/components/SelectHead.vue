<template>
  <el-form
    :inline="true"
    :model="selectHead"
    class="head-search-form form-inline-small-input"
    size="small"
    label-width="80px"
    @submit.native.prevent
  >
    
    <el-form-item label="水厂：">
      <el-select v-model="selectHead.editUserId" placeholder="请选择" @keydown.enter.native="handleFilter">
        <el-option label="全部" value="-1" />
        <el-option
          v-for="item in editUserList"
          :key="item.Id"
          :label="item.Name"
          :value="item.Id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="用户类型：">
      <el-select v-model="selectHead.editUserId" placeholder="请选择" @keydown.enter.native="handleFilter">
        <el-option label="全部" value="-1" />
        <el-option
          v-for="item in editUserList"
          :key="item.Id"
          :label="item.Name"
          :value="item.Id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="水表类型：">
      <el-select v-model="selectHead.editUserId" placeholder="请选择" @keydown.enter.native="handleFilter">
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
            v-model="selectHead.CustomerQueryType"
            placeholder="请选择"
            style="width: 100px;float: left"
          >
            <el-option label="原用户姓名" value="1"></el-option>
            <el-option label="新用户姓名" value="2"></el-option>
            <el-option label="用户编号" value="3"></el-option>
            <el-option label="用户电话" value="4"></el-option>
            <el-option label="用户证件号" value="5"></el-option>
            <el-option label="用户地址" value="6"></el-option>
          </el-select>
          <el-input
            v-model="selectHead.CustomerQueryValue"
            maxlength="20"
            placeholder="(长度1-30)"
            @keyup.enter.native="handleFilter"
            style="width: 180px;float: left"
          />
        </el-form-item>
        <el-form-item label="过户操作员：" label-width="80">
      <el-select v-model="selectHead.editUserId" placeholder="请选择" @keydown.enter.native="handleFilter">
        <el-option label="全部" value="-1" />
        <el-option
          v-for="item in editUserList"
          :key="item.Id"
          :label="item.Name"
          :value="item.Id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="过户日期：">
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
    <el-form-item>
      <el-button type="primary" size="mini"  @click="handleFilter"><i class="iconfont iconsousuo"></i>搜索</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
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
    getSelectUser().then((res)=>{
      this.editUserList=res.data
    })
  },
  methods: {
    getTime(v) {
      if (v) {
        this.selectHead.editStartTime = v[0];
        this.selectHead.editEndTime = v[1];
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

