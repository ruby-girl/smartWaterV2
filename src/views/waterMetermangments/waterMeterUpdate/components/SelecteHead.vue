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
        v-model="selectHead.SA_WaterFactory_Id "
        placeholder="请选择"
        @keydown.enter.native="handleFilter"
        @change="getText(selectHead.SA_WaterFactory_Id,'SA_WaterFactory_Id',companyParentOptions,'水厂')"
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
        v-model="selectHead.UserType"
        placeholder="请选择"
        @keydown.enter.native="handleFilter"
        @change="getText(selectHead.UserType,'UserType',userTypeList,'用户类型')"
      >
        <el-option label="全部" :value="-1" />
        <el-option
          v-for="item in userTypeList"
          :key="item.Id"
          :label="item.Name"
          :value="Number(item.Id)"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="升级前水表类型" label-width="120px">
      <el-select
        v-model="selectHead.OldWaterMeterTypeId"
        placeholder="请选择"
        @keydown.enter.native="handleFilter"
        @change="getText(selectHead.OldWaterMeterTypeId,'OldWaterMeterTypeId',WaterMeterList,'升级前水表类型')"
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
    <el-form-item label="升级后水表类型" label-width="120px">
      <el-select
        v-model="selectHead.NewWaterMeterTypeId"
        placeholder="请选择"
        @keydown.enter.native="handleFilter"
        @change="getText(selectHead.NewWaterMeterTypeId,'NewWaterMeterTypeId',WaterMeterList,'升级后水表类型')"
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
      <el-select
        v-model="selectHead.CustomerQueryType"
        placeholder="请选择"
        style="width: 100px;float: left;margin-right:4px;"
        class="short-select"
        @change="getscName(selectHead.CustomerQueryType)"
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
        @change="getText(selectHead.CustomerQueryValue,'CustomerQueryValue','',secNmae)"
        style="width: 180px;float: left"
      />
    </el-form-item>
    <el-form-item label="操作员" label-width="80">
      <el-select
        v-model="selectHead.UpgradeEmpId"
        placeholder="请选择"
        @keydown.enter.native="handleFilter"
        @change="getText(selectHead.UpgradeEmpId,'UpgradeEmpId',editUserList,'操作员')"
      >
        <el-option label="全部" value="-1" />
        <el-option v-for="item in editUserList" :key="item.Id" :label="item.Name" :value="item.Id" />
      </el-select>
    </el-form-item>

    <el-form-item label="升级日期">
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
      <el-button type="primary" size="mini" @click="handleFilter">
        <i class="iconfont iconsousuo"></i>搜索
      </el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { getDictionaryOption } from "@/utils/permission"; //获取字典项
import { getName } from "@/utils/projectLogic"; //搜索条件面包屑
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
      companyParentOptions: [], //水厂
      companyShow: true,
      userTypeList: [],
      WaterMeterList: [],
      secNmae: ""
    };
  },
  created() {
    this.companyParentOptions = this.$store.state.user.waterWorks;
    if (this.companyParentOptions.length == 1) {
      // console.log(this.companyOptions)
      this.selectHead.SA_WaterFactory_Id = this.companyParentOptions[0].Id;
      this.companyShow = false;
    }
    this.userTypeList = getDictionaryOption("用户类型");
    this.WaterMeterList = getDictionaryOption("水表类型");
  },
  methods: {
    getscName(id) {
      this.secNmae = getName(id);
    },
    getText(val, model, arr, name) {
      this.$emit("getText", val, model, arr, name);
    },
    getTime(v) {
      let date;
      if (v) {
        this.selectHead.StartUpgradeDate = v[0];
        this.selectHead.EndUpgradeDate = v[1];
        date =
          this.selectHead.StartUpgradeDate +
          "~" +
          this.selectHead.EndUpgradeDate;
        this.$emit("getText", date, "timevalue", "", "升级日期");
      } else {
        this.selectHead.StartUpgradeDate = "";
        this.selectHead.EndUpgradeDate = "";
        date = "";
        this.$emit("getText", date, "timevalue", "", "升级日期");
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

