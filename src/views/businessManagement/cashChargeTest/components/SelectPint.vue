<template>
  <!-- 选择打印机 -->
  <el-dialog
    title="打印发票"
    :visible.sync="dialogFormVisible"
    top="25vh"
    width="540px"
    center
    custom-class="dialog-background"
    :close-on-click-modal="false"
  >
    <!-- 其它费用 -->  
      <el-form
      :inline="false"
      :model="pint"
      class="head-search-form form-inline-small-input"
      size="small"
      label-width="120px"
      @submit.native.prevent>
      <el-form-item label="选择打印机：">
      <el-select v-model="pint.pintType" placeholder="选择打印机">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    
    <el-form-item label="选择发票模板：">
      <el-select v-model="pint.pintType" placeholder="选择发票模板">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" type="primary">确定</el-button>
      <el-button size="mini" @click="dialogFormVisible = false">取消</el-button>
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
      radio: 1,
      dialogFormVisible: false,
      options: [{ label: "打印机1", value: 1 }, { label: "打印机2", value: 2 }],
      pint:{
pintType: 1
      }
    };
  },
  methods: {
    getList() {},
    handleFilter() {}
  }
};
</script>
<style lang="scss" scoped>
/deep/ .dialog-background .el-dialog__body {
  padding: 50px 0 50px 95px;
}
</style>

