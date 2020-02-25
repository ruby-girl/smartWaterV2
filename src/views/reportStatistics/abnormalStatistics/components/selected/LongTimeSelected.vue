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
        v-if="companyOptions.length!=1"
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
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="item in companyOptions"
            :key="item.Id"
            :label="item.Name"
            :value="item.Id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="水表类型" v-show="show1||isShow" prop="WaterMeter">
        <el-select
          v-model="selectHead.WaterMeter"
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
          @change="getText(selectHead.WaterMeter,'WaterMeter',WaterMeterList,'水表类型')"
        >
          <el-option label="全部" :value="0"></el-option>
          <el-option
            v-for="item in WaterMeterList"
            v-show="item.Name!='IC卡表水表'"
            :key="item.Id"
            :label="item.Name"
            :value="item.Id"
          ></el-option>
        </el-select>
      </el-form-item>
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
      <el-form-item label="未缴费起止日期" label-width="110px" v-show="show4||isShow">
        <el-date-picker
          v-model="selectHead.StarDateTime"
          type="date"
          placeholder="选择日期时间"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd HH:mm:ss"
          :picker-options="pickTime"
          @change="getTime"
        ></el-date-picker>
        <el-date-picker
          v-model="selectHead.EndDateTime"
          type="date"
          disabled
          placeholder="选择日期时间"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>
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
      showBtn: false,
      pickTime: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      }
    };
  },
  watch: {
    searchWidth: {
      handler(val, oldVal) {
        this.show1 = this.showLabel(1, val);
        this.show2 = this.showLabel(2, val);
        this.show3 = this.showLabel(3, val);
        this.show4 = this.showLabel(4, val);
        if (this.companyOptions.length == 1) {
          if (Math.floor((val - 200) / 280) < 4) {
            this.showBtn = true;
          } else {
            this.showBtn = false;
          }
        } else {
          if (Math.floor((val - 200) / 280) < 5) {
            this.showBtn = true;
          } else {
            this.showBtn = false;
          }
        }
      },
      immediate: true
    }
  },

  methods: {
    resetting() {
      //重置
      this.$refs["formHeight"].resetFields();
      this.$parent.tipsDataCopy = [];
      this.$parent.delTips("dateArr");
    },
    showLabel(n, w) {
      if (this.companyOptions.length == 1) {
        if (Math.floor((w - 180) / 280) >= n || this.isShow) return true;
        return false;
      } else {
        if (Math.floor((w - 180) / 280) >= n + 1 || this.isShow) return true;
        return false;
      }
    },
    handleFilter() {
      this.$parent.searchTableList();
    },
    getText(val, model, arr, name) {
      this.$emit("getText", val, model, arr, name);
    },
    getTime() {
      let dateStipe = "";
      //时间格式化
      if (this.selectHead.StarDateTime) {
        dateStipe =
          this.selectHead.StarDateTime + "~" + this.selectHead.EndDateTime+" 23:59:59";
        this.$emit("getText", dateStipe, "StarDateTime", "", "未缴费起止日期");
      } else {
        this.$emit("getText", dateStipe, "StarDateTime", "", "未缴费起止日期");
      }
    }
  },
  created() {
    this.WaterMeterList = getDictionaryOption("水表类型");
    console.log(this.WaterMeterList )
    this.userTypeList = getDictionaryOption("用户类型");
    this.editUserList = getDictionaryOption("口径类型");
    this.companyOptions = this.$store.state.user.waterWorks;
    if (this.companyOptions.length == 1) {
      this.selectHead.SA_WaterFactory_Id = this.companyOptions.Id;
    }
    // getSelectUser().then(res => {
    //   this.editUserList = res.data;
    // });
  },
  mounted() {
    this.selectHead = this.$parent.selectHead;
    // this.selectHead.StarDateTime = {
    //   disabledDate(time) {
    //     return time.getTime() < new Date();
    //   }
    // };
  }
};
</script>
<style lang="scss" scoped>
.el-form {
  width: 100%;
}
/deep/.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 180px;
}
</style>