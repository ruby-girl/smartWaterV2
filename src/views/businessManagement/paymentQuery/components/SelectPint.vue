<template>
  <!-- 选择打印机 -->
  <el-dialog
    title="打印发票"
    :visible.sync="dialogFormVisible"
    top="35vh"
    width="370px"
    center
    custom-class="dialog-background"
    :close-on-click-modal="false"
  >
     <div class="radio-item">
          <el-radio v-model="radio" label="1">打印小票</el-radio>
     </div>
     <div class="radio-item">
          <el-radio v-model="radio" label="2">打印发票</el-radio>
     </div>
     <div slot="footer" class="dialog-footer">
      <el-button size="mini" type="primary" @click="reset()">确认</el-button>
      <el-button size="mini" @click="AdialogFormVisible = false">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    selectPintShow: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    selectPintShow() {
      this.dialogFormVisible = this.selectPintShow;
    },
    dialogFormVisible(val, oldVal) {
      if (val === oldVal) {
        return;
      }
      this.$emit("update:selectPintShow", val);
    }
  },
  data() {
    return {
      radio: '1',
      dialogFormVisible: false,
      pintType:1
    };
  },
  methods: {
    getList() {},
    handleFilter(){}
  }
};
</script>
<style lang="scss" scoped>
/deep/ .dialog-background .el-dialog__body {
  padding: 15px 0 45px 50px;
}
.radio-item{
    padding-top:20px;
}
</style>

