<template>
  <!-- 编辑弹窗 -->
  <el-dialog title="编辑" :visible.sync="dialogFormVisible" top="30vh" width="660px" center>
    <el-form
      ref="dataForm"
      :rules="rules"
      :model="temp"
      :inline="true"
      class="form-inline-small-input"
      size="small"
      label-width="100px"
    >
    <el-form-item label="人员编号：">
      <el-input v-model="temp.roleName" disabled></el-input>
    </el-form-item>
     <el-form-item label="关联角色：" prop="userNum">
      <el-select
        v-model="temp.userNum"
        multiple
        placeholder="可多选">
       <el-option
         v-for="item in editUserList"
         :key="item.label"
         :label="item.label"
         :value="item.type">
       </el-option>
    </el-select>
    </el-form-item>
    <el-form-item label="账号：">
      <el-input v-model="temp.roleName" disabled></el-input>
    </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="dialogFormVisible = false">取消</el-button>
      <el-button size="mini" type="primary" @click="updateData()">确认</el-button>
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
  data() {
    return {
      timevalue: [],
      editUserList: [{ label: '羊子兮', type: 1 },{ label: '羊子兮2', type: 2 }],
      rules: {
        userNum: [
          { required: true, message: '请选择角色', trigger: 'blur' }
        ]
      },
      dialogFormVisible: false
    }
  },
  methods: {
    updateData() {
      this.$emit('updateData', this.temp)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>

