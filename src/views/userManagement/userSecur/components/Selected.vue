<template>
  <el-form
    :inline="true"
    :model="selectHead"
    class="head-search-form form-inline-small-input"
    size="small"
    label-width="70px"
    @submit.native.prevent
  >
    <el-form-item>
      <el-select
        v-model="selectHead.CustomerQueryType"
        placeholder="请选择"
        style="width: 100px;float: left;margin-right:4px;"
        class="short-select"
        @change="getscName(selectHead.CustomerQueryType)"
      >
        <el-option label="姓名/简码" value="2"></el-option>
        <el-option label="用户编号" value="1"></el-option>
        <el-option label="电话" value="3"></el-option>
        <el-option label="证件号" value="4"></el-option>
        <el-option label="用户地址" value="5"></el-option>
      </el-select>
      <el-input
        v-model="selectHead.CustomerQueryValue"
        maxlength="20"
        placeholder="(长度1-30)"
        @keyup.enter.native="handleFilter"
        @change="getText(selectHead.CustomerQueryValue,'CustomerQueryValue','',secNmae)"
        style="width: 180px;float: left"
      />
    </el-form-item>
    <el-form-item label="水表类型">
      <el-select
        v-model="selectHead.waterMeterType"
        placeholder="请选择"
        @keydown.enter.native="handleFilter"
        @change="getText(selectHead.waterMeterType,'waterMeterType',WaterMeterList,'水表类型')"
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
    <el-form-item label="区域">
      <el-select
        v-model="selectHead.waterMeterType"
        placeholder="请选择"
        @keydown.enter.native="handleFilter"
        @change="getText(selectHead.waterMeterType,'waterMeterType',WaterMeterList,'区域')"
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
    <el-form-item label="低保户状态" label-width="80px">
      <el-select
        v-model="selectHead.securType"
        placeholder="请选择"
        @keydown.enter.native="handleFilter"
        @change="getText(selectHead.securType,'securType',securStatus,'低保户状态')"
      >
        <el-option label="全部" :value="-1" />
        <el-option
          v-for="item in securStatus"
          :key="item.Id"
          :label="item.Name"
          :value="Number(item.Id)"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="生效日期止" label-width="80px">
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
    <el-form-item label="次年复审状态" label-width="90px">
      <el-select
        v-model="selectHead.waterMeterType"
        placeholder="请选择"
        @keydown.enter.native="handleFilter"
        @change="getText(selectHead.waterMeterType,'waterMeterType',WaterMeterList,'次年复审状态')"
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
    <el-form-item>
      <el-button type="primary" size="mini" @click="handleFilter">
        <i class="iconfont iconsousuo"></i>搜索
      </el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { getName } from "@/utils/projectLogic"; //搜索条件面包屑
import { getDictionaryOption } from "@/utils/permission"; //获取字典项
export default {
  name: "Selected",
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
      secNmae: "",
      WaterMeterList: [], //
      securStatus:[]
    };
  },
  created() {
    this.WaterMeterList = getDictionaryOption("水表类型");
    this.securStatus = getDictionaryOption("低保户状态");
  },
  methods: {
    getscName(id) {
      this.secNmae = getName(id);
    },
    getText(val, model, arr, name) {
        console.log(val, model, arr, name)
      this.$emit("getText", val, model, arr, name);
    },
    //日期格式化
    getTime(v) {
      let date;
      if (v) {
        this.selectHead.StartUpgradeDate = v[0];
        this.selectHead.EndUpgradeDate = v[1];
        date =
          this.selectHead.StartUpgradeDate +
          "~" +
          this.selectHead.EndUpgradeDate;
        this.$emit("getText", date, "timevalue", "", "销户日期");
      } else {
        this.selectHead.StartUpgradeDate = "";
        this.selectHead.EndUpgradeDate = "";
        date = "";
        this.$emit("getText", date, "timevalue", "", "销户日期");
      }
    },
    handleFilter() {
      // this.$parent.seachAccountOrder()
      this.$emit("handleFilter");
      // this.$parent.seachAccountOrder()
    }
  }
};
</script>