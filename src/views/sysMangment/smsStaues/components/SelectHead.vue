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
      <el-form-item label="短信状态" v-show="show1||isShow" prop="SendState">
        <el-select
          v-model="selectHead.SendState"
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
          @change="getText(selectHead.SendState,'SendState',senStateList,'短信状态')"
        >
          <el-option label="全部" value></el-option>
          <el-option
            v-for="item in senStateList"
            :key="item.Id"
            :label="item.Name"
            :value="item.Id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="模板名称" v-show="show2||isShow" prop="TemplateId">
        <el-select
          v-model="selectHead.TemplateId"
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
          @change="getText(selectHead.TemplateId,'TemplateId',templateNmaeList,'模板名称')"
        >
          <el-option label="全部" value></el-option>
          <el-option
            v-for="item in templateNmaeList"
            :key="item.Id"
            :label="item.Name"
            :value="item.Id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-show="show3||isShow" key="CustomerQueryType " prop="CustomerQueryValue">
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
      <el-form-item label="水表类型" v-show="show4||isShow"  prop="WaterMeterType">
        <el-select
          v-model="selectHead.WaterMeterType "
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
          @change="getText(selectHead.WaterMeterType ,'WaterMeterType',WaterMeterList,'水表类型')"
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
      <el-form-item label="区域选择" v-show="show5||isShow" prop="AreaId">
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
      <el-form-item
        label="定时发送时间"
        label-width="90px"
        v-show="show6||isShow"
        prop="warterMeterPlanDate"
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
import { getTemplateName } from "@/api/shotMsg"; //获取模板列表
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
      secNmae:"",
      isShow: false,
      show1: true,
      show2: true,
      show3: true,
      show4: true,
      show5: true,
      showBtn: false,
      templateNmaeList: [], //名称列表
      senStateList: [
        {
          Id: 0,
          Name: "发送失败"
        },
        {
          Id: 1,
          Name: "发送成功"
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
        this.show6 = this.showLabel(6, val);
        if (Math.floor((val - 200) / 280) >= 6) {
          this.showBtn = false;
        } else {
          this.showBtn = true;
        }
      },
      immediate: true
    }
  },
  created() {
    this.getNameList();
    this.WaterMeterList = getDictionaryOption("水表类型");
  },
  methods: {
    getscName(id) {
      this.secNmae = getName(id);
    },
    //获取模板名称
    getNameList() {
      getTemplateName({ isSysTemplate: "" }).then(res => {
        this.templateNmaeList = [];
        res.data.forEach(element => {
          let obj = {
            Id: element.Id,
            Name: element.TemplateName
          };
          this.templateNmaeList.push(obj);
        });
      });
    },
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

