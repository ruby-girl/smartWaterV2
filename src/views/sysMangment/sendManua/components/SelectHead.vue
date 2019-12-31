<template>
  <div class="position-search-head">
    <el-form
      :inline="true"
      :model="selectHead"
      :class="{'position-absolute-head-shadow':isShow,'head-search-form form-inline-small-input position-absolute-head':true}"
      size="small"
      label-width="65px"
      @submit.native.prevent
      ref="formHeight"
    >
      <el-form-item v-show="show1||isShow" key="CustomerQueryType" prop="CustomerQueryValue">
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
      <el-form-item label="水表类型" v-show="show2||isShow" prop="WaterTypeId">
        <el-select
          v-model="selectHead.WaterTypeId "
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
          @change="getText(selectHead.WaterTypeId ,'WaterTypeId',WaterMeterList,'水表类型')"
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
      <el-form-item label="区域选择" v-show="show3||isShow" prop="AreaId">
        <el-select
          v-model="selectHead.AreaId "
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
          @change="getText(selectHead.AreaId ,'AreaId',WaterMeterList,'区域选择')"
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
import { getName } from "@/utils/projectLogic"; //搜索条件面包屑
export default {
  props: {
    searchWidth: {}
  },
  data() {
    return {
      selectHead: {},
      // warterMeterPlanDate: [],
      companyOptions: [],
      WaterMeterList: [], //
      planStateOptions: [],
      companyShow: true,
      isShow: false,
      show1: true,
      show2: true,
      show3: true,
      showBtn: false,
      secNmae: ""
    };
  },
  watch: {
    searchWidth: {
      handler(val, oldVal) {
        this.show1 = this.showLabel(1, val);
        this.show2 = this.showLabel(2, val);
        this.show3 = this.showLabel(3, val);

        if (Math.floor((val - 200) / 280) >= 3) {
          this.showBtn = false;
        } else {
          this.showBtn = true;
        }
      },
      immediate: true
    }
  },
  created() {
    this.WaterMeterList = getDictionaryOption("水表类型");
  },
  methods: {
    getscName(id) {
      this.secNmae = getName(id);
    },
    resetting() {
      //重置
      this.$refs["formHeight"].resetFields();
      this.$parent.tipsDataCopy = [];
    },
    showLabel(n, w) {
      if (Math.floor((w - 200) / 280) >= n || this.isShow) {
        return true;
      }
      return false;
    },
    handleFilter() {
      this.$parent.searchTableList();
    },
    getText(val, model, arr, name) {
      this.$emit("getText", val, model, arr, name);
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

