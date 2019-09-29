<template>
  <!-- 新增弹窗 -->
  <el-dialog
    title="添加"
    :visible.sync="AdialogFormVisible"
    top="30vh"
    width="1000px"
    center
    custom-class="nopadding"
    @closed="addDialogClose"
    :close-on-click-modal="false"
  >
    <el-form
      ref="dataFormAdd"
      :rules="rules"
      :model="temp"
      :inline="true"
      class="form-inline-small-input dialog-title-border-shadow"
      size="small"
      label-width="120px"
    >
      <el-form-item label="是否执行阶梯计价">
        <el-radio-group v-model="temp.isLadder">
          <el-radio label="是" value="1"></el-radio>
          <el-radio label="否" value="0"></el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div>asdasdasdasd</div>
     <div>asdasdasdasd</div>
      <div>asdasdasdasd</div>
       <div>asdasdasdasd</div>
  </el-dialog>
</template>
<script>
import { numGetAccount } from "@/api/account";
import { setTimeout } from "timers";
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
  mounted() {
    numGetAccount("-1").then(res => {
      if (res.data) {
        this.userOptions = res.data;
        this.userOptionsSave = res.data;
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
      userOptionsSave: []
    };
  },
  methods: {
    userChange() {
      let _this = this;
      setTimeout(function() {
        _this.userOptions = _this.userOptionsSave;
      }, 500);
    },
    selectOption(query) {
      if (query !== "" && query) {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.userOptions = this.userOptionsSave.filter(item => {
            return (
              item.EmpName.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
              item.EmpNo.indexOf(query.toLowerCase()) > -1
            );
          });
        }, 200);
      } else {
        this.userOptions = this.userOptionsSave;
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
        else {
          this.temp.loginPwd = this.passwordSave;
          this.$emit("createData", this.temp);
        }
      });
    },
    addDialogClose() {
      this.$nextTick(() => {
        this.userOptions = this.userOptionsSave;
        this.$refs["dataFormAdd"].clearValidate();
      });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>

