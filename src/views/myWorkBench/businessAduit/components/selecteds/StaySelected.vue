<template>
  <div class="position-search-head">
    <el-form
      :inline="true"
      :model="query"
      :class="{'position-absolute-head-shadow':isShow,'head-search-form form-inline-small-input position-absolute-head':true}"
      size="small"
      label-width="64px"
      @submit.native.prevent
      ref="formHeight"
    >
      <el-form-item v-if="companyOptions.length!=1" label="所属水厂" prop="SA_WaterFactory_Id">
        <el-select
          v-model="query.WaterFactoryId"
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
          @change="getText(query.WaterFactoryId,'WaterFactoryId',companyOptions,'所属水厂')"
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
          v-model="query.ProcessMenuCode"
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
          @change="getText(query.ProcessMenuCode ,'ProcessMenuCode',applyArray,'申请类型')"
        >
          <el-option
            v-for="item in applyArray"
            :key="item.Id"
            :label="item.Id=='2900'? '全部':item.Name"
            :value="Number(item.Id)" />
        </el-select>
      </el-form-item>
      <el-form-item label="业务编号" v-show="show2||isShow" prop="applyNo">
        <el-input
          v-model="query.FlowNo"
          maxlength="20"
          @keyup.enter.native="handleFilter"
          @change="getText(query.FlowNo ,'FlowNo','','业务编号')"
        />
      </el-form-item>
      <el-form-item label="创建人" v-show="show3||isShow" prop="creater">
        <el-select
          v-model="query.createUserId"
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
          @change="getText(query.createUserId ,'createUserId',WaterMeterList,'创建人')"
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

      <el-form-item label="申请日期"  v-show="show4||isShow">
        <el-date-picker
          v-model="query.timevalue"
          type="datetimerange"
          :editable="false"
          :unlink-panels="true"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          @change="getTime"
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
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getDictionaryOption } from "@/utils/permission"; //获取字典项
export default {
  name: "StaySelected",
  props: {
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
        if (this.companyOptions.length == 1) {
          if (Math.floor((val - 180) / 280) >= 5) {
            this.showBtn = false;
          }
        } else {
          if (Math.floor((val - 180) / 280) >= 4) {
            this.showBtn = false;
          }
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      applyArray: [], //申请类型
      query: {
        ProcessState: 0,
        VerifyState: 0,
        WaterFactoryId: "",
        ProcessMenuCode: 2900,
        FlowNo: "",
        createUserId: "",
        createStartTime: "",
        createEndTime: "",
        editUserId: "",
        editStartTime: "",
        editEndTime: "",
        limit: 20,
        page: 1,
        sort: "",
        filed: "",
        tableId: "0000035"
      }, //查询对象
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
      showBtn: true //查询展开
    };
  },
  created() {
    this.companyOptions = this.$store.state.user.waterWorks;//水厂
    if (this.companyOptions.length == 1) {
      this.query.WaterFactoryId = this.companyOptions[0].Id;
    }
    this.applyArray = getDictionaryOption('流程编码')//申请类型
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
    getTime(v) {
      let date;
      if (v) {
        this.query.createStartTime = v[0] + "00:00:00";
        this.query.createEndTime = v[1] + "23:59:59";
        date = this.query.createStartTime + "~" + this.query.createEndTime;
        this.$emit("getText", date, "timevalue", "", "申请日期");
      } else {
        this.query.createStartTime = "";
        this.query.createEndTime = "";
        date = "";
        this.$emit("getText", date, "timevalue", "", "申请日期");
      }
    },
    handleFilter() {
      this.$parent.query = Object.assign({},this.query)
      this.$parent.searchTableList();
    }
  }
};
</script>
