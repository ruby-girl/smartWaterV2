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
        </el-select>
        <el-input
          v-model="selectHead.CustomerQueryType==1?selectHead.UserNo:selectHead.UserName"
          maxlength="20"
          placeholder="(长度1-30)"
          @keyup.enter.native="handleFilter"
          @change="getText(selectHead.CustomerQueryValue,'CustomerQueryValue','',secNmae)"
          style="width: 180px;float: left"
        />
      </el-form-item>

      <el-form-item label="日期" label-width="110px" v-show="show2||isShow">
        <el-date-picker
          v-model="dateArr"
          type="monthrange"
          :editable="false"
          :unlink-panels="true"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @keydown.enter.native="handleFilter"
          @change="getTime"
        />
      </el-form-item>
      <el-form-item>
        <span class="isShow" :class="{tro:isShow}" v-if="showBtn">
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
  </div>
</template>
<script>
import { getDictionaryOption } from "@/utils/permission";
import { getSelectUser } from "@/api/account"; //获取操作人下拉框
export default {
  props: {
    searchWidth: {}
  },
  data() {
    return {
      companyOptions: [], //水厂
      WaterMeterList: [], //水表类型
      userTypeList: [], //用户类型
      editUserList: [], //操作员、经办人
      selectHead: {},
      planStateOptions: [],
      dateArr: [], //日期数组
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
        if (Math.floor((val - 200) / 280) < 3) {
          this.showBtn = true;
        } else {
          this.showBtn = false;
        }
      },
      immediate: true
    }
  },
  created() {},
  methods: {
    resetting() {
      //重置
      this.$refs["formHeight"].resetFields();
      this.$parent.tipsDataCopy = [];
      this.$parent.delTips("dateArr");
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
      let date = this.dateArr;
      let dateStipe;
      if (date) {
        this.selectHead.StartDate = date[0];
        this.selectHead.EndDate = date[1];
        dateStipe =
          this.selectHead.StartDate.split(" ")[0] +
          "~" +
          this.selectHead.EndDate.split(" ")[0];
        this.$emit("getText", dateStipe, "dateArr", "", "日期");
      } else {
        this.selectHead.StartDate = "";
        this.selectHead.EndDate = "";
        dateStipe = "";
        this.$emit("getText", dateStipe, "dateArr", "", "日期");
      }
    }
  },
  created() {
    this.WaterMeterList = getDictionaryOption("水表类型");
    this.userTypeList = getDictionaryOption("用户类型");
    this.editUserList = getDictionaryOption("口径类型");
    this.companyOptions = this.$store.state.user.waterWorks;
    if (this.companyOptions.length == 1) {
      this.selectHead.SA_WaterFactory_Id = this.companyOptions.Id;
    }
    // getSelectUser().then(res => {
    //   this.editUserList = res.data;
    // });
  },
  mounted() {
    this.selectHead = this.$parent.selectHead;
  }
};
</script>
<style lang="scss" scoped>
.el-form {
  width: 100%;
  .waterNum {
    .el-input {
      width: 106px;
    }
    /deep/.el-input__inner {
      width: 106px !important;
    }
  }
}
</style>