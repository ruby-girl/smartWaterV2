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
      <el-form-item v-show="show1||isShow" key="customerQueryType">
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
      <el-form-item label="水表类型" v-show="show2||isShow">
        <el-select
          v-model="selectHead.WaterMeter "
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
          @change="getText(selectHead.WaterMeter ,'WaterMeter',WaterMeterList,'水表类型')"
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
      <el-form-item label="区域选择" v-show="show3||isShow">
        <el-select
          v-model="selectHead.WaterMeter "
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
          @change="getText(selectHead.WaterMeter ,'WaterMeter',WaterMeterList,'区域选择')"
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
      WaterMeterList: [], //
      planStateOptions: [],
      companyShow: true,
      isShow: false,
      show1: true,
      show2: true,
      show3: true,
  
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
    resetting() {
      //重置
      this.$refs["formHeight"].resetFields();
      this.$parent.tipsDataCopy = [];
      this.$parent.delTips("warterMeterPlanDate");
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

