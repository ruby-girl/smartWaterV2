<template>
  <el-form
    :inline="true"
    :model="selectHead"
    :class="{'position-absolute-head-shadow':isShow,'head-search-form form-inline-small-input position-absolute-head':true}"
    size="small"
    label-width="80px"
    @submit.native.prevent
    ref="formHeight"
  >
    <el-form-item v-if="companyShow" label="水厂" label-width="40px" prop="waterFactoryId">
      <el-select
        v-model="selectHead.waterFactoryId "
        placeholder="请选择"
        @keydown.enter.native="handleFilter"
        @change="getText(selectHead.waterFactoryId,'waterFactoryId',companyParentOptions,'水厂')"
        吗
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
    <transition-group name="fade">
      <el-form-item
        label="用户类型"
        v-show="show1||isShow"
        key="userType"
        label-width="70px"
        prop="userType"
      >
        <el-select
          v-model="selectHead.userType"
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
          @change="getText(selectHead.userType,'userType',userTypeList,'用户类型')"
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
      <el-form-item label="水表类型" v-show="show2||isShow" key="waterMeterType" prop="waterMeterType">
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
      <el-form-item v-show="show3||isShow" key="CustomerQueryType" prop="CustomerQueryValue">
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
      <el-form-item
        label="销户操作员"
        label-width="80"
        v-show="show4||isShow"
        key="createUserId"
        prop="createUserId"
      >
        <el-select
          v-model="selectHead.createUserId"
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
          @change="getText(selectHead.createUserId,'createUserId',editUserList,'销户操作员')"
        >
          <el-option label="全部" value="-1" />
          <el-option
            v-for="item in editUserList"
            :key="item.Id"
            :label="item.Name"
            :value="item.Id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="销户日期" v-show="show5||isShow" key="timevalue" prop="timevalue">
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
    </transition-group>
    <el-form-item>
      <span class="isShow" v-if="showBtn" :class="{tro:isShow}">
        <i class="icon iconfont iconjianqu3" @click="isShow=!isShow"></i>
      </span>
      <el-button round type="primary" size="mini" @click="handleFilter">
        <i class="iconfont iconsousuo"></i>
        搜索
      </el-button>
      <el-button class="btn-resetting" round plain type="primary" size="mini" @click="resetting">
        <i class="iconfont icon_zhongzhi"></i>重置
      </el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { getDictionaryOption } from "@/utils/permission"; //获取字典项
import { getName } from "@/utils/projectLogic"; //搜索条件面包屑
export default {
  props: {
    selectHead: {},
    editUserList: {
      type: Array,
      default: function() {
        return [];
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
        this.show5 = this.showLabel(5, val);
        if (!this.showLabel(5, val)) {
          this.showBtn = "ture";
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      companyParentOptions: [], //水厂
      companyShow: true,
      userTypeList: [],
      WaterMeterList: [],
      secNmae: "",
      isShow: false,
      show1: true,
      show2: true,
      show3: true,
      show4: true,
      show5: true,
      showBtn: false
    };
  },

  created() {
    this.companyParentOptions = this.$store.state.user.waterWorks;
    if (this.companyParentOptions.length == 1) {
      this.selectHead.SA_WaterFactory_Id = this.companyParentOptions[0].Id;
      this.companyShow = false;
    }
    this.userTypeList = getDictionaryOption("用户类型");
    this.WaterMeterList = getDictionaryOption("水表类型");
  },
  methods: {
    resetting() {
      //重置
      this.$refs["formHeight"].resetFields();
      this.$parent.$parent.$parent.tipsDataCopy = [];
      this.$parent.$parent.$parent.delTips("timevalue");
    },
    showLabel(n, w) {
      if (this.companyParentOptions.length == 1) {
        if (Math.floor((w - 180) / 280) >= n || this.isShow) return true;
        return false;
      } else {
        if (Math.floor((w - 180) / 280) >= n + 1 || this.isShow) return true;
        return false;
      }
    },
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
<style lang="scss" scoped>
.el-form {
  margin-top: 17px;
}
</style>

