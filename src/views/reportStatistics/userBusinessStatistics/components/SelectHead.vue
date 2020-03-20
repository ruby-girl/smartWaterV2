<template>
  <div class="position-search-head">
    <el-form
      :inline="true"
      :model="selectHead"
      :class="{'position-absolute-head-shadow':isShow,'head-search-form form-inline-small-input position-absolute-head':true}"
      size="small"
      label-width="68px"
      @submit.native.prevent
      ref="formHeight"
    >
      <el-form-item
        label="水厂"
        :label-width="isShow?'68px':'40px'"
        prop="waterFactoryId"
        v-show="show1||isShow"
      >
        <el-select
          v-model="selectHead.waterFactoryId"
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
          @change="getText(selectHead.waterFactoryId, 'waterFactoryId',companyOptions,'水厂')"
        >
          <el-option
            v-for="item in companyOptions"
            :key="item.Id"
            :label="item.Name"
            :value="item.Id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="操作人" v-show="show2||isShow" prop="createUserId">
        <el-select
          v-model="selectHead.createUserId"
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
          @change="getText(selectHead.createUserId,'createUserId',editUserList,'操作人')"
        >
          <el-option label="全部" value="-1"></el-option>
          <el-option
            v-for="item in editUserList"
            :key="item.Id"
            :label="item.Name"
            :value="item.Id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="水表类型" v-show="show3||isShow" prop="waterMeterType">
        <el-select
          v-model="selectHead.waterMeterType"
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
          @change="getText(selectHead.waterMeterType,'waterMeterType',WaterMeterList,'水表类型')"
        >
          <el-option label="全部" :value="-1"></el-option>
          <el-option
            v-for="item in WaterMeterList"
            :key="item.Id"
            :label="item.Name"
            :value="item.Id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户类型" v-show="show4||isShow" prop="userType">
        <el-select
          v-model="selectHead.userType"
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
          @change="getText(selectHead.userType,'userType',userTypeList,'用户类型')"
        >
          <el-option label="全部" :value="-1"></el-option>
          <el-option
            v-for="item in userTypeList"
            :key="item.Id"
            :label="item.Name"
            :value="item.Id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="业务办理日期" label-width="90px" v-show="show5||isShow">
        <el-date-picker
          v-model="dateArr"
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
import { getDictionaryOption } from "@/utils/permission";
import { getSelectUser } from "@/api/account"; //获取操作人下拉框
import { getLabelName } from "@/utils/projectLogic"; //获取lable
export default {
  props: {
    searchWidth: {}
  },
  data() {
    return {
      companyOptions: [], //水厂
      WaterMeterList: [], //水表类型
      userTypeList: [], //用户类型
      editUserList: [], //操作员、经办人
      selectHead: {},
      planStateOptions: [],
      dateArr: [], //日期数组
      companyShow: true,
      isShow: false,
      show1: true,
      show2: true,
      show3: true,
      show4: true,
      showBtn: false
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

        if (Math.floor((val - 200) / 280) < 6) {
          this.showBtn = true;
        } else {
          this.showBtn = false;
        }
      },
      immediate: true
    }
  },
  created() {},
  methods: {
    getName() {
      if(this.selectHead.waterFactoryId==-1){
        this.selectHead.waterFactoryName="全部"
      }else{
        this.selectHead.waterFactoryName = getLabelName(
          this.selectHead.waterFactoryId,
          this.companyOptions
        );
      }

       if(this.selectHead.waterMeterType==-1){
        this.selectHead.waterMeterTypeName="全部"
      }else{
        this.selectHead.waterMeterTypeName = getLabelName(
          this.selectHead.waterMeterType,
          this.WaterMeterList
        );
      }

       if(this.selectHead.createUserId==-1){
        this.selectHead.createUserName="全部"
      }else{
          this.selectHead.createUserName = getLabelName(
          this.selectHead.createUserId,
          this.editUserList
        );
      }

       if(this.selectHead.userType==-1){
        this.selectHead.userTypeName="全部"
      }else{
      this.selectHead.userTypeName = getLabelName(
        this.selectHead.userType,
        this.userTypeList
      );
      }
    },
    resetting() {
      //重置
      this.$refs["formHeight"].resetFields();
      this.$parent.tipsDataCopy = [];
      this.$parent.delTips("dateArr");
    },
    showLabel(n, w) {
        if (Math.floor((w - 180) / 280) >= n || this.isShow) return true;
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
      let date = this.dateArr;
      let dateStipe;
      if (date) {
        this.selectHead.createStartTime = date[0];
        this.selectHead.createEndTime = date[1];
        dateStipe =
          this.selectHead.createStartTime.split(" ")[0] +
          "~" +
          this.selectHead.createEndTime.split(" ")[0];
        this.$emit("getText", dateStipe, "dateArr", "", "业务办理日期");
      } else {
        this.selectHead.createStartTime = "";
        this.selectHead.createEndTime = "";
        dateStipe = "";
        this.$emit("getText", dateStipe, "dateArr", "", "业务办理日期");
      }
    }
  },
  created() {
    this.WaterMeterList = getDictionaryOption("水表类型");
    this.userTypeList = getDictionaryOption("用户类型");
    this.companyOptions = this.$store.state.user.waterWorks;
    if (this.companyOptions.length == 1) {
      this.selectHead.SA_WaterFactory_Id = this.companyOptions.Id;
    }
    getSelectUser().then(res => {
      this.editUserList = res.data;
    });
  },
  mounted() {
    this.selectHead = this.$parent.selectHead;
  }
};
</script>
<style lang="scss" scoped>
.el-form {
  width: 100%;
}
</style>