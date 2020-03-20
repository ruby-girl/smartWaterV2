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
      <el-form-item
        label="水厂"
        :label-width="isShow?'68px':'40px'"
        prop="SA_WaterFactory_Id"
        v-show="show1||isShow"
      >
        <el-select
          v-model="selectHead.SA_WaterFactory_Id"
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
          @change="getText(selectHead.SA_WaterFactory_Id,'SA_WaterFactory_Id',companyOptions,'水厂')"
        >
          <el-option label="全部" v-if="companyOptions.length!=1" value="-1"></el-option>
          <el-option
            v-for="item in companyOptions"
            :key="item.Id"
            :label="item.Name"
            :value="item.Id"
          ></el-option>
        </el-select>
      </el-form-item>

      <!-- <el-form-item label="水表类型" v-show="show1||isShow" prop="WaterType">
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
      </el-form-item>-->

      <el-form-item label="日期" label-width="40px" v-show="show2||isShow">
        <el-date-picker
          v-model="dateArr"
          type="monthrange"
          :editable="false"
          :unlink-panels="true"
          range-separator="~"
          start-placeholder="开始月份"
          end-placeholder="结束月份"
          value-format="yyyy-MM"
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
import { getLabelName } from "@/utils/projectLogic"; //获取lable
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
      this.selectHead.WaterFactoryName=getLabelName(this.selectHead.SA_WaterFactory_Id,this.companyOptions)
      this.$parent.searchTableList();
    },
    getText(val, model, arr, name) {
      this.$emit("getText", val, model, arr, name);
    },
    getTime() {
      //时间格式化
      let date = this.dateArr;
      if (date) {
        this.selectHead.YearMonth = date[0] + "~" + date[1];

        this.$emit("getText", this.selectHead.YearMonth, "dateArr", "", "日期");
      } else {
        this.selectHead.YearMonth=""
        this.$emit("getText", this.selectHead.YearMonth, "dateArr", "", "日期");
      }
    }
  },
  created() {
  
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
}
</style>