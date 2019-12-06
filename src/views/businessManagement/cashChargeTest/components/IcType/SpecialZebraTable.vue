<template>
  <!-- 卡片-->
  <el-row :class="{'background-ddd':isGray,'ic-item':true}">
    <el-col :md="24" class="pl-15">
      <el-row class="ic-item-left" :style="{'lineHeight':lineHeight+'px'}">
        <el-col :xs="10" :md="10" :style="{'color':color}">{{labelLeft}}</el-col>
        <!-- You -->
        <el-col :xs="14" :md="14" class="text-wrap" :style="{'color':color,'fontWeight':fontWeight}">{{valueLeft}}</el-col>
      </el-row>
    </el-col>
    <!-- You -->
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
    isGray: {
      type: Boolean,
      default: false
    },
    fontWeight: {
      type: String,
      default: ""
    },
    lineHeight:{
        type: String,
      default: ""
    },
    color: {
      type: String,
      default: ""
    },
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
  border-right: 1px solid #dbe3e8;
}
.background-ddd {
  background: #f0f2f5;
}
// @media screen and (max-width: 1298px) {
//   .ic-item {
//     line-height: 30px;
//   }
// }
.text-right{
  text-align: right;
}
.text-wrap {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

