<template>
  <div>
    <div class="display-flex align-items-center justify-content-flex-justify">
      <el-form
        :inline="true"
        :model="selectHead"
        class="head-search-form form-inline-small-input"
        size="small"
        label-width="80px"
        @submit.native.prevent
      >
        <el-form-item label="用户：" label-width="65px">
          <el-select
            v-model="selectHead.CustomerQueryType"
            placeholder="请选择"
            style="width: 80px;float: left"
          >
            <el-option label="编号" value="1"></el-option>
            <el-option label="姓名" value="2"></el-option>
            <el-option label="简码" value="3"></el-option>
          </el-select>
          <el-input
            v-model="selectHead.CustomerQueryType"
            maxlength="20"
            placeholder="(长度1-30)"
            @keyup.enter.native="handleFilter"
            style="width: 180px;float: left"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="handleFilter">
            <i class="iconfont iconsousuo"></i>搜索
          </el-button>
          <el-button type="success" size="mini" @click="handleFilter">
            <i class="iconfont iconsousuo"></i>读卡
          </el-button>
        </el-form-item>
      </el-form>
      <div class="payment-records">查询缴费记录>></div>
    </div>
    <div class="head-bottom-box display-flex main-more-black-color">
      <div class="head-user-details">姓名:羊请问</div>
      <div class="head-user-details">
        <span class="head-label">水表类型:</span>机械表
      </div>
      <div class="head-user-details">
        <span class="head-label">电话:</span>18190002838
      </div>
      <div class="text-wrap flex-1">
        <span class="head-label">地址:</span>
        <span>奥术大师大所大所大所多</span>
      </div>
    </div>
  </div>
</template>
<script>
import { getSelectUser } from "@/api/account"; //获取操作人下拉框
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
      editUserList: []
    };
  },
  created() {
    getSelectUser().then(res => {
      this.editUserList = res.data;
    });
  },
  methods: {
    getTime(v) {
      if (v) {
        this.selectHead.editStartTime = v[0];
        this.selectHead.editEndTime = v[1];
      } else {
        this.selectHead.editStartTime = "";
        this.selectHead.editEndTime = "";
      }
    },
    handleFilter() {
      this.$emit("handleFilter", this.selectHead);
    }
  }
};
</script>
<style lang="scss" scoped>
.payment-records {
  color: #00b2a1;
  font-size: 13px;
  padding-bottom: 10px;
}
.head-bottom-box {
  background: #f5f5f5;
  padding: 20px;
  .head-user-details:first-child {
    width: 120px;
  }
  .head-label {
    display: inline-block;
    width: 100px;
    text-align: right;
  }
  .text-wrap {
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>

