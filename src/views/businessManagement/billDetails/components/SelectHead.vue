<template>
  <el-form
    :inline="true"
    :model="selectHead"
    :class="{'position-absolute-head-shadow':isShow,'head-search-form form-inline-small-input position-absolute-head':true}"
    size="small"
    label-width="68px"
    @submit.native.prevent
    ref="formHeight"
  >
    <el-form-item prop="CustomerQueryValue">
      <el-select
        v-model="selectHead.CustomerQueryType"
        placeholder="请选择"
        class="short-select-item"
        style="width: 100px;float: left;margin-right:3px"
       @change="getscName(selectHead.CustomerQueryType)"
      >
        <el-option
          v-for="item in customerQueryTypeOption"
          :key="item.Id"
          :label="item.Name"
          :value="item.Id"
        />
      </el-select>
      <el-input
        v-model="selectHead.CustomerQueryValue"
        maxlength="20"
        placeholder="(长度1-30)"
        @keyup.enter.native="handleFilter"
        style="width: 180px;float: left"
        @blur="getText(selectHead.CustomerQueryValue,'CustomerQueryValue','',secNmae)"
      />
    </el-form-item>
    <el-form-item label="水厂" v-if="this.waterWorks.length>1" prop="WaterFactory">
      <el-select
        v-model="selectHead.WaterFactory"
        placeholder="请选择"
        @change="getText(selectHead.WaterFactory,'WaterFactory',waterWorks,'水厂')" 
        @keydown.enter.native="handleFilter"
      >
        <el-option label="全部" value="-1" />
        <el-option v-for="item in waterWorks" :key="item.Id" :label="item.Name" :value="item.Id" />
      </el-select>
    </el-form-item>
    <transition-group name="fade">
      <el-form-item label="收款人" v-show="showLabel(2)||isShow" key="ReceiveMoneyUser" prop="ReceiveMoneyUser">
        <el-select
          v-model="selectHead.ReceiveMoneyUser"
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
          @change="getText(selectHead.ReceiveMoneyUser,'ReceiveMoneyUser',editUserList,'收款人')"
        >
          <el-option label="全部" value="-1" />
          <el-option
            v-for="item in editUserList"
            :key="item.Id"
            :label="item.Name"
            :value="item.Id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="缴费方式" key="type" v-show="showLabel(3)||isShow" prop="PayMentType">
        <el-select
          v-model="selectHead.PayMentType"
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
          @change="getText(selectHead.PayMentType,'PayMentType',payMentTypeOption,'缴费方式')"
        >
           <el-option label="全部" value="-1" />
            <el-option v-for="item in payMentTypeOption" :key="item.Id" :label="item.Name" :value="item.Id" :disabled="item.Id==2703||item.Id==2705"/>
        </el-select>
      </el-form-item>
      <el-form-item label="费用状态" key="state" v-show="showLabel(4)||isShow" prop="FeeState">
        <el-select
          v-model="selectHead.FeeState"
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
           @change="getText(selectHead.FeeState,'FeeState',FeeState,'费用状态')"
        >
          <el-option label="全部" value="-1" />
          <el-option v-for="item in FeeState" :key="item.Id" :label="item.Name" :value="item.Id" />
        </el-select>
      </el-form-item>
      <el-form-item label="水表类型" key="waterType" v-show="showLabel(5)||isShow" prop="WaterMeterTypeId">
        <el-select
          v-model="selectHead.WaterMeterTypeId"
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
          @change="getText(selectHead.WaterMeterTypeId,'WaterMeterTypeId',waterMeterType,'水表类型')"
        >
          <el-option label="全部" value="-1" />
          <el-option
            v-for="item in waterMeterType"
            :key="item.Id"
            :label="item.Name"
            :value="item.Id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="费用类型" key="detailsType" v-show="showLabel(6)||isShow" prop="FeeType">
        <el-select
          v-model="selectHead.FeeType"
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
          @change="getText(selectHead.FeeType,'FeeType',FeeType,'费用类型')"
        >
          <el-option label="全部" value="-1" />
          <el-option v-for="item in FeeType" :key="item.Id" :label="item.Name" :value="item.Id" />
        </el-select>
      </el-form-item>
      <el-form-item label="缴费日期" v-show="isShow" key="timevalue" prop="timevalue">
        <el-date-picker
          v-model="selectHead.timevalue"
          type="daterange"
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
    </transition-group>
    <el-form-item>
      <span class="isShow" :class="{tro:isShow}" v-show="ShowIcon">
        <i class="icon iconfont iconjianqu3" @click="isShow=!isShow"></i>
      </span>
     <el-button round type="primary" size="mini" @click="handleFilter">
        <i class="iconfont iconsousuo"></i>搜索
      </el-button>
      <el-button class="btn-resetting" round plain type="primary" size="mini" @click="resetting">
          <i class="iconfont icon_zhongzhi"></i>重置
        </el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { getSelectUser } from "@/api/account"; //获取操作人下拉框
