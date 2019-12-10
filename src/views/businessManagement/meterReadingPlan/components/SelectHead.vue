<template>
  <el-form
    :inline="true"
    :model="selectHead"
    class="head-search-form form-inline-small-input"
    size="small"
    label-width="70px"
    @submit.native.prevent
  >
    <el-form-item v-if="companyShow" label="水厂">
      <el-select
        v-model="selectHead.SA_WaterFactory_Id"
        placeholder="请选择"
        @keydown.enter.native="handleFilter"
        @change="getText(selectHead.SA_WaterFactory_Id,'SA_WaterFactory_Id',companyOptions,'水厂')"
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
    <el-form-item label="计划状态">
      <el-select
        v-model="selectHead.enumPlanState"
        placeholder="请选择"
        @keydown.enter.native="handleFilter"
         @change="getText(selectHead.enumPlanState,'enumPlanState',planStateOptions,'计划状态')"
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
    <el-form-item label="计划抄表日期" label-width="110px">
      <el-date-picker
        v-model="selectHead.warterMeterPlanDate"
        type="daterange"
        :editable="false"
        :unlink-panels="true"
        range-separator="~"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :default-time="['00:00:00', '23:59:59']"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
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
      // warterMeterPlanDate: [],
      //companyOptions: [],
      planStateOptions: [],
      companyShow: true
    };
  },
  watch: {
    companyOptions() {
      this.companyShow = true;
      if (this.companyOptions.length == 1) {
        this.selectHead.SA_WaterFactory_Id = this.companyOptions[0].Id;
        this.companyShow = false;
      }
    }
  },
  created() {
    
  },
  methods: {
    handleFilter() {
      this.$parent.searchTableList();
    },
    getText(val, model, arr, name) {
      this.$emit("getText", val, model, arr, name);
    },
    getTime() {
      //时间格式化
      // debugger
      const date = this.selectHead.warterMeterPlanDate;
      let date1;
      if (date) {
        this.selectHead.createStartTime = date[0];
        this.selectHead.createEndTime = date[1];
        date1 =
          this.selectHead.createStartTime.split(" ")[0] +
          "~" +
          this.selectHead.createEndTime.split(" ")[0];
        this.$emit("getText", date1, "warterMeterPlanDate", "", "升级日期");
      } else {
        this.selectHead.createStartTime = "";
        this.selectHead.createEndTime = "";
        date1 = "";
        this.$emit("getText", date1, "warterMeterPlanDate", "", "升级日期");
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

