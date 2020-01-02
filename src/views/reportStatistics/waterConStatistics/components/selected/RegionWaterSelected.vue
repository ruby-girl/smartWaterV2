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
      <el-form-item label="区域" v-show="show1||isShow" prop="UserType">
        <el-select
          v-model="selectHead.UserType"
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
          @change="getText(selectHead.UserType,'UserType',userTypeList,'区域')"
        >
          <el-option label="全部" :value="-1"></el-option>
          <el-option
            v-for="item in userTypeList"
            :key="item.Id"
            :label="item.Name"
            :value="item.Id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="水表类型" v-show="show2||isShow" prop="WaterType">
        <el-select
          v-model="selectHead.WaterType"
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
          @change="getText(selectHead.WaterType,'WaterType',WaterMeterList,'水表类型')"
        >
          <el-option label="全部" :value="-1"></el-option>
          <el-option
            v-for="item in WaterMeterList"
            :key="item.Id"
            :label="item.Name"
            :value="item.Id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="未缴费起止日期" label-width="110px" v-show="show3||isShow">
        <el-date-picker
          v-model="dateArr"
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
      show3: true,
      show4: true,
      show5: true,
      showBtn: false
    };
  },
  watch: {
    searchWidth: {
      handler(val, oldVal) {
        this.show1 = this.showLabel(1, val);
        this.show2 = this.showLabel(2, val);
        this.show3 = this.showLabel(3, val);

        if (Math.floor((val - 200) / 280) < 4) {
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
        this.selectHead.createStartTime = date[0];
        this.selectHead.createEndTime = date[1];
        dateStipe =
          this.selectHead.createStartTime.split(" ")[0] +
          "~" +
          this.selectHead.createEndTime.split(" ")[0];
        this.$emit("getText", dateStipe, "dateArr", "", "业务办理日期");
      } else {
        this.selectHead.createStartTime = "";
        this.selectHead.createEndTime = "";
        dateStipe = "";
        this.$emit("getText", dateStipe, "dateArr", "", "业务办理日期");
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