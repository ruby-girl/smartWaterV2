<template>
  <div class="position-search-head">
    <el-form
      :inline="true"
      :model="selectHead"
      :class="{'position-absolute-head-shadow':isShow,'head-search-form form-inline-small-input position-absolute-head':true}"
      size="small"
      label-width="70px"
      @submit.native.prevent
      ref="formHeight"
    >
      <el-form-item v-if="companyShow" label="水厂" :label-width="isShow?'70px':'40px'">
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
      <transition-group name="fade">
        <el-form-item label="计划状态" v-show="show1||isShow" key="enumPlanState" label-width="70px">
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
        <el-form-item
          label="计划抄表日期"
          label-width="90px"
          v-show="show2||isShow"
          key="warterMeterPlanDate"
        >
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
      </transition-group>
      <el-form-item>
        <span class="isShow" :class="{tro:isShow}" v-if="showBtn">
          <i class="icon iconfont iconjianqu3" @click="isShow=!isShow"></i>
        </span>
        <el-button round type="primary" size="mini" @click="handleFilter">
          <i class="iconfont iconsousuo"></i>
          搜索
        </el-button>
        <el-button size="mini" class="btn-add" round @click="resetting">
          <i class="iconfont icon_zhongzhi"></i>重置
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getSelectUser } from "@/api/account"; //获取操作人下拉框
import { getDictionaryOption } from "@/utils/permission";
export default {
  props: {
    companyOptions: {
      type: Array,
      default: []
    },
    searchWidth: {}
  },
  data() {
    return {
      selectHead: {},
      // warterMeterPlanDate: [],
      //companyOptions: [],
      planStateOptions: [],
      companyShow: true,
      isShow: false,
      show1: true,
      show2: true,
      showBtn: false
    };
  },
  watch: {
    searchWidth: {
      handler(val, oldVal) {
        this.show1 = this.showLabel(1, val);
        this.show2 = this.showLabel(2, val);
        if (!this.show2) {
          this.showBtn = "ture";
        }
      },
      immediate: true
    }
  },
  created() {
    if (this.companyOptions.length == 1) {
      this.companyShow = false;
    }
  },
  methods: {
    resetting() {
      //重置
      this.$refs["formHeight"].resetFields();
      this.$parent.tipsDataCopy = [];
      
      this.$parent.delTips("warterMeterPlanDate");
    },
    showLabel(n, w) {
      if (this.companyOptions.length == 1) {
        if (Math.floor((w - 180) / 280) >= n || this.isShow) return true;
        return false;
      } else {
        if (Math.floor((w - 180) / 280) >= n + 1 || this.isShow) return true;
        return false;
      }
    },
    handleFilter() {
      this.$parent.searchTableList();
    },
    getText(val, model, arr, name) {
      this.$emit("getText", val, model, arr, name);
    },
    getTime() {
      //时间格式化
      let date = this.selectHead.warterMeterPlanDate;
      let dateStipe;
      if (date) {
        this.selectHead.createStartTime = date[0];
        this.selectHead.createEndTime = date[1];
        dateStipe =
          this.selectHead.createStartTime.split(" ")[0] +
          "~" +
          this.selectHead.createEndTime.split(" ")[0];
        this.$emit("getText", dateStipe, "warterMeterPlanDate", "", "升级日期");
      } else {
        this.selectHead.createStartTime = "";
        this.selectHead.createEndTime = "";
        dateStipe = "";
        this.$emit("getText", dateStipe, "warterMeterPlanDate", "", "升级日期");
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

