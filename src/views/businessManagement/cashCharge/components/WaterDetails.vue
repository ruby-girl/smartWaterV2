<template>
  <!-- 水费详情弹窗 -->
   <!-- 新增弹窗 -->
  <el-dialog
    title="费用详情"
    :visible.sync="waterDetailsShow"
    top="20vh"
    width="1020px"
    center
    custom-class="nopadding  dialog-background"
    :close-on-click-modal="false"
  >
  <div>asd</div>
  </el-dialog>
   
</template>
<script>
export default {
  props: {
      waterDetailsShow:{
          type:Boolean,
          default:false
      }
  },
  data() {
    return {
      radio: 1
    };
  },
  methods: {
    getList() {}
  }
};
</script>
<style lang="scss" scoped>
.dialog-background{
  background: #F5F5F5;
  padding: 25px 20px 0 20px;
}
</style>

