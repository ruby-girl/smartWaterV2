<template>
  <!-- 新增弹窗 -->
  <el-dialog
    title="添加"
    :visible.sync="AdialogFormVisible"
    top="30vh"
    width="350px"
    center
    @closed="addDialogClose"
    :close-on-click-modal="false"
  >
    <el-form
      ref="dataFormAdd"
      :rules="rules"
      :model="temp"
      :inline="true"
      class="form-inline-small-input head-search-form"
      size="small"
      label-width="80px"
    >
      <el-form-item label="人员" prop="employeeId">
        <!-- <el-input maxlength="10" v-model="temp.employeeId" placeholder="请输入人员编号"></el-input> -->
        <el-select v-model="temp.employeeId" filterable remote :filter-method="selectOption" @visible-change="userChange" placeholder="请输入人员信息">
          <el-option
            v-for="item in userOptions"
            :key="item.value"
            :label="item.EmpName"
            :value="item.Id"
          >
          <span style="float: left">{{ item.EmpName }}</span>
      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.EmpNo }}</span>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="角色" prop="roleId">
        <el-select v-model="temp.roleId" placeholder="请选择" :disabled="temp.employeeId==''?true:false">
          <el-option v-for="item in roleList" :key="item.Id" :label="item.Name" :value="item.Id" />
        </el-select>
      </el-form-item>
      <el-form-item label="账号" prop="loginName">
        <el-input
          v-model="temp.loginName"
          :disabled="temp.employeeId==''?true:false"
          maxlength="20"
          placeholder="长度20"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="loginPwdSave">
        <el-input
          v-model="temp.loginPwdSave"
          :disabled="temp.employeeId==''?true:false"
          maxlength="18"
          @keyup.native="setNum"
          placeholder="请输入6-18位密码"
        ></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button size="mini" type="primary" @click="createData">确认</el-button>
      <el-button size="mini" @click="AdialogFormVisible = false">取消</el-button>
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
    addShow: {
      type: Boolean,
      default: false
    },
    roleList: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  watch: {
    addShow() {
      this.AdialogFormVisible = this.addShow;
    },
    AdialogFormVisible(val, oldVal) {
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
    var employeeId = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("不能为空"));
      }

      if (value.length < 11) {
        numGetAccount(value).then(res => {
          if (res.data) {
            if (res.data.SYS_User_Id) {
              this.temp.employeeId = ""; //人员表ID
              return callback(new Error("已存在"));
            } else {
              this.temp.employeeId = res.data.Id; //人员表ID
              callback();
            }
          } else {
            this.temp.employeeId = ""; //人员表ID
            return callback(new Error("信息有误"));
          }
        });
      } else {
        return callback(new Error("最大长度为10位"));
      }
    };
    return {
      timevalue: [],
      rules: {
        employeeId: [{ required: true, message: "不能为空", trigger: "blur" }],
        roleId: [{ required: true, message: "不能为空", trigger: "blur" }],
        loginName: [
          { required: true, message: "不能为空", trigger: "blur" },
          {
            max: 20,
            message: "最大长度为20位"
          }
        ],
        loginPwdSave: [
          { required: true, message: "不能为空", trigger: "blur" },
          {
            min: 6,
            max: 18,
            message: "密码长度为6-18位"
          }
        ]
      },
      AdialogFormVisible: false,
      passwordSave: "",
      userOptions: [],
      userOptionsSave:[]
    };
  },
  methods: {
    userChange(){
      let _this=this
      setTimeout(function(){
        _this.userOptions = _this.userOptionsSave
      },500)
    },
    selectOption(query){
      if (query !== ''&&query) {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.userOptions = this.userOptionsSave.filter(item => {
              return item.EmpName.toLowerCase()
                .indexOf(query.toLowerCase()) > -1||item.EmpNo
                .indexOf(query.toLowerCase()) > -1;
            });
          }, 200);
        } else {
          this.userOptions = this.userOptionsSave
        }
    },
    setNum() {
      let value = this.temp.loginPwdSave;
      if (value.length >= this.passwordSave.length) {
        this.passwordSave += value.substr(
          this.passwordSave.length,
          value.length - this.passwordSave.length
        );
      } else {
        this.passwordSave = this.passwordSave.substr(0, value.length);
      }
      this.temp.loginPwdSave = this.temp.loginPwdSave.replace(/./g, "*");
    },
    createData() {
      this.$refs["dataFormAdd"].validate(valid => {
        if (!valid) return false;
        else{
          this.temp.loginPwd=this.passwordSave
          this.$emit("createData", this.temp)
        }
      });
    },
    addDialogClose() {
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

