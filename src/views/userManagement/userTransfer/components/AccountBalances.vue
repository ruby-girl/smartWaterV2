<template>
  <!-- 编辑弹窗 -->
  <el-dialog
    title="提示：远程智能水表请先获取表端最新数据"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    top="30vh"
    width="400px"
    center
  >
    <div class="text-center">
      当前原用户剩余余额为：
      <span class="main-color-red">{{user.BalanceValue}}</span>元
    </div>
    <div class="account-box" v-if="user.BalanceValue>0">
      <el-form ref="form" :model="user" label-width="80px">
        <el-form-item label="是否转存">
          <el-radio-group v-model="user.IsBalanceDeposit">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="经办人" v-show="user.IsBalanceDeposit==false">
          <el-select v-model="user.OperatorEmpId">
            <el-option
              v-for="item in editUserList"
              :key="item.Id"
              :label="item.Name"
              :value="item.Id"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" type="primary" @click="accountBalancesFunc">确认过户</el-button>
      <el-button size="mini" @click="dialogFormVisible = false">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getSelectUser } from "@/api/account"; //获取操作人下拉框
export default {
  props: {
    user: {
      type: Object,
      default: function() {
        return {};
      }
    },
    accountShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      editUserList: []
    };
  },
  watch: {
    user:{
      handler(val, oldVal) {
        console.info('zujian',val)
      },
      immediate: true
    },
    accountShow(v) {
      this.dialogFormVisible = v;
    },
    dialogFormVisible(val, oldVal) {
      if (val === oldVal) {
        return;
      }
      this.$emit("update:accountShow", val);
    }
  },
  created() {
    getSelectUser().then(res => {
      this.editUserList = res.data;
    });
  },
  methods: {
    accountBalancesFunc(){
      if(this.user.IsBalanceDeposit&&!this.user.OperatorEmpId){
        this.$message({
            message: "余额转存，需选择经办人!",
            type: "error",
            duration: 4000
          });
          return
      }
      this.$emit("accountBalancesFunc",this.user)
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/ .el-dialog__header {
  background: #ad8b00 !important;
}
.account-box {
  background: #f5f5f5;
  padding: 15px 0 5px 0;
}
</style>

