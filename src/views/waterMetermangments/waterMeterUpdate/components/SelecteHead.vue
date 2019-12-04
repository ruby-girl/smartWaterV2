<template>
  <el-form
    :inline="true"
    :model="selectHead"
    class="head-search-form form-inline-small-input"
    size="small"
    label-width="80px"
    @submit.native.prevent
  >
    <el-form-item v-if="companyShow" label="水厂">
      <el-select
        v-model="selectHead.waterFactoryId "
        placeholder="请选择"
        @keydown.enter.native="handleFilter"
      >
        <el-option label="全部" value="-1" />
        <el-option
          v-for="item in companyParentOptions"
          :key="item.Id"
          :label="item.Name"
          :value="item.Id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="用户类型">
      <el-select
        v-model="selectHead.userType"
        placeholder="请选择"
        @keydown.enter.native="handleFilter"
      >
        <el-option label="全部" value="-1" />
        <el-option v-for="item in userTypeList" :key="item.Id" :label="item.Name" :value="item.Id" />
      </el-select>
    </el-form-item>
    <el-form-item label="升级前水表类型" label-width="120px">
      <el-select
        v-model="selectHead.waterMeterType"
        placeholder="请选择"
        @keydown.enter.native="handleFilter"
      >
        <el-option label="全部" value="-1" />
        <el-option
          v-for="item in WaterMeterList"
          :key="item.Id"
          :label="item.Name"
          :value="item.Id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="升级后水表类型" label-width="120px">
      <el-select
        v-model="selectHead.waterMeterType"
        placeholder="请选择"
        @keydown.enter.native="handleFilter"
      >
        <el-option label="全部" value="-1" />
        <el-option
          v-for="item in WaterMeterList"
          :key="item.Id"
          :label="item.Name"
          :value="item.Id"
        />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-select
        v-model="selectHead.CustomerQueryType"
        placeholder="请选择"
        style="width: 100px;float: left;margin-right:4px;"
        class="short-select"
        
      >
        <el-option label="用户姓名" value="2"></el-option>
        <el-option label="用户编号" value="1"></el-option>
        <el-option label="用户电话" value="3"></el-option>
        <el-option label="用户证件号" value="4"></el-option>
        <el-option label="用户地址" value="5"></el-option>
      </el-select>
      <el-input
        v-model="selectHead.CustomerQueryValue"
        maxlength="20"
        placeholder="(长度1-30)"
        @keyup.enter.native="handleFilter"
        style="width: 180px;float: left"
      />
    </el-form-item>
    <el-form-item label="操作员" label-width="80">
      <el-select
        v-model="selectHead.createUserId"
        placeholder="请选择"
        @keydown.enter.native="handleFilter"
      >
        <el-option label="全部" value="-1" />
        <el-option v-for="item in editUserList" :key="item.Id" :label="item.Name" :value="item.Id" />
      </el-select>
    </el-form-item>
    <el-form-item label="升级日期">
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
      <el-button type="primary" size="mini" @click="handleFilter">
        <i class="iconfont iconsousuo"></i>搜索
      </el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { getDictionaryOption } from "@/utils/permission"; //获取字典项
export default {
  props: {
    selectHead: {
      type: Object,
      default: function() {
        return {};
      }
    },
    editUserList: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      timevalue: [],
      companyParentOptions: [], //水厂
      companyShow: true,
      userTypeList: [],
      WaterMeterList: []
    };
  },
  created() {
    this.companyParentOptions = this.$store.state.user.waterWorks;
    if (this.companyParentOptions.length == 1) {
      this.selectHead.SA_WaterFactory_Id = this.companyOptions[0].Id;
      this.companyShow = false;
    }
    this.userTypeList = getDictionaryOption("用户类型");
    this.WaterMeterList = getDictionaryOption("水表类型");
  },
  methods: {
    getTime(v) {
      if (v) {
        this.selectHead.createStartTime = v[0];
        this.selectHead.createEndTime = v[1];
      } else {
        this.selectHead.createStartTime = "";
        this.selectHead.createEndTime = "";
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
<style lang="scss" scoped>
.el-form {
  margin-top: 17px;
}
</style>

