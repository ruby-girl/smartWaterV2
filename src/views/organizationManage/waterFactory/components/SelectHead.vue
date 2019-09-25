<template>
  <el-form
    :inline="true"
    :model="selectHead"
    class="head-search-form form-inline-small-input"
    size="small"
    label-width="80px"
    @submit.native.prevent
  >
    <el-form-item label="水厂：" label-width="44px">
      <el-select v-model="selectHead.Id" placeholder="请选择" @keydown.enter.native="handleFilter">
        <el-option label="全部" value="-1" />
        <el-option
          v-for="item in editUserList"
          :key="item.Id"
          :label="item.Name"
          :value="item.Id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="操作人：">
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

