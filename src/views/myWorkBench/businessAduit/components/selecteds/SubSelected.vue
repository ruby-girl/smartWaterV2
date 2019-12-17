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
    <el-form-item label="申请状态" v-show="show1||isShow" >
      <el-input maxlength="20" value="申请中" disabled />
    </el-form-item>
    <el-form-item label="申请类型" v-show="show2||isShow" key="WaterMeter" prop="applyType">
      <el-select
        v-model="selectHead.applyType"
        placeholder="请选择"
        @keydown.enter.native="handleFilter"
        @change="getText(selectHead.WaterMeter ,'WaterMeter',WaterMeterList,'申请状态')"
      >
        <el-option label="全部" :value="-1" />
        <el-option
          v-for="item in WaterMeterList"
          :key="item.Id"
          :label="item.Name"
          :value="Number(item.Id)"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="业务编号" v-show="show3||isShow" prop="applyNo">
      <el-input
        v-model="selectHead.applyNo"
        maxlength="20"
        @keyup.enter.native="handleFilter"
        @change="getText(selectHead.applyNo ,'applyNo','','业务编号')"
      />
    </el-form-item>
    <el-form-item label="申请日期" label-width="80px" v-show="show4||isShow">
      <el-date-picker
        v-model="selectHead.timevalue"
        type="datetimerange"
        :editable="false"
        :unlink-panels="true"
        range-separator="~"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :default-time="['00:00:00', '23:59:59']"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        @change="getTime"
        @keydown.enter.native="handleFilter"
      ></el-date-picker>
    </el-form-item>
    <el-form-item>
      <span class="isShow" v-if="showBtn" :class="{tro:isShow}">
        <i class="icon iconfont iconjianqu3" @click="isShow=!isShow"></i>
      </span>
      <el-button type="primary" size="mini" @click="handleFilter" round>
        <i class="icon iconfont">&#xe694;</i>查询
      </el-button>
      <el-button class="btn-resetting" round plain type="primary" size="mini" @click="resetting">
        <i class="iconfont icon_zhongzhi"></i>重置
      </el-button>
      <!-- <el-button round size="mini" class="cl-reset" @click="resetFun('formName')"><i class="icon iconfont">&#xe64e;</i>重置</el-button> -->
    </el-form-item>
  </el-form>
  </div>
</template>
<script>
import { getDictionaryOption } from "@/utils/permission"; //获取字典项
export default {
  name: "SubSelected",
  props: {
    selectHead: {
      type: Object,
      default: function() {
        return {};
      }
    },
    searchWidth: {}
  },
  watch: {
    searchWidth: {
      handler(val, oldVal) {
        this.show1 = this.showLabel(1, val);
        this.show2 = this.showLabel(2, val);
        this.show3 = this.showLabel(3, val);
        this.show4 = this.showLabel(4, val);
        if (Math.floor((val - 180) / 280) >= 4) {
          this.showBtn = false;
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      secNmae: "",
      WaterMeterList: [], //
      securStatus: [],
      securNextStatus: [],
      isShow: false,
      show1: true,
      show2: true,
      show3: true,
      show4: true,
      show5: true,
      show6: true,
      showBtn: true //查询展开
    };
  },
  created() {},
  methods: {
    resetting() {
      //重置
      this.$refs["formHeight"].resetFields();
      this.$parent.tipsDataCopy = [];
      this.$parent.delTips("timevalue");
    },
    showLabel(n, w) {
      if (Math.floor((w - 180) / 280) >= n || this.isShow) {
        return true;
      }
      return false;
    },

    getText(val, model, arr, name) {
      this.$emit("getText", val, model, arr, name);
    },
    //日期格式化
    getTime(v) {
      let date;
      if (v) {
        this.selectHead.StartTime = v[0];
        this.selectHead.EndTime = v[1];
        date = this.selectHead.StartTime + "~" + this.selectHead.EndTime;
        this.$emit("getText", date, "timevalue", "", "申请日期");
      } else {
        this.selectHead.StartTime = "";
        this.selectHead.EndTime = "";
        date = "";
        this.$emit("getText", date, "timevalue", "", "申请日期");
      }
    },
    handleFilter() {
     this.$parent.searchTableList()
    //   this.$emit("handleFilter");
      // this.$parent.seachAccountOrder()
    }
  }
};
</script>