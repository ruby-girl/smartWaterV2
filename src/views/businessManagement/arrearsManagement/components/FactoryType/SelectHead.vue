<template>
  <div class="position-search-head">
    <el-form
      :inline="true"
      :model="selectHead"
      :class="{'position-absolute-head-shadow':isShow,'head-search-form form-inline-small-input position-absolute-head':true}"
      size="small"
      label-width="68px"
      @submit.native.prevent
      ref="formHeight"
    >
      <el-form-item label="水厂" prop="SA_WaterFactory_Id" :label-width="(searchWidth>1700)||!isShow?'40px':''" v-if="this.waterWorks.length>1">
        <el-select
          v-model="selectHead.SA_WaterFactory_Id"
          placeholder="请选择"
          @keydown.enter.native="handleFilterFactory"
          @change="getText(selectHead.SA_WaterFactory_Id,'SA_WaterFactory_Id',waterWorks,'水厂')"
        >
          <el-option label="全部" value="-1" />
          <el-option v-for="item in waterWorks" :key="item.Id" :label="item.Name" :value="item.Id" />
        </el-select>
      </el-form-item>
      <el-form-item label="费用类型" prop="Enumot">
        <el-select
          v-model="selectHead.Enumot"
          placeholder="请选择"
          @keydown.enter.native="handleFilterFactory"
          @change="getText(selectHead.Enumot,'Enumot',Enumot,'费用类型')"
        >
          <el-option label="全部" value="-1" />
          <el-option v-for="item in Enumot" :key="item.Id" :label="item.Name" :value="item.Id" />
        </el-select>
      </el-form-item>
      <transition-group name="fade">
      <el-form-item label="用户类型" prop="Enumut" key="state" v-show="showLabel(2)||isShow">
        <el-select
          v-model="selectHead.Enumut"
          placeholder="请选择"
          @keydown.enter.native="handleFilterFactory"
          @change="getText(selectHead.Enumut,'Enumut',Enumut,'用户类型')"
        >
          <el-option label="全部" value="-1" />
          <el-option v-for="item in Enumut" :key="item.Id" :label="item.Name" :value="item.Id" />
        </el-select>
      </el-form-item>
      <el-form-item label="水表类型" prop="Enumwm" key="Enumwm" v-show="showLabel(3)||isShow">
        <el-select
          v-model="selectHead.Enumwm"
          placeholder="请选择"
          @keydown.enter.native="handleFilterFactory"
          @change="getText(selectHead.Enumwm,'Enumwm',Enumwm,'水表类型')"
        >
          <el-option label="全部" value="-1" />
          <el-option v-for="item in Enumwm" :key="item.Id" :label="item.Name" :value="item.Id" />
        </el-select>
      </el-form-item>
      <el-form-item label="费用状态" prop="Enumcf" key="Enumcf" v-show="showLabel(4)||isShow">
        <el-select
          v-model="selectHead.Enumcf"
          placeholder="请选择"
          @keydown.enter.native="handleFilterFactory"
          @change="getText(selectHead.Enumcf,'Enumcf',Enumcf,'费用状态')"
        >
          <el-option label="全部" value="-1" />
          <el-option v-for="item in Enumcf" :key="item.Id" :label="item.Name" :value="item.Id" />
        </el-select>
      </el-form-item>
      <el-form-item label="欠费日期" prop="timevalue" v-show="isShow" key="timevalue">
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
          @change="getTime"
          @keydown.enter.native="handleFilterFactory"
        ></el-date-picker>
      </el-form-item>
      </transition-group>
      <el-form-item>
        <span class="isShow" :class="{tro:isShow}" v-show="ShowIcon">
          <i class="icon iconfont iconjianqu3" @click="isShow=!isShow"></i>
        </span>
        <el-button round type="primary" size="mini" @click="handleFilter">
          <i class="iconfont iconsousuo"></i>搜索
        </el-button>
        <el-button class="btn-resetting" round plain type="primary" size="mini" @click="resetting">
          <i class="iconfont icon_zhongzhi"></i>重置
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getDictionaryOption } from "@/utils/permission";
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
       Enumot: [], //费用类型
      Enumut: [], //用户类型
      Enumwm: [], //水表类型
       Enumcf: [
        { Name: "未缴费", Id: "1002" },
        { Name: "审批中", Id: "1003" },
        { Name: "已撤销", Id: "1004" }
      ], //费用状态
      userType: [], //用户类型
      waterType: [], //水表类型
      waterWorks: [], //水厂
      isShow: false,
      ShowIcon: true,
      searchWidth: 0,
      secNmae: "用户编号"
    };
  },
  created() {
    this.searchWidth = document.body.clientWidth - 160; //160左侧导航宽度
    this.waterWorks = this.$store.state.user.waterWorks;
    if (this.waterWorks.length == 1) {
      this.selectHead.SA_WaterFactory_Id = this.waterWorks[0].Id;
    }
    this.Enumwm = getDictionaryOption("水表类型");
    this.Enumut = getDictionaryOption("用户类型");
    this.Enumot = getDictionaryOption("费用类型");
  },
  methods: {
     getTime(v) {
      let date;
      if (v) {
        this.selectHead.Star_ArrearsDate  = v[0] + " 00:00:00";
        this.selectHead.End_ArrearsDate = v[1] + " 23:59:59";
        date = v[0] + "~" + v[1];
      } else {
        this.selectHead.Star_ArrearsDate = "";
        this.selectHead.End_ArrearsDate = "";
        date = "";
      }
      this.$emit("getText", date, "timevalue", "", "欠费日期");
    },
    getscName(id) {
      this.secNmae = id == 1 ? "用户编号" : "用户姓名";
      this.getText(
        this.selectHead.customerQueryValue,
        "customerQueryValue",
        "",
        this.secNmae
      );
    },
    getText(val, model, arr, name) {
      this.$emit("getText", val, model, arr, name);
    },
    showLabel(n) {
      if (this.waterWorks.length == 1) n = n - 1;
      if (Math.floor((this.searchWidth - 180) / 260) > n || this.isShow)
        return true;
      return false;
    },
    handleFilter() {
      this.$emit("handleFilter");
    },
     resetting(){//重置
      this.$refs['formHeight'].resetFields();  
       this.$parent.tipsDataCopy=[]
      this.$parent.delTips("timevalue")
    }
  }
};
</script>
<style lang="scss" scoped>
</style>

