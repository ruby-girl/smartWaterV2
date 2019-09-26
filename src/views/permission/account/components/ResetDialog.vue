<template>
  <!-- 重置密码弹窗 -->
  <el-dialog
    title="重置密码"
    :visible.sync="rDialogFormVisible"
    top="30vh"
    width="400px"
    center
    @closed="resetDialogClose"
    :close-on-click-modal="false"
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
        <el-input @keyup.native="setNum" maxlength="18" placeholder="请输入新密码" v-model="resetData.pwd"></el-input>
      </el-form-item>
      <el-form-item label="确认密码：" prop="pwdNew">
        <el-input :disabled="disabled" @keyup.native="setConfirmNum" maxlength="18" placeholder="再次输入新密码" v-model="resetData.pwdNew"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" type="primary" @click="reset">确认</el-button>
      <el-button size="mini" @click="rDialogFormVisible = false">取消</el-button>
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
      if (
        this.resetData.pwdSave !== this.resetData.pwdNewSave &&
        this.resetData.pwdNewSave !== ""
      ) {
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
      if (this.resetData.pwdSave !== this.resetData.pwdNewSave) {
        return callback(new Error("二次输入的密码不一致"));
      }
      this.$refs["dataFormReset"].clearValidate();
      callback();
    };
    return {
      resetData: {
        pwd: "",
        pwdNew: "",
        pwdSave:"",
        pwdNewSave:""
      },
      disabled:true,
      rules: {
        pwd: [{ required: true, validator: userPwd, trigger: "blur" }],
        pwdNew: [{ required: true, validator: userPwdNew, trigger: "blur" }]
      },
      rDialogFormVisible: false
    };
  },
  methods: {
    setNum() {
      let value=this.resetData.pwd
     if(value.length>=this.resetData.pwdSave.length){
       this.resetData.pwdSave+=value.substr(this.resetData.pwdSave.length,value.length-this.resetData.pwdSave.length)
     }else{
       this.resetData.pwdSave=this.resetData.pwdSave.substr(0,value.length)
     }
     this.resetData.pwd=this.resetData.pwd.replace(/./g,"*")
     if(value.length>0)
       this.disabled=false
     else
      this.disabled=true
    },
    setConfirmNum(){
       let value=this.resetData.pwdNew
     if(value.length>=this.resetData.pwdNewSave.length){
       this.resetData.pwdNewSave+=value.substr(this.resetData.pwdNewSave.length,value.length-this.resetData.pwdNewSave.length)
     }else{
       this.resetData.pwdNewSave=this.resetData.pwdNewSave.substr(0,value.length)
     }
     this.resetData.pwdNew=this.resetData.pwdNew.replace(/./g,"*")
    },
    reset() {
      this.$refs["dataFormReset"].validate(valid => {
        if (!valid) return false;
        resetPwd({ userId: this.id, loginPwd: this.resetData.pwdSave }).then(
          res => {
            this.$message({
              message: res.message,
              type: "success",
              duration: 4000
            });
            this.rDialogFormVisible = false;
          }
        );
      });
    },
    resetDialogClose() {
      this.$nextTick(() => {
        this.resetData={
          pwd:'',
          pwdNew:'',
          pwdSave:'',
          pwdNewSave:''
        }
        this.$refs["dataFormReset"].clearValidate();
      });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>

