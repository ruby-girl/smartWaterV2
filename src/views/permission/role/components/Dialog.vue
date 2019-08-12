<template>
  <!-- 编辑弹窗 -->
  <el-dialog :title="dialogStatus==='create'?'添加':'编辑'" :visible.sync="dialogFormVisible" top="30vh" width="390px" center>
    <el-form
      ref="dataForm"
      :rules="rules"
      :model="temp"
      :inline="true"
      class="form-inline-small-input"
      size="small"
      label-width="100px"
    >
      <el-form-item label="角色名称：" prop="RoleName">
        <el-input v-model="temp.RoleName " />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="dialogFormVisible = false">取消</el-button>
      <el-button size="mini" type="primary" @click="dialogStatus==='create'?createData():updateData()">确认</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    dialogStatus: {
      type: String,
      default: function() {
        return ''
      }
    },
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
      rules: {
        RoleName: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { max: 20, message: '最大长度20个字符', trigger: 'blur' }
        ]
      },
      dialogFormVisible: false
    }
  },
  watch: {
    show () {
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
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
      this.$emit('createData', this.temp)
    },
    updateData() {
      this.$emit('updateData', this.temp)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>

