<template>
  <!-- 编辑弹窗 -->
  <el-dialog title="添加" :visible.sync="AdialogFormVisible" top="30vh" width="660px" center @closed="addDialogClose">
    <el-form
      ref="dataFormAdd"
      :rules="rules"
      :model="temp"
      :inline="true"
      class="form-inline-small-input"
      size="small"
      label-width="100px"
    >
    <el-form-item label="人员编号：" prop="roleNum">
      <el-input v-model="temp.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色：">
      <el-select
        v-model="temp.userNum"
        placeholder="请选择">
       <el-option
          v-for="item in roleList"
          :key="item.Id"
          :label="item.Name"
          :value="item.Id"
        />
    </el-select>
    </el-form-item>
    <el-form-item label="账号：">
      <el-input v-model="temp.roleName"></el-input>
    </el-form-item>
    <el-form-item label="密码：">
      <el-input v-model="temp.roleName"></el-input>
    </el-form-item>
    </el-form>
    
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="AdialogFormVisible = false">取消</el-button>
      <el-button size="mini" type="primary" @click="createData()">确认</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    temp: {
      type: Object,
      default: function() {
        return {}
      }
    },
    addShow: {
      type: Boolean,
      default: false 
    },
    roleList:{
      type: Array,
      default: function() {
        return []
      }
    }
  },
  watch: {
    addShow () {
      this.AdialogFormVisible = this.addShow;
      console.info(this.temp)
    },
    AdialogFormVisible (val, oldVal) {
      if (val === oldVal) {
        return
      }
      this.$emit('update:addShow', val)
    }
  },
  data() {
    return {
      timevalue: [],
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { max: 20, message: '最大长度20个字符', trigger: 'blur' }
        ],
        roleNum: [{ required: true, message: "必填", trigger: "blur" }]
      },
      AdialogFormVisible: false
    }
  },
  methods: {
    createData() {
      this.$emit('createData', this.temp)
    },
    addDialogClose() {
      this.$nextTick(() => {
        this.$refs['dataFormAdd'].clearValidate()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>

