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
      <el-form-item label="模板名称" v-show="show1||isShow">
        <el-select
          v-model="selectHead.SA_WaterFactory_Id"
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
          @change="getText(selectHead.SA_WaterFactory_Id,'SA_WaterFactory_Id',companyOptions,'模板名称')"
        >
          <el-option label="全部" value="-1"></el-option>
          <el-option
            v-for="item in companyOptions"
            :key="item.Id"
            :label="item.Name"
            :value="item.Id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="模板类型" v-show="show2||isShow" key="templateType" label-width="70px">
        <el-select
          v-model="selectHead.templateType"
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
          @change="getText(selectHead.templateType,'templateType',templateType,'模板类型')"
        >
          <el-option label="请选择" value></el-option>
          <el-option
            v-for="item in templateType"
            :key="item.Id"
            :label="item.Name"
            :value="item.Id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发送方式" v-show="show3||isShow" key="sendType" label-width="70px">
        <el-select
          v-model="selectHead.sendType"
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
          @change="getText(selectHead.sendType,'sendType',sendType,'发送方式')"
        >
          <el-option label="全部" value="-1"></el-option>
          <el-option
            v-for="item in sendType"
            :key="item.Id"
            :label="item.Name"
            :value="item.Id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发送时间" v-show="show4||isShow" key="sendTime" label-width="70px">
        <el-select
          v-model="selectHead.sendTime"
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
          @change="getText(selectHead.sendTime,'sendTime',sendTime,'发送方式')"
        >
          <el-option label="全部" value="-1"></el-option>
          <el-option
            v-for="item in sendTime"
            :key="item.Id"
            :label="item.Name"
            :value="item.Id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="定时发送时间"
        label-width="90px"
        v-show="show5||isShow"
        key="warterMeterPlanDate"
      >
        <el-date-picker
          v-model="selectHead.warterMeterPlanDate"
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
import { getSelectUser } from "@/api/account"; //获取操作人下拉框
import { getDictionaryOption } from "@/utils/permission";
export default {
  props: {
    searchWidth: {}
  },
  data() {
    return {
      selectHead: {},
      // warterMeterPlanDate: [],
      companyOptions: [],
      planStateOptions: [],
      companyShow: true,
      isShow: false,
      show1: true,
      show2: true,
      show3: true,
      show4: true,
      show5: true,
      showBtn: false,
      templateType: [
        //模板类型
        {
          Id: "0",
          Name: "系统"
        },
        {
          Id: "1",
          Name: "自定义"
        }
      ],
      sendType: [
        //模板类型
        {
          Id: "0",
          Name: "自动发送"
        },
        {
          Id: "1",
          Name: "手动发送"
        }
      ],
      sendTime: [
        //模板类型
        {
          Id: "0",
          Name: "及时发送"
        },
        {
          Id: "1",
          Name: "定时发送"
        }
      ]
    };
  },
  watch: {
    searchWidth: {
      handler(val, oldVal) {
        this.show1 = this.showLabel(1, val);
        this.show2 = this.showLabel(2, val);
        this.show3 = this.showLabel(3, val);
        this.show4 = this.showLabel(4, val);
        this.show5 = this.showLabel(5, val);
        if (Math.floor((val - 180) / 280) >= 5) {
          this.showBtn = false;
        } else {
          this.showBtn = true;
        }
      },
      immediate: true
    }
  },

  methods: {
    resetting() {
      //重置
      this.$refs["formHeight"].resetFields();
      this.$parent.tipsDataCopy = [];
      this.$parent.delTips("warterMeterPlanDate");
    },
    showLabel(n, w) {
      if (Math.floor((w - 180) / 280) >= n || this.isShow) {
        return true;
      }
      return false;
    },
    handleFilter() {
      this.$parent.searchTableList();
    },
    getText(val, model, arr, name) {
      this.$emit("getText", val, model, arr, name);
    },
    getTime() {
      //时间格式化
      const date = this.selectHead.warterMeterPlanDate;
      let date1;
      if (date) {
        this.selectHead.createStartTime = date[0];
        this.selectHead.createEndTime = date[1];
        date1 =
          this.selectHead.createStartTime.split(" ")[0] +
          "~" +
          this.selectHead.createEndTime.split(" ")[0];
        this.$emit("getText", date1, "warterMeterPlanDate", "", "升级日期");
      } else {
        this.selectHead.createStartTime = "";
        this.selectHead.createEndTime = "";
        date1 = "";
        this.$emit("getText", date1, "warterMeterPlanDate", "", "升级日期");
      }
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

