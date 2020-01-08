<template>
  <el-form
    :inline="true"
    :model="selectHead"
    :class="{'position-absolute-head-shadow':isShow,'head-search-form form-inline-small-input position-absolute-head':true}"
    size="small"
    label-width="75px"
    @submit.native.prevent
    ref="formHeight"
  >
    <el-form-item
      label="水厂"
      prop="SA_WaterFactory_Id"
      :label-width="!isShow?'40px':''"
      v-if="this.waterWorks.length>1"
    >
      <el-select
        @change="getText(selectHead.SA_WaterFactory_Id,'SA_WaterFactory_Id',waterWorks,'水厂')"
        v-model="selectHead.SA_WaterFactory_Id"
        placeholder="请选择"
        @keydown.enter.native="handleFilter"
      >
        <el-option label="全部" value="-1" />
        <el-option v-for="item in waterWorks" :key="item.Id" :label="item.Name" :value="item.Id" />
      </el-select>
    </el-form-item>
    <el-form-item label="用户类型" prop="UserType">
      <el-select
        v-model="selectHead.UserType"
        @change="getText(selectHead.UserType,'UserType',userType,'用户类型')"
        placeholder="请选择"
        @keydown.enter.native="handleFilter"
      >
        <el-option label="全部" value="-1" />
        <el-option v-for="item in userType" :key="item.Id" :label="item.Name" :value="item.Id" />
      </el-select>
    </el-form-item>
    <transition-group name="fade">
      <el-form-item label="水表类型" prop="WaterTypeId" v-show="show2||isShow" key="customerQueryType">
        <el-select
          @change="getText(selectHead.WaterTypeId,'WaterTypeId',waterType,'水表类型')"
          v-model="selectHead.WaterTypeId"
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
        >
          <el-option label="全部" value="-1" />
          <el-option v-for="item in waterType" :key="item.Id" :label="item.Name" :value="item.Id" />
        </el-select>
      </el-form-item>
      <el-form-item prop="Customer" v-show="show3||isShow" key="Customer">
        <el-select
          v-model="selectHead.TransferCustomer"
          placeholder="请选择"
          @change="getscName(selectHead.TransferCustomer)"
          class="user-select-box-width"
          style="width: 130px;float: left;margin-right:3px;"
        >
          <el-option
            v-for="item in selectOption"
            :key="item.Id"
            :label="item.Name"
            :value="item.Id"
          />
        </el-select>
        <el-input
          v-model="selectHead.Customer"
          maxlength="20"
          @keyup.enter.native="handleFilter"
          @change="getText(selectHead.Customer,'Customer','',secNmae)"
          style="width: 180px;float: left"
        />
      </el-form-item>
      <el-form-item label="过户操作员" prop="OpId" v-show="show4||isShow" key="OpId">
        <el-select
          v-model="selectHead.OpId"
          @change="getText(selectHead.OpId,'OpId',editUserList,'过户操作员')"    
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
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
      <el-form-item label="过户日期" prop="timevalue" v-show="show5||isShow" key="timevalue">
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
          @keydown.enter.native="handleFilter"
          @change="getTime"
        ></el-date-picker>
      </el-form-item>
    </transition-group>
    <el-form-item>
      <span class="isShow" :class="{tro:isShow}" v-show="showIcon">
        <i class="icon iconfont iconjianqu3" @click="toggle"></i>
      </span>
     <el-button type="primary" size="mini" round @click="handleFilter">
        <i class="iconfont iconsousuo"></i>搜索
      </el-button>
       <el-button size="mini" class="btn-add" round  @click="resetting"><i class="iconfont icon_zhongzhi"></i>重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { getSelectUser } from "@/api/account"; //获取操作人下拉框
import { getDictionaryOption } from "@/utils/permission"; //字典
export default {
  props: {
    selectHead: {},
    searchWidth: {}
  },
  watch: {
    searchWidth: {
      handler(val, oldVal) {
        if (this.isShow) return;
        this.setLabel(val);
      },
      immediate: true
    }
  },
  data() {
    return {
      editUserList: [],
      userType: [],
      secNmae: "原用户姓名/简码",
      waterType: [], //水表类型
      waterWorks: [], //水厂
      isShow: false,
      showIcon: true,
      show1: false,
      show2: false,
      show3: false,
      show4: false,
      show5: false,
      selectOption: [
        { Name: "原用户姓名/简码", Id: "3301" },
        { Name: "新用户姓名/简码", Id: "3302" },
        { Name: "用户编号", Id: "3303" },
        { Name: "电话", Id: "3304" },
        { Name: "证件号", Id: "3305" },
        { Name: "地址", Id: "3306" }
      ]
    };
  },
  created() {
    this.waterWorks = this.$store.state.user.waterWorks;
    if (this.waterWorks.length == 1) {
      this.selectHead.SA_WaterFactory_Id = this.waterWorks[0].Id;
    }
    this.userType = getDictionaryOption("用户类型");
    this.waterType = getDictionaryOption("水表类型");
    getSelectUser().then(res => {
      //操作人
      this.editUserList = res.data;
    });
  },
  methods: {
    toggle() {
      this.isShow = !this.isShow;
      this.setLabel(this.searchWidth, true);
    },
    // 计算显示筛选
    setLabel(val, isShow) {
      this.show1 = this.showLabel(1, val);
      this.show2 = this.showLabel(2, val);
      this.show3 = this.showLabel(3, val);
      this.show4 = this.showLabel(4, val);
      this.show5 = this.showLabel(5, val);
      this.showIcon = isShow || !this.showLabel(5, val);
    },
    getscName(val) {
      this.selectOption.forEach(item => {
        if (item.Id == val) {
          this.secNmae = item.Name;
          this.getText(this.selectHead.Customer,'Customer','',item.Name)
        }
      });
    },
    showLabel(n, w) {
      if (this.waterWorks.length == 1) n = n - 1;
      if (Math.floor((w - 180) / 310) > n || this.isShow)
        return true;
      return false;
    },
    getTime(v) {
      let date;
      if (v) {
        this.selectHead.Star_TransferDate = v[0] + " 00:00:00";
        this.selectHead.End_TransferDate = v[1] + " 23:59:59";
        date = v[0] + "~" + v[1];
      } else {
        this.selectHead.Star_TransferDate = "";
        this.selectHead.End_TransferDate = "";
        date = "";
      }
      this.$emit("getText", date, "timevalue", "", "过户日期");
    },
    getText(val, model, arr, name) {
      this.$emit("getText", val, model, arr, name);
    },
    handleFilter() {
      this.$emit("handleFilter");
    },
    resetting() {
      //重置
      this.$refs["formHeight"].resetFields();
      this.$parent.tipsDataCopy = [];
      this.$parent.delTips("timevalue")
    }
  }
};
</script>
<style lang="scss" scoped>
.user-select-box-width{
  /deep/ .el-input__suffix{
    right: 0;
  }
}
.user-select-box-width{
  /deep/ .el-input__inner, .el-input{width: 130px !important;}
}
</style>

