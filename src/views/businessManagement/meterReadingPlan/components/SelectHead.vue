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
        v-model="selectHead.company"
        placeholder="请选择"
        @keydown.enter.native="handleFilter"
      >
        <el-option
          v-for="item in companyOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="抄表计划：">
      <el-input v-model="selectHead.warterMeterPlan" @keydown.enter.native="handleFilter"></el-input>
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
      />
    </el-form-item>
 <el-form-item label="计划状态：">
      <el-select
        v-model="selectHead.planState"
        placeholder="请选择"
        @keydown.enter.native="handleFilter"
      >
        <el-option
          v-for="item in planStateOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
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
  data() {
    return {
      selectHead: {
        company: "",
        warterMeterPlan: "",
        planState:""
      },
        warterMeterPlanDate: [],
      companyOptions: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      planStateOptions:[
         {
          value: "",
          label: "全部"
        },
        {
          value: "1",
          label: "已完成"
        },
         {
          value: "2",
          label: "未完成"
        },
      
      ]
    };
  },
  methods: {
    handleFilter() {
      console.log("抄表计划");
    },
    // getTime(v) {
    //   if (v) {
    //     this.selectHead.editStartTime = v[0];
    //     this.selectHead.editEndTime = v[1];
    //   } else {
    //     this.selectHead.editStartTime = "";
    //     this.selectHead.editEndTime = "";
    //   }
    // }
  } 
};
</script>
<style lang="scss" scoped>
</style>

