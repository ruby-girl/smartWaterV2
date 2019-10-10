<template>
  <!-- 新增弹窗 -->
  <el-dialog
    title="添加"
    :visible.sync="AdialogFormVisible"
    top="20vh"
    width="1020px"
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
          <el-radio label="1">是</el-radio>
          <el-radio label="2">否</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <components :is="LadderComponents" :temp="temp" ref="childrenTemp"></components>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" type="primary" @click="updateData()">确认</el-button>
      <el-button size="mini" @click="dialogFormVisible = false">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { numGetAccount } from "@/api/account";
import LadderTrue from "./LadderTrue";
import LadderFalse from "./LadderFalse";
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
    }
  },
  components: {
    LadderTrue,
    LadderFalse
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
    }, 
    "temp.isLadder": {
      handler(val, oldVal) {
        if (val == "1") {
          this.LadderComponents = "LadderTrue";
        } else {
          this.LadderComponents = "LadderFalse";
        }
      },
      immediate: true
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
      LadderComponents: "LadderTrue",
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
    updateData() {
      console.info(this.$refs.childrenTemp.temp);
    },
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

