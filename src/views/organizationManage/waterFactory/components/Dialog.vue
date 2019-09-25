<template>
  <!-- 新增弹窗 -->
  <el-dialog
    :title="dialogStatus=='create'?'添加':'编辑'"
    :visible.sync="dialogFormVisible"
    top="30vh"
    width="350px"
    center
    @closed="dialogClose"
    :close-on-click-modal="false"
  >
    <el-form
      ref="dataForm"
      :rules="rules"
      :model="temp"
      :inline="true"
      class="form-inline-small-input"
      size="small"
      label-width="100px"
    >
      <el-form-item label="账号：" prop="WaterWorksName">
        <el-input
          v-model="temp.WaterWorksName"
          maxlength="20"
          placeholder="长度20"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="dialogFormVisible = false">取消</el-button>
      <el-button size="mini" type="primary" @click="createData">确认</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { numGetAccount } from "@/api/account";
import { setTimeout } from 'timers';
export default {
  props: {
    temp: {
      type: Object,
      default: function() {
        return {};
      }
    },
    show: {
      type: Boolean,
      default: false 
    },
    dialogStatus:{
      type: String,
      default: "create" 
    }
  },
  watch: {
    show() {
      this.dialogFormVisible = this.show;
    },
    dialogFormVisible(val, oldVal) {
      if (val === oldVal) {
        return;
      }
      this.$emit("update:addShow", val);
    }
  },
  mounted(){
    numGetAccount('-1').then(res => {
      if (res.data) {
        this.userOptions=res.data
        this.userOptionsSave=res.data
      }
    });
  },
  data() {
    return {
      rules: {
        WaterWorksName: [{ required: true, message: "不能为空", trigger: "blur" }],
      },
      dialogFormVisible: false,
    };
  },
  methods: {
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (!valid) return false;
        else{     
          this.$emit("createData", this.temp)
        }
      });
    },
    dialogClose() {
      this.$nextTick(() => {
        this.userOptions = this.userOptionsSave
        this.$refs["dataFormAdd"].clearValidate();
      });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>

