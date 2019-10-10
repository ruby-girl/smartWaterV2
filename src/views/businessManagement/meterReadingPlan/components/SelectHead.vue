<template>
  <el-form
    :inline="true"
    :model="selectHead"
    class="head-search-form form-inline-small-input"
    size="small"
    label-width="100px"
    @submit.native.prevent
  >
    <el-form-item label="水厂：">
      <el-select
        v-model="selectHead.SA_WaterFactory_Id"
        placeholder="请选择"
        @keydown.enter.native="handleFilter"
      >
        <el-option label="全部" value="-1"></el-option>
        <el-option
          v-for="item in companyOptions"
          :key="item.Id"
          :label="item.Name"
          :value="item.Id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="计划状态：">
      <el-select
        v-model="selectHead.enumPlanState"
        placeholder="请选择"
        @keydown.enter.native="handleFilter"
      >
        <el-option label="全部" value="-1"></el-option>
        <el-option
          v-for="item in planStateOptions"
          :key="item.Id"
          :label="item.Name"
          :value="item.Id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="计划抄表日期：">
      <el-date-picker
        v-model="warterMeterPlanDate"
        type="datetimerange"
        :editable="false"
        :unlink-panels="true"
        range-separator="~"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :default-time="['00:00:00', '23:59:59']"
        format="yyyy-MM-dd HH:mm:ss"
        value-format="yyyy-MM-dd HH:mm:ss"
        @keydown.enter.native="handleFilter"
        @change="getTime"
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" size="mini" @click="handleFilter">
        <i class="iconfont iconsousuo"></i>搜索
      </el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { getSelectUser } from "@/api/account"; //获取操作人下拉框
import { getDictionaryOption } from "@/utils/permission";
export default {
  props: {
    companyOptions: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      selectHead: {},
      warterMeterPlanDate: [],
      //companyOptions: [],
      planStateOptions: []
    };
  },
  methods: {
    handleFilter() {
      this.$parent.searchTableList();
    },
   
    getTime() {
      //时间格式化
      const date = this.warterMeterPlanDate;
      if (date) {
        this.selectHead.createStartTime = date[0];
        this.selectHead.createEndTime = date[1];
      } else {
        this.selectHead.createStartTime = "";
        this.selectHead.createEndTime = "";
      }
    }
  },
  mounted() {
    this.selectHead = this.$parent.selectHead;
    this.planStateOptions = [];
    this.planStateOptions = getDictionaryOption("抄表计划状态");
  }
};
</script>
<style lang="scss" scoped>
</style>

