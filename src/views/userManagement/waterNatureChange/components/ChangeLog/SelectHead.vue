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
      <el-form-item prop="CustomerQueryValue">
        <el-select
          v-model="selectHead.CustomerQueryType"
          placeholder="请选择"
          class="user-select-box"
          style="width: 100px;float: left;margin-right:3px;"
          @change="getscName(selectHead.CustomerQueryType)"
        >
          <el-option label="用户编号" value="1"></el-option>
          <el-option label="用户姓名" value="2"></el-option>
        </el-select>
        <el-input
          v-model="selectHead.CustomerQueryValue"
          maxlength="20"
          @keyup.enter.native="handleFilter"
          @blur="getText(selectHead.CustomerQueryValue,'CustomerQueryValue','',secNmae)"
          style="width: 180px;float: left"
        />
      </el-form-item>
      <el-form-item label="用户类型" prop="UserType">
        <el-select
          v-model="selectHead.UserType"
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
          @change="getText(selectHead.UserType,'UserType',userType,'用户类型')"
        >
          <el-option label="全部" value="-1" />
          <el-option v-for="item in userType" :key="item.Id" :label="item.Name" :value="item.Id" />
        </el-select>
      </el-form-item>
      <transition-group name="fade">
        <el-form-item label="水表类型" prop="WaterMeterType" v-show="showLabel(2)||isShow" key="WaterMeterType">
          <el-select
            v-model="selectHead.WaterMeterType"
            placeholder="请选择"
            @keydown.enter.native="handleFilter"
            @change="getText(selectHead.WaterMeterType,'WaterMeterType',waterType,'水表类型')"
          >
            <el-option label="全部" value="-1" />
            <el-option
              v-for="item in waterType"
              :key="item.Id"
              :label="item.Name"
              :value="item.Id"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="WaterFactoryId" label="水厂" v-show="showLabel(3)||isShow" v-if="this.waterWorks.length>1" key="WaterFactoryId">
          <el-select
            v-model="selectHead.WaterFactoryId"
            placeholder="请选择"
            @keydown.enter.native="handleFilter"
            @change="getText(selectHead.WaterFactoryId,'waterFactoryId',waterWorks,'水厂')"
          >
            <el-option label="全部" value="-1" />
            <el-option
              v-for="item in waterWorks"
              :key="item.Id"
              :label="item.Name"
              :value="item.Id"
            />
          </el-select>
        </el-form-item>
         <el-form-item prop="OpId" label="操作员" v-show="showLabel(4)||isShow" key="OpId">
          <el-select
            v-model="selectHead.OpId"
            placeholder="请选择"
            @keydown.enter.native="handleFilter"
            @change="getText(selectHead.OpId,'OpId',editUserList,'水厂')"
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
        <el-form-item prop="timevalue" label="变更日期" v-show="showLabel(5)||isShow"  key="timevalue">
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
  </div>
</template>
<script>
import {getSelectUser} from "@/api/account"//获取操作人下拉框
import { getDictionaryOption } from "@/utils/permission";
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
      userType: [], //用户类型
      editUserList:[],//操作人
      waterType: [], //水表类型
      waterWorks: [], //水厂
      isShow: false,
      ShowIcon: false,
      searchWidth: 0,
      secNmae: "用户编号"
    };
  },
  created() {
    this.searchWidth = document.body.clientWidth - 160; //160左侧导航宽度
    this.waterWorks = this.$store.state.user.waterWorks;
    if (this.waterWorks.length == 1) {
      this.selectHead.SA_WaterFactory_Id = this.waterWorks[0].Id;
    }
    getSelectUser().then((res)=>{//操作人
      this.editUserList=res.data
    })
    this.userType = getDictionaryOption("用户类型");
    this.waterType = getDictionaryOption("水表类型");
  },
  mounted() {
    if (this.showLabel(5)) this.ShowIcon = false;
    //如果能全部显示，隐藏按钮
    else this.ShowIcon = true;
  },
  methods: {
     getTime(v) {
      let date;
      if (v) {
        this.selectHead.StartChangeDate = v[0] + " 00:00:00";
        this.selectHead.EndChangeDate = v[1] + " 23:59:59";
        date = v[0] + "~" + v[1];
      } else {
        this.selectHead.StartChangeDate = "";
        this.selectHead.EndChangeDate = "";
        date = "";
      }
      this.$emit("getText", date, "timevalue", "", "换表日期");
    },
    getscName(id) {
      this.secNmae = id == 1 ? "用户编号" : "用户姓名";
      this.getText(
        this.selectHead.customerQueryValue,
        "customerQueryValue",
        "",
        this.secNmae
      );
    },
    getText(val, model, arr, name) {
      this.$emit("getText", val, model, arr, name);
    },
    showLabel(n) {
      if (this.waterWorks.length == 1) n = n - 1;
      if (Math.floor((this.searchWidth - 180) / 260) > n || this.isShow)
        return true;
      return false;
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
</style>

