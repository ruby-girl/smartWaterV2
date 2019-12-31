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
      <el-form-item label="申请类型" v-show="show1||isShow" prop="ProcessMenuCode">
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
            :value="Number(item.Id)"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="业务编号" v-show="show2||isShow" prop="FlowNo">
        <el-input
          v-model="query.FlowNo"
          maxlength="20"
          @keyup.enter.native="handleFilter"
          @change="getText(query.FlowNo ,'FlowNo','','业务编号')"
        />
      </el-form-item>
      <el-form-item label="创建人" v-show="show3||isShow" prop="createUserId">
        <el-select
          v-model="query.createUserId"
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
          @change="getText(query.createUserId ,'createUserId',createUserArry,'创建人')"
        >
          <el-option label="全部" :value="-1" />
          <el-option
            v-for="item in createUserArry"
            :key="item.Id"
            :label="item.Name"
            :value="item.Id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="审核意见" v-show="show4||isShow" prop="VerifyState">
        <el-select
          v-model="query.VerifyState"
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
          @change="getText(query.VerifyState ,'VerifyState',auditOpinionArry,'审核意见')"
        >
          <el-option label="全部" :value="-1" />
          <el-option
            v-for="item in auditOpinionArry"
            :key="item.Id"
            :label="item.Name"
            :value="Number(item.Id)"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="申请日期" v-show="show5||isShow">
        <el-date-picker
          v-model="timevalue"
          type="datetimerange"
          :editable="false"
          :unlink-panels="true"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          @change="getTime(timevalue,'timevalue')"
          @keydown.enter.native="handleFilter"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="审核日期" v-show="show6||isShow">
        <el-date-picker
          v-model="timevalue1"
          type="datetimerange"
          :editable="false"
          :unlink-panels="true"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          @change="getTime(timevalue1,'timevalue1')"
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
             <el-button size="mini" class="btn-add" round @click="resetting">
          <i class="iconfont icon_zhongzhi"></i>重置
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getDictionaryOption } from "@/utils/permission"; //获取字典项
import { ComboBoxListZhuanYong } from "@/api/operationFlow";
import { promptInfoFun } from "@/utils/index";
export default {
  name: "HaveSelected",
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
      auditOpinionArry: [
        {
          Id: "0",
          Name: "全部"
        },
        {
          Id: "1",
          Name: "已通过"
        },
        {
          Id: "2",
          Name: "未通过"
        }
      ],
      createUserArry: [],
      applyArray: [],
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
        tableId: "0000036"
      },
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
      timevalue: [],
      timevalue1: [],
      showBtn: true //查询展开
    };
  },
  created() {
    this.companyOptions = this.$store.state.user.waterWorks;
    if (this.companyOptions.length == 1) {
      this.query.WaterFactoryId = this.companyOptions[0].Id;
    }
    this.getCreateUser();
    this.applyArray = getDictionaryOption("流程编码");
  },
  methods: {
    resetting() {
      //重置
      this.$refs["formHeight"].resetFields();
      this.$parent.tipsDataCopy = [];
      this.timevalue = [];
      this.timevalue1 = [];
      this.query.createStartTime = "";
      this.query.createEndTime = "";
      this.query.editStartTime = "";
      this.query.editEndTime = "";
      this.handleFilter();
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
        if (n == "timevalue") {
          this.query.createStartTime = v[0] + "00:00:00";
          this.query.createEndTime = v[1] + "23:59:59";
          date = this.query.createStartTime + "~" + this.query.createEndTime;
          this.$emit("getText", date, n, "", "申请日期");
        } else {
          this.query.editStartTime = v[0] + "00:00:00";
          this.query.editEndTime = v[1] + "23:59:59";
          date = this.query.editStartTime + "~" + this.query.editEndTime;
          this.$emit("getText", date, n, "", "审核日期");
        }
      } else {
        if (n == "timevalue") {
          this.query.createStartTime = "";
          this.query.createEndTime = "";
          date = "";
          this.$emit("getText", date, n, "", "申请日期");
        } else {
          this.query.editStartTime = "";
          this.query.editEndTime = "";
          date = "";
          this.$emit("getText", date, n, "", "审核日期");
        }
      }
    },
    handleFilter() {
      this.$parent.query = Object.assign({}, this.query);
      this.$parent.searchTableList();
    },
    getCreateUser() {
      ComboBoxListZhuanYong({ PId: "" }).then(res => {
        if (res.code == 0) {
          this.createUserArry = res.data;
        } else {
          promptInfoFun(this, 1, res.message);
        }
      });
    }
  }
};
</script>
