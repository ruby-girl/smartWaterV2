<template>
  <el-form
    :inline="true"
    :model="selectHead"
    class="head-search-form form-inline-small-input"
    size="small"
    label-width="80px"
    @submit.native.prevent
  >
    <el-form-item label="用水性质">
      <el-select v-model="selectHead.roldId" placeholder="请选择" @keydown.enter.native="handleFilter">
        <el-option label="全部" value="-1" />
        <el-option v-for="item in typeList" :key="item.Id" :label="item.Name" :value="item.Id" />
      </el-select>
    </el-form-item>
    <el-form-item label="是否阶梯 ">
      <el-select v-model="selectHead.userState" placeholder="请选择" @keydown.enter.native="handleFilter">
        <el-option label="全部" value="-1" />
         <el-option label="是" value="1" />
          <el-option label="否" value="0" />
      </el-select>
    </el-form-item>
    <el-form-item label="用水性质类型 " label-width="100px">
      <el-select v-model="selectHead.editUserId" placeholder="请选择" @keydown.enter.native="handleFilter">
        <el-option label="全部" value="-1" />
        <el-option v-for="item in typeList" :key="item.Id" :label="item.Name" :value="item.Id" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini"  @click="handleFilter"><i class="iconfont iconsousuo"></i>搜索</el-button>
    </el-form-item>
  </el-form>
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
    typeList: {
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
      stateType: []
    };
  },
  created() {
    getSelectUser().then(res => {
      this.editUserList = res.data;
    });
    this.stateType = getDictionaryOption("用水性质类型");
  },

  methods: {
    handleFilter() {
      this.$emit("handleFilter", this.selectHead);
    }
  }
};
</script>
<style lang="scss" scoped>
</style>

