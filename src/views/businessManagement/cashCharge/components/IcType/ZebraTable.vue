<template>
  <!-- 卡片-->
  <el-row :class="{'background-ddd':isGray,'ic-item':true}">
    <el-col :md="12" class="pl-15">
      <el-row class="ic-item-left">
        <el-col :md="24" :lg="12">{{labelLeft}}</el-col>
        <!-- You -->
        <el-col :md="24" :lg="12" :style="{'color':color,'fontWeight':fontWeight}">{{valueLeft}}</el-col>
      </el-row>
    </el-col>
    <!-- You -->
    <el-col :md="12" class="pl-15">
      <el-row>
        <el-col :md="24" :lg="12">{{labelRight}}</el-col>
        <!-- You -->
        <el-col :md="24" :lg="12">{{valueRight}}</el-col>
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
      type: String,
      default: ""
    },
    labelRight: {
      type: String,
      default: ""
    },
    valueRight: {
      type: String,
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
  line-height: 39px;
  color: #777c82;
  font-size: 14px;
}
.ic-item-left {
  border-right: 2px solid #dbe3e8;
}
.background-ddd {
  background: #f0f2f5;
}
@media screen and (max-width: 1298px) {
  .ic-item {
    line-height: 30px;
  }
}
</style>

