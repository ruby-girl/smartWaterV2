<template>
  <div class="position-search-head">
    <el-form
      :inline="true"
      :model="query"
      :class="{'position-absolute-head-shadow':isShow,'head-search-form form-inline-small-input position-absolute-head':true}"
      size="small"
      label-width="64px"
      @submit.native.prevent
      ref="formHeight">
      <el-form-item label="申请状态" v-show="show1||isShow">
        <el-input maxlength="20" value="申请中" disabled />
      </el-form-item>
      <el-form-item label="申请类型" v-show="show2||isShow" key="WaterMeter" prop="ProcessMenuCode">
        <el-select
          v-model="query.ProcessMenuCode"
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
          @change="getText(query.ProcessMenuCode ,'ProcessMenuCode',applyArray,'申请类型')">
          <el-option
            v-for="item in applyArray"
            :key="item.Id"
            :label="item.Id=='2900'? '全部':item.Name"
            :value="Number(item.Id)" />
        </el-select>
      </el-form-item>
      <el-form-item label="业务编号" v-show="show3||isShow" prop="FlowNo">
        <el-input
          v-model="query.FlowNo"
          maxlength="20"
          @keyup.enter.native="handleFilter"
          @change="getText(query.FlowNo ,'FlowNo','','业务编号')"
        />
      </el-form-item>
      <el-form-item label="申请日期" v-show="show4||isShow">
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
  name: "SubSelected",
  props: {
    searchWidth: {}
  },
  watch: {
    searchWidth: {
      handler(val, oldVal) {
        this.show1 = this.showLabel(1, val);
        this.show2 = this.showLabel(2, val);
        this.show3 = this.showLabel(3, val);
        this.show4 = this.showLabel(4, val);
        if (Math.floor((val - 180) / 280) >= 4) {
          this.showBtn = false;
        }
      },
      immediate: true
    }
  },
  data() {
    return {
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
        tableId: "0000034"
      }, //查询对象
      applyArray: [], //申请类型
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
    this.applyArray = getDictionaryOption('流程编码')
  },
  methods: {
    resetting() {
      //重置
      this.$refs["formHeight"].resetFields();
      this.$parent.tipsDataCopy = [];
      this.query.ProcessMenuCode = 2900
      this.query.FlowNo = ''
      this.query.createStartTime = ''
      this.query.createEndTime = ''
      this.query.timevalue = []
      this.$parent.delTips("timevalue");
      this.handleFilter();
    },
    showLabel(n, w) {
      if (Math.floor((w - 180) / 280) >= n || this.isShow) {
        return true;
      }
      return false;
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
