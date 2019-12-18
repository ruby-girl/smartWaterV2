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
    <el-form-item label="人员编号" prop="empNo">
      <el-input
        v-model="selectHead.empNo"
        oninput = "value=value.replace(/[^\d]/g,'')"
        placeholder="人员编号"
        @keyup.enter.native="handleFilter"
         @blur="getText(selectHead.empNo,'empNo','','人员编号')"
      />
    </el-form-item>
    <el-form-item label="人员姓名" prop="empName">
      <el-input
        maxlength="10"
        v-model="selectHead.empName"
        placeholder="人员姓名（长度1-10）"
        @keyup.enter.native="handleFilter"
        @blur="getText(selectHead.empName,'empName','','人员姓名')"
      />
    </el-form-item>
     <el-form-item label="账号" v-show="showLabel(3)||isShow" prop="loginName">
      <el-input
        maxlength="20"
        v-model="selectHead.loginName"
        placeholder="账号（长度1-20）"
        @keyup.enter.native="handleFilter"
         @blur="getText(selectHead.loginName,'loginName','','账号')"
      />
    </el-form-item>
    <el-form-item label="角色" v-show="showLabel(4)||isShow" prop="roldId">
      <el-select v-model="selectHead.roldId" placeholder="请选择" @keydown.enter.native="handleFilter" 
        @change="getText(selectHead.roldId,'roldId',roleList,'角色')">
        <el-option label="全部" value="-1" />
        <el-option v-for="item in roleList" :key="item.Id" :label="item.Name" :value="item.Id" />
      </el-select>
    </el-form-item>
    <el-form-item label="状态" v-show="showLabel(5)||isShow" prop="userState">
      <el-select v-model="selectHead.userState" placeholder="请选择" @keydown.enter.native="handleFilter"
      @change="getText(selectHead.userState,'userState',stateType,'状态')">
        <el-option label="全部" value="-1" />
        <el-option v-for="item in stateType" :key="item.Id" :label="item.Name" :value="item.Id" />
      </el-select>
    </el-form-item>
    <el-form-item label="操作人" v-show="showLabel(6)||isShow" prop="editUserId">
      <el-select v-model="selectHead.editUserId" placeholder="请选择" @keydown.enter.native="handleFilter"
      @change="getText(selectHead.editUserId,'editUserId',editUserList,'操作人')">
        <el-option label="全部" value="-1" />
        <el-option v-for="item in editUserList" :key="item.Id" :label="item.Name" :value="item.Id" />
      </el-select>
    </el-form-item>
    <el-form-item label="操作时间" v-show="isShow" prop="timevalue">
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
      />
    </el-form-item>
    <el-form-item>
      <span class="isShow" :class="{tro:isShow}" v-show="ShowIcon">
          <i class="icon iconfont iconjianqu3" @click="isShow=!isShow"></i>
        </span>
      <el-button type="primary" round  size="mini"  @click="handleFilter"><i class="iconfont iconsousuo"></i>搜索</el-button>
      <el-button type="primary" round plain size="mini"  @click="resetting"><i class="iconfont iconsousuo"></i>重置</el-button>
    </el-form-item>
  </el-form>
  </div>
</template>
<script>
import { getSelectUser } from "@/api/account"; //获取操作人下拉框
import { getDictionaryOption } from "@/utils/permission";
export default {
  props: {
    selectHead: {
      type: Object,
      default: function() {
        return {};
      }
    },
    roleList: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      oldOptions: [],
      editUserList: [],
      stateType: [],
       isShow: false,
      ShowIcon: true,
      searchWidth: 0
    };
  },
  created() {
    this.searchWidth = document.body.clientWidth - 160; //160左侧导航宽度
    getSelectUser().then(res => {
      this.editUserList = res.data;
    });
    this.stateType = getDictionaryOption("用户状态");
  },
  methods: {
    showLabel(n) {
      if (Math.floor((this.searchWidth - 180) / 260) > n || this.isShow)
        return true;
      return false;
    },
    getTime(v) {
      let date;
      if (v) {
        this.selectHead.editStartTime = v[0] + " 00:00:00";
        this.selectHead.editEndTime = v[1] + " 23:59:59";
        date = v[0] + "~" + v[1];
      } else {
        this.selectHead.editStartTime = "";
        this.selectHead.editEndTime = "";
        date = "";
      }
      this.$emit("getText", date, "timevalue", "", "操作时间");
    },
    getText(val, model, arr, name) {
      this.$emit("getText", val, model, arr, name);
    },
    handleFilter() {
      this.$emit("handleFilter");
    },
    resetting(){
       this.$refs['formHeight'].resetFields();  
       this.$parent.tipsDataCopy=[]
      this.$parent.delTips("timevalue")
    }
  }
};
</script>
<style lang="scss" scoped>
</style>

