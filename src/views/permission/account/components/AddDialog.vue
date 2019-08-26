<template>
  <!-- 新增弹窗 -->
  <el-dialog
    title="添加"
    :visible.sync="AdialogFormVisible"
    top="30vh"
    width="674px"
    center
    @closed="addDialogClose"
  >
    <el-form
      ref="dataFormAdd"
      :rules="rules"
      :model="temp"
      :inline="true"
      class="form-inline-small-input"
      size="small"
      label-width="100px"
    >
      <el-form-item label="人员编号：" prop="userNum">
        <el-input v-model="temp.userNum"></el-input>
      </el-form-item>
      <el-form-item label="角色：" prop="roleId">
        <el-select v-model="temp.roleId" placeholder="请选择">
          <el-option v-for="item in roleList" :key="item.Id" :label="item.Name" :value="item.Id" />
        </el-select>
      </el-form-item>
      <el-form-item label="账号：" prop="loginName">
        <el-input v-model="temp.loginName"></el-input>
      </el-form-item>
      <el-form-item label="密码：" prop="loginPwd">
        <el-input v-model="temp.loginPwd"></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="AdialogFormVisible = false">取消</el-button>
      <el-button size="mini" type="primary" @click="createData">确认</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { numGetAccount } from "@/api/account";
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
  data() {
    var userNum = (rule, value, callback) => {
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
        userNum: [{ required: true, validator: userNum, trigger: "blur" }],
        roleId: [{ required: true, message: "不能为空", trigger: "blur" }],
        loginName: [{ required: true, message: "不能为空", trigger: "blur"},{
        max: 20,
        message: '最大长度为20位'
        }],
        loginPwd: [{ required: true, message: "不能为空", trigger: "blur" },{
        min:6,
        max: 18,
        message: '密码长度为6-18位'
        }]
      },
      AdialogFormVisible: false
    };
  },
  methods: {
    createData() {
      this.$refs["dataFormAdd"].validate(valid => {
        if (!valid) return false;
        else this.$emit("createData", this.temp);
      });
    },
    addDialogClose() {
      this.$nextTick(() => {
        this.$refs["dataFormAdd"].clearValidate();
      });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>

