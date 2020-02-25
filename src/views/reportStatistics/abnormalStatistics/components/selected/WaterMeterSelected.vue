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
       v-show="show1||isShow"
        label="水厂"
        :label-width="isShow?'68px':'40px'"
        prop="SA_WaterFactory_Id"
      >
        <el-select
          v-model="selectHead.SA_WaterFactory_Id"
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
          @change="getText(selectHead.SA_WaterFactory_Id,'SA_WaterFactory_Id',companyOptions,'水厂')"
        >
          <el-option  v-if="companyOptions.length!=1" label="全部" value=""></el-option>
          <el-option
            v-for="item in companyOptions"
            :key="item.Id"
            :label="item.Name"
            :value="item.Id"
          ></el-option>
        </el-select>
      </el-form-item>

      <!-- <el-form-item label="水表类型"  prop="WaterMeter">
        <el-select
          v-model="selectHead.WaterMeter"
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
          @change="getText(selectHead.WaterMeter,'WaterMeter',WaterMeterList,'水表类型')"
        >
          <el-option label="全部" :value="0"></el-option>
          <el-option
            v-for="item in WaterMeterList"
            :key="item.Id"
            :label="item.Name"
            :value="item.Id"
          ></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="用户类型" v-show="show2||isShow" prop="UserType">
        <el-select
          v-model="selectHead.UserType"
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
          @change="getText(selectHead.UserType,'UserType',userTypeList,'用户类型')"
        >
          <el-option label="全部" :value="0"></el-option>
          <el-option
            v-for="item in userTypeList"
            :key="item.Id"
            :label="item.Name"
            :value="item.Id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="口径" v-show="show3||isShow" prop="MeterDiameter">
        <el-select
          v-model="selectHead.MeterDiameter"
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
          @change="getText(selectHead.MeterDiameter,'MeterDiameter',editUserList,'口径')"
        >
          <el-option label="全部" :value="0"></el-option>
          <el-option
            v-for="item in editUserList"
            :key="item.Id"
            :label="item.Name"
            :value="item.Id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="水量倍率" prop="Pre" v-show="show4||isShow" class="waterNum">
        <el-input v-model="selectHead.Pre" />
        <el-radio-group v-model="selectHead.UpOrDown">
          <el-radio  label="U">以上</el-radio>
          <el-radio  label="D">以下</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="本次抄表日期" label-width="110px" v-show="show5||isShow">
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
      show5: true,
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
    resetting() {
      //重置
      this.$refs["formHeight"].resetFields();
      this.$parent.tipsDataCopy = [];
      this.selectHead.MeterDiameter=0
      this.selectHead.WaterMeter=0
      this.selectHead.UserType=0
      this.selectHead.UpOrDown="D"

       if(this.companyOptions.length > 1){
      this.selectHead.SA_WaterFactory_Id=""

      }
      this.$parent.delTips("dateArr");
    },
    showLabel(n, w) {
    
        if (Math.floor((w - 180) / 280) >= n  || this.isShow) return true;
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
        this.selectHead.StarDateTime = date[0];
        this.selectHead.EndDateTime = date[1];
        dateStipe =
          this.selectHead.StarDateTime.split(" ")[0] +
          "~" +
          this.selectHead.EndDateTime.split(" ")[0];
        this.$emit("getText", dateStipe, "dateArr", "", "本次抄表日期");
      } else {
        this.selectHead.StarDateTime = "";
        this.selectHead.EndDateTime = "";
        dateStipe = "";
        this.$emit("getText", dateStipe, "dateArr", "", "本次抄表日期");
      }
    }
  },
  created() {
    this.WaterMeterList = getDictionaryOption("水表类型");
    this.userTypeList = getDictionaryOption("用户类型");
    this.editUserList = getDictionaryOption("口径类型");
    this.companyOptions = this.$store.state.user.waterWorks;
    
    // getSelectUser().then(res => {
    //   this.editUserList = res.data;
    // });
  },
  mounted() {
    this.selectHead = this.$parent.selectHead;
    if (this.companyOptions.length == 1) {
      this.selectHead.SA_WaterFactory_Id = this.companyOptions[0].Id;
    }
  }
};
</script>
<style lang="scss" scoped>
.el-form {
  width: 100%;
  .waterNum {
    .el-input {
      width: 106px;
    }
    /deep/.el-input__inner {
      width: 106px !important;
    }
  }
}
</style>