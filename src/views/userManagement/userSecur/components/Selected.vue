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
      <transition-group name="fade">
        <el-form-item v-show="show1||isShow" key="customerQueryType" prop="CustomerQueryValue">
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
        <el-form-item label="水表类型" v-show="show2||isShow" key="WaterMeter" prop="WaterMeter">
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
        <el-form-item label="区域" prop="AreaId" v-show="show3||isShow" key="AreaId">
          <treeselect
            placeholder="请选择"
            :searchable="false"
            v-model="selectHead.AreaId"
            :options="orgTree"
            @change="getText(selectHead.AreaId ,'AreaId',orgTree,'区域')"
          />
        </el-form-item>

        <el-form-item
          label="低保户状态"
          label-width="80px"
          v-show="show4||isShow"
          key="InsuredState"
          prop="InsuredState"
        >
          <el-select
            v-model="selectHead.InsuredState "
            placeholder="请选择"
            @keydown.enter.native="handleFilter"
            @change="getText(selectHead.InsuredState ,'InsuredState',securStatus,'低保户状态')"
          >
            <el-option label="全部" :value="-1" />
            <el-option
              v-for="item in securStatus"
              :key="item.Id"
              :label="item.Name"
              :value="Number(item.Id)"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="次年复审状态"
          label-width="90px"
          v-show="show5||isShow"
          key="InsuredRecheckState"
          prop="InsuredRecheckState"
        >
          <el-select
            v-model="selectHead.InsuredRecheckState "
            placeholder="请选择"
            @keydown.enter.native="handleFilter"
            @change="getText(selectHead.InsuredRecheckState ,'InsuredRecheckState',securNextStatus,'次年复审状态')"
          >
            <el-option label="全部" :value="-1" />
            <el-option
              v-for="item in securNextStatus"
              :key="item.Id"
              :label="item.Name"
              :value="Number(item.Id)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="生效日期止" label-width="80px" v-show="show6||isShow" key="timevalue">
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
            @change="getTime"
            @keydown.enter.native="handleFilter"
          ></el-date-picker>
        </el-form-item>
      </transition-group>
      <el-form-item>
        <span class="isShow" :class="{tro:isShow}">
          <i class="icon iconfont iconjianqu3" @click="isShow=!isShow"></i>
        </span>
        <el-button type="primary" size="mini" @click="handleFilter" round>
          <i class="icon iconfont">&#xe694;</i>查询
        </el-button>
        <el-button size="mini" class="btn-add" round @click="resetting">
          <i class="iconfont icon_zhongzhi"></i>重置
        </el-button>
        <!-- <el-button round size="mini" class="cl-reset" @click="resetFun('formName')"><i class="icon iconfont">&#xe64e;</i>重置</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getName, getOrgTree } from "@/utils/projectLogic"; //搜索条件面包屑
import { getDictionaryOption } from "@/utils/permission"; //获取字典项GetAreaTree
import { GetAreaTree } from "@/api/inSecur"; //获取区域
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  name: "Selected",
  components: { Treeselect },
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
        this.show1 = this.showLabel(1, val);
        this.show2 = this.showLabel(2, val);
        this.show3 = this.showLabel(3, val);
        this.show4 = this.showLabel(4, val);
        this.show5 = this.showLabel(5, val);
        this.show6 = this.showLabel(6, val);
      },
      immediate: true
    },
    "selectHead.AreaId": {
      handler() {
        // console.log(this.orgTree)
        this.getText(this.selectHead.AreaId, "AreaId", this.orgTree, "区域");
      }
    }
  },
  data() {
    return {
      secNmae: "用户编号",
      WaterMeterList: [], //
      securStatus: [],
      securNextStatus: [],
      orgTree: [],
      isShow: false,
      show1: true,
      show2: true,
      show3: true,
      show4: true,
      show5: true,
      show6: true
    };
  },
  created() {
    this.WaterMeterList = getDictionaryOption("水表类型");
    this.securStatus = getDictionaryOption("低保户状态");
    this.securNextStatus = getDictionaryOption("低保户复审状态");
    this.getArea(0);
  },
  methods: {
    // getArry(arr) {
    //   let ifChildren = Array.isArray(arr.children) && arr.children.length > 0;
    //   if (ifChildren) {
    //     arr.children.forEach(val => {
    //       this.getArry(val);
    //       return val;
    //     });
    //   } else {
    //     return arr;
    //   }
    // },
    getArea(id) {
      getOrgTree(
        function(res) {
          this.orgTree = res;
          let childrenArr = [];
          this.selectHead.AreaId = "-1";
        }.bind(this),
        id
      );
    },
    resetting() {
      //重置
      this.$refs["formHeight"].resetFields();
      this.$parent.tipsDataCopy = [];
      this.$parent.delTips("timevalue");
    },
    showLabel(n, w) {
      if (Math.floor((w - 180) / 280) >= n || this.isShow) {
        return true;
      }
      return false;
    },
    getscName(id) {
      this.secNmae = getName(id);
    },
    getText(val, model, arr, name) {
      this.$emit("getText", val, model, arr, name);
    },
    //日期格式化
    getTime(v) {
      let date;
      if (v) {
        this.selectHead.StartTime = v[0];
        this.selectHead.EndTime = v[1];
        date = this.selectHead.StartTime + "~" + this.selectHead.EndTime;
        this.$emit("getText", date, "timevalue", "", "生效日期止");
      } else {
        this.selectHead.StartTime = "";
        this.selectHead.EndTime = "";
        date = "";
        this.$emit("getText", date, "timevalue", "", "生效日期止");
      }
    },
    handleFilter() {
      // this.$parent.seachAccountOrder()
      this.$emit("handleFilter");
      // this.$parent.seachAccountOrder()
    }
  }
};
</script>