import { getDictionaryOption } from "@/utils/permission"; //字典-水表类型等
export default {
  props: {
    selectHead: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      timevalue: [],
      waterMeterType: [], //水表类型
      payMentType: [], //缴费方式
      FeeState: [], //费用状态
      FeeType: [], //费用类型
      editUserList: [], //收款人
      waterWorks: [], //水厂
      ifMore: false,
      isShow: false,
      ShowIcon: true,
      searchWidth: 0,
      secNmae: "用户编号",
      customerQueryTypeOption: [
        { Name: "用户编号", Id: "1" },
        { Name: "姓名/简码", Id: "2" },
        { Name: "水表编号", Id: "3" },
        { Name: "交易流水号", Id: "4" }
      ],
      payMentTypeOption:[
        { Name: "现金", Id: "2701" },
        { Name: "微信", Id: "2702" },
        { Name: "支付宝", Id: "2703" },
        { Name: "银行代扣", Id: "2704" },
        { Name: "转账", Id: "2705" }
      ],
    };
  },
  created() {
    getSelectUser().then(res => {
      this.editUserList = res.data;
    });
    this.waterWorks = this.$store.state.user.waterWorks;
    if (this.waterWorks.length == 1) {
      this.selectHead.WaterFactory = this.waterWorks[0].Id;
    }
    this.waterMeterType = getDictionaryOption("水表类型");
    this.FeeState = getDictionaryOption("缴费单缴费状态");
    this.FeeType = getDictionaryOption("费用类型");
    this.payMentType = getDictionaryOption("缴费方式");
  },
  mounted() {
    this.searchWidth = this.$parent.$refs.formHeight.clientWidth;
  },
  methods: {
    getscName(val) {
      this.customerQueryTypeOption.forEach(item => {
        if (item.Id == val) {
          this.secNmae = item.Name;
        }
      });
    },
    showLabel(n) {
      if (this.waterWorks.length == 1) n = n - 1;
      if (Math.floor((this.searchWidth - 180) / 260) > n || this.isShow)
        return true;
      return false;
    },
    getTime(v) {
      let date;
      if (v) {
        this.selectHead.editStartTime = v[0]+ " 00:00:00";
        this.selectHead.editEndTime = v[1]+ " 23:59:59";
        date = v[0] + "~" + v[1];
      } else {
        this.selectHead.editStartTime = "";
        this.selectHead.editEndTime = "";
        date = "";
      }
      this.$emit("getText", date, "timevalue", "", "缴费日期");
    },
    getText(val, model, arr, name) {
      this.$emit("getText", val, model, arr, name);
    },
    handleFilter() {
      this.$emit("handleFilter");
    },
    resetting(){//重置
      this.$refs['formHeight'].resetFields();  
       this.$parent.tipsDataCopy=[]
       this.$parent.delTips("timevalue")
    }
  }
};
</script>
<style lang="scss" scoped>
.getUpDown {
  font-size: 14px;
  color: #00b3a0;
  display: inline-block;
  margin-left: 20px;
  cursor: pointer;
}
</style>

