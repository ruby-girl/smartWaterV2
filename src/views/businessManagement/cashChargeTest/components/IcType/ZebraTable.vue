<template>
  <!-- 卡片-->
  <el-row :class="{'background-ddd':isGray,'ic-item':true}">
    <el-col :md="12" class="pl-15">
      <el-row class="ic-item-left">
        <el-col :xs="8" :md="8" class="text-right">{{labelLeft}}</el-col>
        <!-- You -->
        <el-col :xs="16" :md="16" class="pl-20 text-wrap">{{valueLeft}}</el-col>
      </el-row>
    </el-col>
    <!-- You -->
    <el-col :md="12" class="pl-15">
      <el-row> 
        <el-col :xs="10" :md="10" :style="{'color':color}">{{labelRight}}</el-col>
        <!-- You -->
        <el-col :xs="14" :md="14" :style="{'color':color,'fontWeight':fontWeight}">{{valueRight}}</el-col>
      </el-row>
    </el-col>
  </el-row>
</template>
<script>
export default {
  props: {
    labelLeft: {
      type: String,
      default: ""
    },
    valueLeft: {
      default: ""
    },
    labelRight: {
      type: String,
      default: ""
    },
    valueRight: {
      default: ""
    },
    isGray: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: ""
    },
    fontWeight: {
      type: String,
      default: ""
    }
  }
};
</script>
<style lang="scss" scoped>
.ic-item {
  border-bottom: 1px solid #dbe3e8;
  line-height: 36px;
  color: #777c82;
  font-size: 14px;
}
.ic-item-left {
  border-right: 2px solid #dbe3e8;
}
.background-ddd {
  background: #f0f2f5;
}
@media screen and (max-width: 1200px) {
    .ic-item {
        line-height: 30px;
    }
}
.text-right{
  text-align: right;
}
.text-wrap {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

