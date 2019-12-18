<template>
  <div class="position-search-head">
    <el-form
      :inline="true"
      :model="selectHead"
      :class="{'position-absolute-head-shadow':isShow,'head-search-form form-inline-small-input position-absolute-head':true}"
      size="small"
      label-width="70px"
      @submit.native.prevent
      ref="formHeight"
    >
      <el-form-item v-if="companyOptions.length!=1" label="所属水厂" prop="SA_WaterFactory_Id">
        <el-select
          v-model="selectHead.SA_WaterFactory_Id"
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
          @change="getText(selectHead.SA_WaterFactory_Id,'SA_WaterFactory_Id',companyOptions,'所属水厂')"
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
      <el-form-item label="申请类型" v-show="show1||isShow" prop="applyType">
        <el-select
          v-model="selectHead.applyType"
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
          @change="getText(selectHead.WaterMeter ,'WaterMeter',WaterMeterList,'申请状态')"
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
      <el-form-item label="业务编号" v-show="show2||isShow" prop="applyNo">
        <el-input
          v-model="selectHead.applyNo"
          maxlength="20"
          @keyup.enter.native="handleFilter"
          @change="getText(selectHead.applyNo ,'applyNo','','业务编号')"
        />
      </el-form-item>
      <el-form-item label="创建人" v-show="show3||isShow" prop="creater">
        <el-select
          v-model="selectHead.creater"
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
          @change="getText(selectHead.creater ,'creater',WaterMeterList,'创建人')"
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
      <el-form-item label="审核状态" v-show="show4||isShow" prop="aduitAdvise">
        <el-select
          v-model="selectHead.aduitAdvise"
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
          @change="getText(selectHead.aduitAdvise ,'aduitAdvise',WaterMeterList,'审核意见')"
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
      <el-form-item label="申请日期"  v-show="show5||isShow">
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
          @change="getTime(selectHead.timevalue,'timevalue')"
          @keydown.enter.native="handleFilter"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="审核日期" v-show="show6||isShow">
        <el-date-picker
          v-model="selectHead.timevalue1"
          type="datetimerange"
          :editable="false"
          :unlink-panels="true"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          @change="getTime(selectHead.timevalue1,'timevalue1')"
          @keydown.enter.native="handleFilter"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <span class="isShow" v-if="showBtn" :class="{tro:isShow}">
          <i class="icon iconfont iconjianqu3" @click="isShow=!isShow"></i>
        </span>
        <el-button type="primary" size="mini" @click="handleFilter" round>
          <i class="icon iconfont">&#xe694;</i>查询
        </el-button>
        <el-button class="btn-resetting" round plain type="primary" size="mini" @click="resetting">
          <i class="iconfont icon_zhongzhi"></i>重置
        </el-button>
        <!-- <el-button round size="mini" class="cl-reset" @click="resetFun('formName')"><i class="icon iconfont">&#xe64e;</i>重置</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getDictionaryOption } from "@/utils/permission"; //获取字典项
export default {
  name: "AduiteSelected",
  props: {
    selectHead: {
      type: Object,
      default: function() {
        return {};
      }
    },
    searchWidth: {}
  },
  watch: {
    searchWidth: {
      handler(val, oldVal) {
        this.showBtn = true;
        this.show1 = this.showLabel(1, val);
        this.show2 = this.showLabel(2, val);
        this.show3 = this.showLabel(3, val);
        this.show4 = this.showLabel(4, val);
        this.show5 = this.showLabel(5, val);
        this.show6 = this.showLabel(6, val);
        if (this.companyOptions.length == 1) {
          if (Math.floor((val - 180) / 280) >= 6) {
            this.showBtn = false;
          }
        } else {
          if (Math.floor((val - 180) / 280) >= 7) {
            this.showBtn = false;
          }
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      secNmae: "",
      WaterMeterList: [], //
      securStatus: [],
      securNextStatus: [],
      companyOptions: [], //水厂
      isShow: false,
      show1: true,
      show2: true,
      show3: true,
      show4: true,
      show5: true,
      show6: true,

      showBtn: true //查询展开
    };
  },
  created() {
    this.companyOptions = this.$store.state.user.waterWorks;
    if (this.companyOptions.length == 1) {
      this.selectHead.SA_WaterFactory_Id = this.companyOptions[0].Id;
    }
  },
  methods: {
    resetting() {
      //重置
      this.$refs["formHeight"].resetFields();
      this.$parent.tipsDataCopy = [];
      this.$parent.delTips("timevalue");
    },
    showLabel(n, w) {
      if (this.companyOptions.length == 1) {
        if (Math.floor((w - 180) / 280) >= n || this.isShow) {
          return true;
        }
        return false;
      } else {
        if (Math.floor((w - 180) / 280) >= n + 1 || this.isShow) {
          return true;
        }
        return false;
      }
    },

    getText(val, model, arr, name) {
      this.$emit("getText", val, model, arr, name);
    },
    //日期格式化
    getTime(v, n) {
      let date;
      if (v) {
        this.selectHead.StartTime = v[0];
        this.selectHead.EndTime = v[1];
        date = this.selectHead.StartTime + "~" + this.selectHead.EndTime;
        if (n == "timevalue1") {
          this.$emit("getText", date, n, "", "审核日期");
        }
        if (n == "timevalue") {
          this.$emit("getText", date, n, "", "申请日期");
        }
      } else {
        this.selectHead.StartTime = "";
        this.selectHead.EndTime = "";
        date = "";
        if (n == "timevalue1") {
          this.$emit("getText", date, n, "", "审核日期");
        }
        if (n == "timevalue") {
          this.$emit("getText", date, n, "", "申请日期");
        }
      }
    },
    handleFilter() {
      this.$parent.searchTableList();
      //   this.$emit("handleFilter");
      // this.$parent.seachAccountOrder()
    }
  }
};
</script>