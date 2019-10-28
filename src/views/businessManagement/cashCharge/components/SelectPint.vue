<template>
  <!-- 选择打印机 -->
  <el-dialog
    title="打印发票"
    :visible.sync="dialogFormVisible"
    top="20vh"
    width="540px"
    center
    custom-class="dialog-background"
    :close-on-click-modal="false"
  >
    <!-- 其它费用 -->
      <el-select v-model="pintType" placeholder="选择打印机">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
       <el-button type="primary" size="mini" @click="handleFilter">
           确定
        </el-button>
    
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
      radio: 1,
      dialogFormVisible: false,
      options:[{label:'打印机1',value:1},{label:'打印机2',value:2}],
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
  padding: 50px 0 200px 130px;
}
</style>

