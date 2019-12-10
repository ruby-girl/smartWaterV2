<template>
  <div class="position-search-head">
    <div class="head-title">换表查询</div>
    <el-form
      :inline="true"
      :model="selectHead"
      :class="{'position-absolute-head-shadow':isShow,'head-search-form form-inline-small-input position-absolute-head':true}"
      size="small"
      label-width="75px"
      @submit.native.prevent
    >
      <el-form-item label="水厂" v-if="this.waterWorks.length>1">
        <el-select
          v-model="selectHead.waterFactoryId"
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
          @change="getText(selectHead.waterFactoryId,'waterFactoryId',waterWorks,'水厂')"
        >
          <el-option label="全部" value="-1" />
          <el-option v-for="item in waterWorks" :key="item.Id" :label="item.Name" :value="item.Id" />
        </el-select>
      </el-form-item>
       <transition-group name="fade">
      <el-form-item v-show="show1||isShow" key="customerQueryType">
        <el-select
          v-model="selectHead.customerQueryType"
          placeholder="请选择"
          class="user-select-box"
          style="width: 100px;float: left;margin-right:3px;"
          @change="getscName(selectHead.customerQueryType)"
        >
          <el-option label="用户编号" value="1"></el-option>
          <el-option label="用户姓名" value="2"></el-option>
        </el-select>
        <el-input
          v-model="selectHead.customerQueryValue"
          maxlength="20"
          @keyup.enter.native="handleFilter"
          @change="getText(selectHead.customerQueryValue,'customerQueryValue','',secNmae)"
          style="width: 180px;float: left"
        />
      </el-form-item>
      <el-form-item label="用户类型" v-show="show2||isShow" key="userType">
        <el-select
          v-model="selectHead.userType"
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
          @change="getText(selectHead.userType,'UserType',userType,'用户类型')"
        >
          <el-option label="全部" value="-1" />
          <el-option v-for="item in userType" :key="item.Id" :label="item.Name" :value="item.Id" />
        </el-select>
      </el-form-item>
      <el-form-item label="水表类型" v-show="show3||isShow" key="waterMeterType">
        <el-select
          v-model="selectHead.waterMeterType"
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
          @change="getText(selectHead.waterMeterType,'waterMeterType',waterType,'水表类型')"
        >
          <el-option label="全部" value="-1" />
          <el-option v-for="item in waterType" :key="item.Id" :label="item.Name" :value="item.Id" />
        </el-select>
      </el-form-item>
      <el-form-item label="换表操作员" v-show="show4||isShow" key="createUserId">
        <el-select
          v-model="selectHead.createUserId"
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
          @change="getText(selectHead.createUserId,'createUserId',editUserList,'换表操作员')"
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
      <el-form-item label="换表类型" v-show="show5||isShow" key="changeMeterType">
        <el-select
          v-model="selectHead.changeMeterType"
          placeholder="请选择"
          @keydown.enter.native="handleFilter"
          @change="getText(selectHead.changeMeterType,'changeMeterType',changeType,'换表类型')"
        >
          <el-option label="全部" value="-1" />
          <el-option v-for="item in changeType" :key="item.Id" :label="item.Name" :value="item.Id" />
        </el-select>
      </el-form-item>
      <el-form-item label="换表日期" v-show="isShow" key="timevalue">
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
        <span class="isShow" :class="{tro:isShow}">
          <i class="icon iconfont iconjianqu3" @click="isShow=!isShow"></i>
        </span>
        <el-button round type="primary" size="mini" @click="handleFilter">
          <i class="iconfont iconsousuo"></i>搜索
        </el-button>
      </el-form-item>
    </el-form>
  </div>
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
    searchWidth:{
       handler(val, oldVal) {
      this.show1 = this.showLabel(1,val);
      this.show2 = this.showLabel(2,val);
      this.show3 = this.showLabel(3,val);
      this.show4 = this.showLabel(4,val);
      this.show5 = this.showLabel(5,val);
      },
      immediate: true      
    }
  },
  data() {
    return {
      editUserList: [],
      userType: [],
      waterType: [], //水表类型
      waterWorks: [], //水厂
      changeType: [
        { Name: "以旧换新", Id: "3401" },
        { Name: "用户互换", Id: "3402" }
      ],
      secNmae: "用户编号",
      isShow: false,
      show1: true,
      show2: true,
      show3: true,
      show4: true,
      show5: true
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
    showLabel(n,w) {
      if (this.waterWorks.length == 1) {
        if ((w-100) / 280 > n || this.isShow) return true;
        return false;
      } else {
        if ((w-100)/ 280 > n + 1 || this.isShow) return true;
        return false;
      }
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
    getTime(v) {
      let date;
      if (v) {
        this.selectHead.changeStartTime = v[0] + " 00:00:00";
        this.selectHead.changeEndTime = v[1] + " 23:59:59";
        date = v[0] + "~" + v[1];
      } else {
        this.selectHead.changeStartTime = "";
        this.selectHead.changeEndTime = "";
        date = "";
      }
      this.$emit("getText", date, "timevalue", "", "换表日期");
    },
    handleFilter() {
      this.$emit("handleFilter", this.selectHead);
    }
  }
};
</script>
<style lang="scss" scoped>
.position-search-head {
  position: relative;
  height: 73px;
  .position-absolute-head {
    position: absolute;
    top: 25px;
    left: 0;
    background: #fff;
    z-index: 9999;
  }
  .head-title {
    color: #777777;
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 10px;
  }
}
</style>

