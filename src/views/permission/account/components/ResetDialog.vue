<template>
  <!-- 重置密码弹窗 -->
  <el-dialog
    title="重置密码"
    :visible.sync="rDialogFormVisible"
    top="30vh"
    width="400px"
    center
    @closed="resetDialogClose"
  >
    <el-form
      ref="dataFormReset"
      :rules="rules"
      :inline="true"
      :model="resetData"
      class="form-inline-small-input"
      size="small"
      label-width="100px"
    >
      <el-form-item label="新密码：" prop="pwd">
        <el-input v-model="resetData.pwd"></el-input>
      </el-form-item>
      <el-form-item label="确认密码：" prop="pwdNew">
        <el-input v-model="resetData.pwdNew"></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="rDialogFormVisible = false">取消</el-button>
      <el-button size="mini" type="primary" @click="reset">确认</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { resetPwd } from "@/api/account";
export default {
  props: {
    id: {
      type: String,
      default: function() {
        return "";
      }
    },
    resetShow: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    resetShow() {
      this.rDialogFormVisible = this.resetShow;
    },
    rDialogFormVisible(val, oldVal) {
      if (val === oldVal) {
        return;
      }
      this.$emit("update:resetShow", val);
    }
  },
  data() {
    var userPwd = (rule, value, callback) => {   
      if (value === "") {
        return callback(new Error("不能为空"));
      }
      if (value.toString().length < 6 || value.toString().length > 18) {
        return callback(new Error("密码长度为6-18位"));
      }
    if (this.resetData.pwd !== this.resetData.pwdNew&&this.resetData.pwdNew!=='') {
        return callback(new Error("二次输入的密码不一致"));
      }
      this.$refs["dataFormReset"].clearValidate();
      callback();
    };
    var userPwdNew = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("不能为空"));
      }
       if (value.toString().length < 6 || value.toString().length > 18) {
        return callback(new Error("密码长度为6-18位"));
      }
      if (this.resetData.pwd !== this.resetData.pwdNew) {
        return callback(new Error("二次输入的密码不一致"));
      }
      this.$refs["dataFormReset"].clearValidate();
      callback();
    };
    return {
      resetData: {
        pwd: "",
        pwdNew: ""
      },
      rules: {
        pwd: [{ required: true, validator: userPwd, trigger: "blur" }],
        pwdNew: [{ required: true, validator: userPwdNew, trigger: "blur" }]
      },
      rDialogFormVisible: false
    };
  },
  methods: {
    reset() {
      this.$refs["dataFormReset"].validate(valid => {
        if (!valid) return false;
        resetPwd({userId:this.id,loginPwd:this.resetData.pwd}).then((res)=>{
             this.$message({
            message: res.message,
            type: "success"
          });
          this.rDialogFormVisible=false
        })
      });
    },
    resetDialogClose() {
      this.$nextTick(() => {
        this.$refs["dataFormReset"].clearValidate();
      });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>

