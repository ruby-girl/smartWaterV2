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
    <el-form-item label="角色" prop="roleName" :label-width="!isShow?'40px':''">
      <el-input @blur="getText(selectHead.roleName,'roleName','','角色')" v-model="selectHead.roleName" maxlength="20" placeholder="角色名称(长度20)" @keyup.enter.native="handleFilter" />
    </el-form-item>
    <el-form-item label="操作人" prop="editUserId">
      <el-select @change="getText(selectHead.editUserId,'editUserId',editUserList,'操作人')" v-model="selectHead.editUserId" placeholder="请选择" @keydown.enter.native="handleFilter">
        <el-option label="全部" value="-1" />
        <el-option
          v-for="item in editUserList"
          :key="item.Id"
          :label="item.Name"
          :value="item.Id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="操作时间" v-show="searchWidth>1040||isShow" prop="timevalue">
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
    <el-form-item>
      <span class="isShow" :class="{tro:isShow}" v-show="ShowIcon">
          <i class="icon iconfont iconjianqu3" @click="isShow=!isShow"></i>
        </span>
      <el-button type="primary" size="mini" round  @click="handleFilter"><i class="iconfont iconsousuo"></i>搜索</el-button>
      <el-button size="mini" class="btn-add" round  @click="resetting"><i class="iconfont iconsousuo"></i>重置</el-button>
    </el-form-item>
  </el-form>
</div>
</template>
<script>
import {getSelectUser} from "@/api/account"//获取操作人下拉框
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
      editUserList: [],
      ShowIcon:false,
      isShow:false,
      searchWidth: 0
    };
  },
  created() {
    this.searchWidth = document.body.clientWidth - 160; //160左侧导航宽度
    if (this.searchWidth>1040) this.ShowIcon = false;
    else this.ShowIcon = true;
    getSelectUser().then((res)=>{
      this.editUserList=res.data
    })
  },
  methods: {
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

