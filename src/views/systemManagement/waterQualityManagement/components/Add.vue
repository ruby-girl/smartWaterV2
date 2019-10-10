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
    <components :is="LadderComponents" :temp="temp" ref="childrenTemp" :type-list="typeList"></components>
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
    },
    typeList: {
      type: Array,
      default: function() {
        return [];
      }
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
    return {
      timevalue: [],
      LadderComponents: "LadderTrue",
      AdialogFormVisible: false,
      userOptions: [],
      userOptionsSave: []
    };
  },
  methods: {
    updateData() {
      this.$refs["dataFormAdd"].validate(valid => {
        if (!valid) return false;
        else {      
          this.$emit("updateData", this.temp);
        }
      });
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

