<template>
  <!-- 编辑弹窗 -->
  <el-dialog title="提示：远程只能水表请先获取表端最新数据" :visible.sync="dialogFormVisible" :close-on-click-modal="false" top="30vh" width="400px" center>
    <div>asd</div>
  </el-dialog>
</template>
<script>
import uploadBox from '@/components/Upload'
export default {
components: {uploadBox},
  props: {
    temp: {
      type: Object,
      default: function() {
        return {}
      }
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogFormVisible: true
    }
  },
  watch: {
    show () {   
      this.dialogFormVisible = this.show;
    },
    dialogFormVisible (val, oldVal) {
      if (val === oldVal) {
        return
      }
      this.$emit('update:show', val)
    }
  },
  methods: {
    createData() {
       this.$refs["dataForm"].validate(valid => {
        if (!valid) return false;
       this.$emit('createData', this.temp)
       })
    },
    updateData() {
       this.$refs["dataForm"].validate(valid => {
        if (!valid) return false;
      this.$emit('updateData', this.temp)
       })
    },
    getFileFun(){}
  }
}
</script>
<style lang="scss" scoped>
/deep/ .el-dialog__header{
    background: #AD8B00 !important;
}
</style>

