<template>
  <el-form
    :inline="true"
    :model="selectHead"
    class="head-search-form form-inline-small-input"
    size="small"
    label-width="75px"
    @submit.native.prevent
  >
    <el-form-item label="水厂" v-if="this.waterWorks.length>1">
      <el-select
        v-model="selectHead.waterFactoryId"
        placeholder="请选择"
        @keydown.enter.native="handleFilter"
        @change="getText(selectHead.waterFactoryId,'waterFactoryId',waterWorks,'水厂')"
      >
        <el-option label="全部" value="-1" />
        <el-option v-for="item in waterWorks" :key="item.Id" :label="item.Name" :value="item.Id" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-select
        v-model="selectHead.customerQueryType"
        placeholder="请选择"
        class="user-select-box"
        style="width: 100px;float: left;margin-right:3px;"
         @change="getscName(selectHead.customerQueryValue)"
      >
        <el-option label="用户编号" value="1"></el-option>
        <el-option label="用户姓名" value="2"></el-option>
      </el-select>
      <el-input
        v-model="selectHead.customerQueryValue"
        maxlength="20"
        @keyup.enter.native="handleFilter"
        @change="getText(selectHead.customerQueryValue,'customerQueryValue','',secNmae)"
        style="width: 180px;float: left"
      />
    </el-form-item>
    <el-form-item label="用户类型">
      <el-select
        v-model="selectHead.userType"
        placeholder="请选择"
        @keydown.enter.native="handleFilter"
        @change="getText(selectHead.userType,'UserType',userType,'用户类型')"
      >
        <el-option label="全部" value="-1" />
        <el-option v-for="item in userType" :key="item.Id" :label="item.Name" :value="item.Id" />
      </el-select>
    </el-form-item>
    <el-form-item label="水表类型">
      <el-select
        v-model="selectHead.waterMeterType"
        placeholder="请选择"
        @keydown.enter.native="handleFilter"
        @change="getText(selectHead.waterMeterType,'waterMeterType',waterType,'水表类型')"
      >
        <el-option label="全部" value="-1" />
        <el-option v-for="item in waterType" :key="item.Id" :label="item.Name" :value="item.Id" />
      </el-select>
    </el-form-item>
    <el-form-item label="换表操作员">
      <el-select
        v-model="selectHead.createUserId"
        placeholder="请选择"
        @keydown.enter.native="handleFilter"
        @change="getText(selectHead.createUserId,'createUserId',editUserList,'换表操作员')"
      >
        <el-option label="全部" value="-1" />
        <el-option v-for="item in editUserList" :key="item.Id" :label="item.Name" :value="item.Id" />
      </el-select>
    </el-form-item>
    <el-form-item label="换表类型">
      <el-select
        v-model="selectHead.changeMeterType"
        placeholder="请选择"
        @keydown.enter.native="handleFilter"
        @change="getText(selectHead.changeMeterType,'changeMeterType',changeType,'换表类型')"
      >
        <el-option label="全部" value="-1" />
        <el-option v-for="item in changeType" :key="item.Id" :label="item.Name" :value="item.Id" />
      </el-select>
    </el-form-item>
    <el-form-item label="换表日期">
      <el-date-picker
        v-model="selectHead.timevalue"
        type="daterange"
        :editable="false"
        :unlink-panels="true"
        range-separator="~"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        @keydown.enter.native="handleFilter"
        @change="getTime"
      ></el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-button round type="primary" size="mini" @click="handleFilter">
        <i class="iconfont iconsousuo"></i>搜索
      </el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { getSelectUser } from "@/api/account"; //获取操作人下拉框
import { getDictionaryOption } from "@/utils/permission"; //字典
import { getName } from "@/utils/projectLogic"; //搜索条件面包屑
export default {
  props: {
    selectHead: {}
  },
  data() {
    return {
      editUserList: [],
      userType: [],
      waterType:[],//水表类型
      waterWorks: [], //水厂
      changeType: [{ Name: "以旧换新", Id: "3401" }, { Name: "用户互换", Id: "3402" }],
      secNmae:''
    };
  },
  created() {
    this.waterWorks = this.$store.state.user.waterWorks;
    if (this.waterWorks.length == 1) {
      this.selectHead.SA_WaterFactory_Id = this.waterWorks[0].Id;
    }
    this.userType = getDictionaryOption("用户类型");
    this.waterType = getDictionaryOption("水表类型");
    getSelectUser().then(res => {
      //操作人
      this.editUserList = res.data;
    });
  },
  methods: {
    getscName(id) {
      this.secNmae = getName(id);
    },
    getText(val, model, arr,name) {
      this.$emit("getText", val, model, arr,name);
    },
    getTime(v) {
      let date;
      if (v) {
        this.selectHead.Star_TransferDate = v[0] + " 00:00:00";
        this.selectHead.End_TransferDate = v[1] + " 23:59:59";
         date =v[0]+"~" +v[1];
      } else {
        this.selectHead.Star_TransferDate = "";
        this.selectHead.End_TransferDate = "";
        date=''
      }
        this.$emit("getText", date, "timevalue", "", "销户日期");
    },
    handleFilter() {
      this.$emit("handleFilter", this.selectHead);
    }
  }
};
</script>
<style lang="scss" scoped>
</style>

